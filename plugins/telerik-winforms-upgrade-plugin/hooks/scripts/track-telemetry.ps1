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

function Get-WorkflowNodes {
    param([AllowNull()][object]$Value)

    if ($null -eq $Value) { return }
    if ($Value -is [PSCustomObject]) {
        $Value
        foreach ($property in $Value.PSObject.Properties) {
            Get-WorkflowNodes $property.Value
        }
    } elseif ($Value -is [System.Collections.IEnumerable] -and $Value -isnot [string]) {
        foreach ($item in $Value) {
            Get-WorkflowNodes $item
        }
    }
}

function Get-WinFormsScenarioId {
    param([string]$LogFile, [string]$ResponseText)

    $scenarioIds = @(
        'telerik-winforms-version-upgrade',
        'telerik-winforms-control-conversion',
        'telerik-winforms-assembly-to-nuget',
        'telerik-winforms-licensing',
        'telerik-for-dotnet-version-upgrade',
        'telerik-for-dotnet-framework-upgrade'
    )
    $responseScenarios = @($scenarioIds | Where-Object { $ResponseText.Contains($_) })
    if ($responseScenarios.Count -eq 1) {
        return $responseScenarios[0]
    }

    if ([IO.File]::Exists($LogFile)) {
        $entries = [IO.File]::ReadAllLines($LogFile)
        for ($index = $entries.Length - 1; $index -ge 0; $index--) {
            try {
                $entry = $entries[$index] | ConvertFrom-Json
                if ($entry.event -eq 'skill_read' -and
                    $entry.skill_id -in $scenarioIds) {
                    return [string]$entry.skill_id
                }
            } catch {
            }
        }
    }

    return $null
}

function Write-WorkflowEntries {
    param(
        [object]$InputData,
        [string]$LogFile,
        [string]$SessionId,
        [string]$Timestamp
    )

    $toolName = [string](Get-FirstValue $InputData @('tool_name', 'toolName'))
    if ($toolName -notmatch '(?i)upgrade.*[/_.:-](get_state|complete_task)$') {
        return
    }

    $toolInput = Get-FirstValue $InputData @('tool_input', 'toolArgs')
    if ($toolInput -is [string]) {
        try {
            $toolInput = $toolInput | ConvertFrom-Json
        } catch {
            $toolInput = $null
        }
    }

    $response = Get-FirstValue $InputData @('tool_response', 'toolResult', 'tool_result')
    if ($response -is [string] -and $response.TrimStart().StartsWith('{')) {
        try {
            $response = $response | ConvertFrom-Json
        } catch {
        }
    }
    $responseText = (Get-ResponseText $response) -join "`n"
    $scenarioId = Get-WinFormsScenarioId $LogFile $responseText
    if (-not $scenarioId) {
        return
    }

    $isCompleteTask = $toolName -match '(?i)upgrade.*[/_.:-]complete_task$'
    $taskId = Get-FirstValue $toolInput @('taskId', 'task_id')
    if ($isCompleteTask -and $null -ne $taskId) {
        $failedProperty = $toolInput.PSObject.Properties['failed']
        $taskFailed = $null -ne $failedProperty -and $failedProperty.Value -eq $true
        Write-LogEntry $LogFile ([ordered]@{
                event       = 'workflow_task_result'
                timestamp   = $Timestamp
                session_id  = $SessionId
                scenario_id = $scenarioId
                task_id     = [string]$taskId
                failed      = $taskFailed
            })
    }

    $responseNodes = @(Get-WorkflowNodes $response)
    if ($responseText.TrimStart().StartsWith('{') -or
        $responseText.TrimStart().StartsWith('[')) {
        try {
            $responseTextData = $responseText | ConvertFrom-Json
            $responseNodes += @(Get-WorkflowNodes $responseTextData)
        } catch {
        }
    }
    $allTasksComplete = $false
    $totalTasks = $null
    $reportedFailedTasks = $null
    $taskSnapshots = @()
    $fullTaskSnapshotCount = $null
    $responseFailedCount = 0
    foreach ($node in $responseNodes) {
        $completeProperty = $node.PSObject.Properties['allTasksComplete']
        if ($null -ne $completeProperty -and $completeProperty.Value -eq $true) {
            $allTasksComplete = $true
        }
        if ($null -eq $totalTasks) {
            foreach ($key in @('totalTasks', 'totalTaskCount', 'taskCount')) {
                $property = $node.PSObject.Properties[$key]
                if ($null -ne $property -and $property.Value -is [int]) {
                    $totalTasks = [int]$property.Value
                    break
                }
            }
        }
        $failedTasksProperty = $node.PSObject.Properties['failedTasks']
        if ($null -eq $reportedFailedTasks -and $null -ne $failedTasksProperty -and
            $failedTasksProperty.Value -is [int]) {
            $reportedFailedTasks = [int]$failedTasksProperty.Value
        }
        if ($null -eq $reportedFailedTasks -and $null -ne $failedTasksProperty -and
            $failedTasksProperty.Value -is [array]) {
            $reportedFailedTasks = $failedTasksProperty.Value.Count
        }
        foreach ($collectionName in @('tasks', 'allTasks')) {
            $collectionProperty = $node.PSObject.Properties[$collectionName]
            if ($null -ne $collectionProperty -and $collectionProperty.Value -is [array] -and
                $collectionProperty.Value.Count -gt 0) {
                $isFullSnapshot = $true
                foreach ($item in $collectionProperty.Value) {
                    $itemTaskId = Get-FirstValue $item @('taskId', 'task_id', 'id')
                    $itemStatus = Get-FirstValue $item @('status')
                    $itemFailed = $item.PSObject.Properties['failed']
                    if ($null -eq $itemTaskId -or
                        ($null -eq $itemStatus -and $null -eq $itemFailed)) {
                        $isFullSnapshot = $false
                        break
                    }
                }
                if ($isFullSnapshot) {
                    $fullTaskSnapshotCount = $collectionProperty.Value.Count
                }
            }
        }
        $snapshotTaskId = Get-FirstValue $node @('taskId', 'task_id', 'id')
        $status = Get-FirstValue $node @('status')
        $failedProperty = $node.PSObject.Properties['failed']
        if (($null -ne $failedProperty -and $failedProperty.Value -eq $true) -or
            $status -in @('failed', 'blocked', 'abandoned')) {
            $responseFailedCount = 1
        }
        if ($null -ne $snapshotTaskId -and
            ($null -ne $status -or $null -ne $failedProperty)) {
            $taskSnapshots += [PSCustomObject]@{
                task_id = [string]$snapshotTaskId
                status  = [string]$status
                failed  = $null -ne $failedProperty -and $failedProperty.Value -eq $true
            }
        }
    }
    if (-not $allTasksComplete -and
        $responseText -match '(?i)["'']?allTasksComplete["'']?\s*:\s*["'']?true\b') {
        $allTasksComplete = $true
    }
    if (-not $allTasksComplete) {
        return
    }

    $taskResults = @{}
    if ([IO.File]::Exists($LogFile)) {
        $logLines = [IO.File]::ReadAllLines($LogFile)
        $lastOutcomeIndex = -1
        for ($index = 0; $index -lt $logLines.Length; $index++) {
            try {
                $entry = $logLines[$index] | ConvertFrom-Json
                if ($entry.event -eq 'workflow_outcome' -and
                    $entry.scenario_id -eq $scenarioId) {
                    $lastOutcomeIndex = $index
                }
            } catch {
            }
        }
        for ($index = $lastOutcomeIndex + 1; $index -lt $logLines.Length; $index++) {
            try {
                $entry = $logLines[$index] | ConvertFrom-Json
                if ($entry.event -eq 'workflow_task_result' -and
                    $entry.scenario_id -eq $scenarioId -and $entry.task_id) {
                    $taskResults[[string]$entry.task_id] = [bool]$entry.failed
                }
            } catch {
            }
        }
    }

    $failedCount = [Math]::Max(
        @($taskResults.Values | Where-Object { $_ }).Count,
        $responseFailedCount
    )
    if ($null -ne $reportedFailedTasks) {
        $failedCount = [Math]::Max($failedCount, $reportedFailedTasks)
    }
    if (@($taskSnapshots | Where-Object {
                $_.failed -or $_.status -in @('failed', 'blocked', 'abandoned')
            }).Count -gt 0) {
        $failedCount = [Math]::Max($failedCount, 1)
    }

    if ($failedCount -gt 0) {
        $outcome = 'completed_with_failures'
    } elseif ($reportedFailedTasks -eq 0) {
        $outcome = 'succeeded'
    } elseif ($null -ne $fullTaskSnapshotCount) {
        $outcome = 'succeeded'
        $totalTasks = $fullTaskSnapshotCount
    } elseif ($null -ne $totalTasks -and $taskResults.Count -ge $totalTasks) {
        $outcome = 'succeeded'
    } else {
        $outcome = 'completed_unknown'
    }

    if ([IO.File]::Exists($LogFile)) {
        $logLines = [IO.File]::ReadAllLines($LogFile)
        $latestOutcome = $null
        $latestOutcomeIndex = -1
        for ($index = 0; $index -lt $logLines.Length; $index++) {
            try {
                $entry = $logLines[$index] | ConvertFrom-Json
                if ($entry.event -eq 'workflow_outcome' -and
                    $entry.scenario_id -eq $scenarioId) {
                    $latestOutcome = $entry
                    $latestOutcomeIndex = $index
                }
            } catch {
            }
        }
        $newTaskObserved = $isCompleteTask -and $null -ne $taskId
        for ($index = $latestOutcomeIndex + 1;
            -not $newTaskObserved -and $index -lt $logLines.Length;
            $index++) {
            try {
                $entry = $logLines[$index] | ConvertFrom-Json
                $newTaskObserved = $entry.event -eq 'workflow_task_result' -and
                    $entry.scenario_id -eq $scenarioId
            } catch {
            }
        }
        if ($null -ne $latestOutcome -and -not $newTaskObserved -and
            ($latestOutcome.outcome -ne 'completed_unknown' -or
                $latestOutcome.outcome -eq $outcome)) {
            return
        }
    }

    Write-LogEntry $LogFile ([ordered]@{
            event          = 'workflow_outcome'
            timestamp      = $Timestamp
            session_id     = $SessionId
            scenario_id    = $scenarioId
            outcome        = $outcome
            total_tasks    = $totalTasks
            observed_tasks = if ($taskResults.Count -gt 0) { $taskResults.Count } else { $taskSnapshots.Count }
            failed_tasks   = $failedCount
            status_source  = if ($toolName -match '(?i)get_state$') { 'get_state' } else { 'complete_task' }
        })
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

if ($Event -notin @('session_start', 'skill_read', 'workflow_status', 'session_end')) {
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

    if ($Event -eq 'workflow_status') {
        Write-WorkflowEntries $inputData $logFile $sessionId $timestamp
    } elseif ($Event -eq 'skill_read') {
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
