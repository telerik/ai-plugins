param(
    [Parameter(Mandatory = $true)]
    [string]$Event
)

$ErrorActionPreference = 'Stop'

function Write-Success {
    [Console]::Out.WriteLine('{"continue":true}')
    exit 0
}

function Get-FirstValue {
    param(
        [AllowNull()]
        [object]$Object,
        [string[]]$Names
    )

    if ($null -eq $Object) {
        return $null
    }

    foreach ($name in $Names) {
        $property = $Object.PSObject.Properties[$name]
        if ($null -ne $property -and $null -ne $property.Value -and -not [string]::IsNullOrWhiteSpace([string]$property.Value)) {
            return $property.Value
        }
    }

    return $null
}

function Get-SessionId {
    param([object]$InputData)

    $sessionId = Get-FirstValue $InputData @('session_id', 'sessionId')
    if ($null -eq $sessionId) {
        return 'unknown'
    }

    return [string]$sessionId
}

function Get-Timestamp {
    param([object]$InputData)

    $value = Get-FirstValue $InputData @('timestamp')
    if ($null -ne $value) {
        [long]$milliseconds = 0
        if ([long]::TryParse(
                [string]$value,
                [Globalization.NumberStyles]::Integer,
                [Globalization.CultureInfo]::InvariantCulture,
                [ref]$milliseconds
            )) {
            try {
                return [DateTimeOffset]::FromUnixTimeMilliseconds($milliseconds).ToUniversalTime().ToString('o')
            } catch {
            }
        }

        [DateTimeOffset]$parsedTimestamp = [DateTimeOffset]::MinValue
        if ([DateTimeOffset]::TryParse(
                [string]$value,
                [Globalization.CultureInfo]::InvariantCulture,
                [Globalization.DateTimeStyles]::AssumeUniversal,
                [ref]$parsedTimestamp
            )) {
            return $parsedTimestamp.ToUniversalTime().ToString('o')
        }
    }

    return [DateTimeOffset]::UtcNow.ToString('o')
}

function Get-SafeSessionId {
    param([string]$SessionId)

    $safeSessionId = [Regex]::Replace($SessionId, '[^A-Za-z0-9._-]', '_')
    if ([string]::IsNullOrWhiteSpace($safeSessionId)) {
        return 'unknown'
    }

    return $safeSessionId
}

function Get-LogFilePath {
    param([string]$SessionId)

    $appData = if (-not [string]::IsNullOrWhiteSpace($env:APPDATA)) {
        $env:APPDATA
    } else {
        [Environment]::GetFolderPath([Environment+SpecialFolder]::ApplicationData)
    }

    if ([string]::IsNullOrWhiteSpace($appData)) {
        throw 'The application-data directory could not be resolved.'
    }

    $logDirectory = Join-Path (Join-Path $appData 'Telerik') 'upgrade-plugin'
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

    return Join-Path $logDirectory ("session-{0}.jsonl" -f (Get-SafeSessionId $SessionId))
}

function Get-SkillMetadata {
    param([string]$FilePath)

    $resolvedPath = if ([IO.Path]::IsPathRooted($FilePath)) {
        $FilePath
    } else {
        [IO.Path]::GetFullPath($FilePath)
    }

    if (-not [IO.File]::Exists($resolvedPath)) {
        return @{}
    }

    $content = [IO.File]::ReadAllText($resolvedPath)
    if ($content -notmatch '(?s)\A---\s*(?<frontMatter>.*?)\s*---') {
        return @{}
    }

    $frontMatter = $Matches['frontMatter']
    $metadata = @{}

    foreach ($key in @('name', 'discovery')) {
        $pattern = "(?m)^\s*$([Regex]::Escape($key))\s*:\s*(?<value>[^#\r\n]+)"
        if ($frontMatter -match $pattern) {
            $value = $Matches['value'].Trim()
            if ($value.Length -ge 2 -and (
                    ($value.StartsWith('"') -and $value.EndsWith('"')) -or
                    ($value.StartsWith("'") -and $value.EndsWith("'"))
                )) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            $metadata[$key] = $value
        }
    }

    return $metadata
}

function Get-SkillIdFromPath {
    param([string]$NormalizedPath)

    if ($NormalizedPath -match '/(?<skillId>[^/]+)/SKILL\.md$') {
        return $Matches['skillId']
    }

    return 'unknown'
}

function Get-DiscoveryFallback {
    param([string]$NormalizedPath)

    if ($NormalizedPath -match '/scenarios/') {
        return 'scenario'
    }
    if ($NormalizedPath -match '/lazy/') {
        return 'lazy'
    }
    if ($NormalizedPath -match '/extensions/') {
        return 'scenarioExtension'
    }

    return 'unknown'
}

function Test-WinFormsSkillPath {
    param(
        [string]$NormalizedPath,
        [string]$SkillId
    )

    $hasSkillLayout = $NormalizedPath -match '(?:/upgrade/(?:[^/]+/)?skills/|/extensions/[^/]+/skills/)(?:[^/]+/)+SKILL\.md$'
    $hasPluginMarker = $NormalizedPath -match '/telerik-winforms-upgrade-plugin(?:[-_][^/]*)?/'
    $hasKnownSkillId = $SkillId -match '^(telerik-winforms-|telerik-for-dotnet-)'

    return $hasSkillLayout -and ($hasPluginMarker -or $hasKnownSkillId)
}

function Get-ResponseText {
    param([AllowNull()][object]$Response)

    if ($null -eq $Response) { return }
    if ($Response -is [string]) {
        $Response
    } elseif ($Response -is [System.Collections.IEnumerable]) {
        foreach ($item in $Response) { Get-ResponseText $item }
    } elseif ($Response.isError -ne $true) {
        foreach ($key in @('content', 'text', 'value', 'result', 'text_result_for_llm')) {
            $property = $Response.PSObject.Properties[$key]
            if ($null -ne $property) { Get-ResponseText $property.Value }
        }
    }
}

function Write-McpSkillEntries {
    param([object]$InputData, [string]$LogFile, [string]$SessionId, [string]$Timestamp)

    $response = Get-FirstValue $InputData @('tool_response', 'toolResult', 'tool_result')
    if ($response -is [string] -and $response.TrimStart().StartsWith('{')) {
        $response = $response | ConvertFrom-Json
    }
    $text = (Get-ResponseText $response) -join "`n"
    if (-not $text) { return }

    $skillsRoot = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) 'upgrade\skills'
    $catalog = @{}
    foreach ($file in Get-ChildItem -LiteralPath $skillsRoot -Filter SKILL.md -Recurse -File) {
        $metadata = Get-SkillMetadata $file.FullName
        if ($metadata['name'] -and $metadata['discovery']) {
            $catalog[$metadata['name']] = $metadata['discovery']
        }
    }
    $seen = @{}
    foreach ($match in [Regex]::Matches($text, '(?s)<skill\b[^>]*\bname\s*=\s*["''](?<id>[^"'']+)["''][^>]*>.*?</skill>')) {
        $id = $match.Groups['id'].Value
        if ($catalog.ContainsKey($id) -and -not $seen.ContainsKey($id)) {
            $seen[$id] = $true
            Write-LogEntry $LogFile ([ordered]@{
                    event = 'skill_read'
                    timestamp = $Timestamp
                    session_id = $SessionId
                    skill_id = $id
                    discovery = $catalog[$id]
                })
        }
    }
}

function Write-LogEntry {
    param(
        [string]$LogFile,
        [System.Collections.IDictionary]$Entry
    )

    $Entry['source'] = 'telerik-winforms-upgrade-plugin'
    $line = $Entry | ConvertTo-Json -Compress -Depth 4
    [IO.File]::AppendAllText(
        $LogFile,
        $line + [Environment]::NewLine,
        [Text.UTF8Encoding]::new($false)
    )

    Send-Telemetry $line
}

function Invoke-TelemetryCli {
    param(
        [string]$Executable,
        [string]$Arguments,
        [string]$Line = ''
    )

    $process = New-Object Diagnostics.Process
    try {
        $process.StartInfo = New-Object Diagnostics.ProcessStartInfo
        $process.StartInfo.FileName = $Executable
        $process.StartInfo.Arguments = $Arguments
        $process.StartInfo.UseShellExecute = $false
        $process.StartInfo.CreateNoWindow = $true
        $process.StartInfo.RedirectStandardInput = $true
        $process.StartInfo.RedirectStandardOutput = $true
        $process.StartInfo.RedirectStandardError = $true
        [void]$process.Start()
        $stdout = $process.StandardOutput.ReadToEndAsync()
        $stderr = $process.StandardError.ReadToEndAsync()
        if ($Line) {
            $bytes = [Text.Encoding]::UTF8.GetBytes($Line + "`n")
            $process.StandardInput.BaseStream.Write($bytes, 0, $bytes.Length)
        }
        $process.StandardInput.Close()
        if (-not $process.WaitForExit(1000)) {
            $process.Kill()
            $process.WaitForExit()
            [Console]::Error.WriteLine('Telerik telemetry CLI timed out; the record remains in the local log.')
            return $false
        }
        $process.WaitForExit()
        [void]$stdout.GetAwaiter().GetResult()
        [void]$stderr.GetAwaiter().GetResult()
        if ($process.ExitCode -ne 0) {
            [Console]::Error.WriteLine("Telerik telemetry CLI failed (exit $($process.ExitCode)); the record remains in the local log.")
            return $false
        }
        return $true
    } finally {
        $process.Dispose()
    }
}

function Send-Telemetry {
    param([string]$Line)

    if ($env:TELERIK_TELEMETRY_OFF -eq '1') {
        return
    }
    $cli = Get-Command telerik -CommandType Application -ErrorAction SilentlyContinue
    if ($null -eq $cli) {
        return
    }
    if (Invoke-TelemetryCli $cli.Source 'telemetry record --help') {
        [void](Invoke-TelemetryCli $cli.Source 'telemetry record --source winforms-upgrade-plugin --stdin' $Line)
    }
}

if ($env:TELERIK_TELEMETRY_OFF -eq '1') {
    Write-Success
}

if ($Event -notin @('session_start', 'skill_read', 'session_end')) {
    Write-Success
}

try {
    try {
        $inputJson = [Console]::In.ReadToEnd()
    } catch {
        Write-Success
    }

    if ([string]::IsNullOrWhiteSpace($inputJson)) {
        Write-Success
    }

    try {
        $inputData = $inputJson | ConvertFrom-Json
    } catch {
        [Console]::Error.WriteLine("Telerik WinForms telemetry hook received invalid JSON: $($_.Exception.Message)")
        Write-Success
    }

    if ($Event -eq 'skill_read' -and $env:TELERIK_HOOK_DIAGNOSTICS -eq '1') {
        $fields = @()
        foreach ($property in $inputData.PSObject.Properties) {
            $value = $property.Value
            $fields += [ordered]@{
                name = $property.Name
                type = if ($null -eq $value) { 'null' } else { $value.GetType().Name }
                children = if ($value -is [PSCustomObject]) {
                    @($value.PSObject.Properties | ForEach-Object {
                            [ordered]@{
                                name = $_.Name
                                type = if ($null -eq $_.Value) { 'null' } else { $_.Value.GetType().Name }
                            }
                        })
                } else { @() }
            }
        }
        $response = Get-FirstValue $inputData @('tool_response', 'toolResult', 'tool_result')
        $responseText = (Get-ResponseText $response) -join "`n"
        $skillNames = @([Regex]::Matches($responseText, '<skill\b[^>]*\bname\s*=\s*["'']([^"'']+)["'']') |
            ForEach-Object { $_.Groups[1].Value })
        $diagnostic = [ordered]@{
            timestamp = [DateTimeOffset]::UtcNow.ToString('o')
            tool_name = Get-FirstValue $inputData @('tool_name', 'toolName')
            fields = $fields
            returned_skill_names = $skillNames
        } | ConvertTo-Json -Compress -Depth 6
        $diagnosticDirectory = Join-Path (Join-Path $env:APPDATA 'Telerik') 'upgrade-plugin'
        New-Item -ItemType Directory -Path $diagnosticDirectory -Force | Out-Null
        [IO.File]::AppendAllText(
            (Join-Path $diagnosticDirectory 'hook-diagnostics.jsonl'),
            $diagnostic + [Environment]::NewLine,
            [Text.UTF8Encoding]::new($false)
        )
    }

    $sessionId = Get-SessionId $inputData
    $timestamp = Get-Timestamp $inputData
    $logFile = Get-LogFilePath $sessionId

    if ($Event -eq 'skill_read') {
        $toolName = Get-FirstValue $inputData @('tool_name', 'toolName')
        if ($toolName -match '(?i)upgrade.*[/_.:-]get_instructions$') {
            Write-McpSkillEntries $inputData $logFile $sessionId $timestamp
            Write-Success
        }
        if ($toolName -notin @('read_file', 'view', 'Read')) {
            Write-Success
        }

        $toolInput = Get-FirstValue $inputData @('tool_input', 'toolArgs')
        if ($toolInput -is [string]) {
            try {
                $toolInput = $toolInput | ConvertFrom-Json
            } catch {
                Write-Success
            }
        }

        $filePath = Get-FirstValue $toolInput @('file_path', 'filePath', 'path')
        if ($null -eq $filePath) {
            Write-Success
        }

        $filePath = [string]$filePath
        $normalizedPath = $filePath -replace '\\', '/'
        $pathSkillId = Get-SkillIdFromPath $normalizedPath
        if (-not (Test-WinFormsSkillPath $normalizedPath $pathSkillId)) {
            Write-Success
        }

        $skillMetadata = Get-SkillMetadata $filePath
        $skillId = if ($skillMetadata.ContainsKey('name')) {
            [string]$skillMetadata['name']
        } else {
            $pathSkillId
        }
        $discovery = if ($skillMetadata.ContainsKey('discovery')) {
            [string]$skillMetadata['discovery']
        } else {
            Get-DiscoveryFallback $normalizedPath
        }

        Write-LogEntry $logFile ([ordered]@{
                event      = 'skill_read'
                timestamp  = $timestamp
                session_id = $sessionId
                skill_id   = $skillId
                discovery  = $discovery
            })
    } elseif ($Event -eq 'session_start') {
        Write-LogEntry $logFile ([ordered]@{
                event      = 'session_start'
                timestamp  = $timestamp
                session_id = $sessionId
            })
    } else {
        Write-LogEntry $logFile ([ordered]@{
                event      = 'session_end'
                timestamp  = $timestamp
                session_id = $sessionId
            })
    }
} catch {
    [Console]::Error.WriteLine("Telerik WinForms telemetry hook failed: $($_.Exception.Message)")
}

Write-Success
