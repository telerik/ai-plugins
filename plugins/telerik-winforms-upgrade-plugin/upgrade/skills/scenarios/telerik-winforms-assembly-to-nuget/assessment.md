# Assessment Stage — Telerik WinForms Assembly-to-NuGet Migration

Detect the current state and the target package set. Write findings to
`assessment.md` in the workflow folder.

## Step 1: Detect Version and Reference Style

Load **telerik-winforms-reference-detection** and run it for each in-scope
project. Record per project:
- Target framework, and whether it's .NET Framework or modern .NET
- Reference style: assembly, NuGet, packages.config, or mixed
- Current Telerik version (or "unknown" if it cannot be determined)
- The full list of Telerik `<Reference>` entries, when the style is assembly

Re-apply the early-exit check here per project: modern .NET with no assembly
references needs no work — record it as "already migrated," not a blocker.

## Step 2: Determine the Required NuGet Feed

Load **telerik-winforms-nuget-feed-setup**. Using the detected version(s)
from Step 1:
- Version `2026.3.812` or later → NuGet.org, no configuration expected
- Version before `2026.3.812` → the Telerik NuGet server is required

Run its detection/validation steps and record: which feed is required,
whether it is already configured, and whether it actually resolves Telerik
packages. Do not attempt package edits yet if the feed doesn't resolve — that
is a blocker for planning to surface, not something to work around silently.

## Step 3: Map Assembly References to Packages

Load **telerik-winforms-assembly-mapping**. For each project with assembly
references, resolve the minimal NuGet package set for the detected version.
Record:
- The resolved package list (id + version) per project
- Any assembly with **no known mapping** — list it explicitly as a blocker,
  never substitute a guessed package

## Step 4: Write Assessment

Write `assessment.md` in the workflow folder:

```markdown
# Telerik WinForms Assembly-to-NuGet Migration Assessment

## Solution Summary
- **Solution**: {solution path}
- **In-scope projects**: {count}
- **Already NuGet-based / nothing to do**: {list, or "none"}

## Per-Project Detection

### {projectName}
- **Target Framework**: {targetFramework} ({.NET Framework / modern .NET})
- **Reference Style**: assembly / NuGet / packages.config / mixed
- **Current Telerik Version**: {version or "unknown"}
- **Assembly References**: {list of DLL names, or "n/a"}

## NuGet Feed
- **Required feed**: NuGet.org / Telerik NuGet server ({reason: version vs. 2026.3.812})
- **Currently configured**: {Yes/No}
- **Resolves Telerik packages**: {Yes/No}
- **Setup still needed**: {details or "none"}

## Package Mapping

### {projectName}
| Assembly | Resolved package | Version |
|----------|-------------------|---------|
| {Telerik.WinControls.GridView.dll} | {Telerik.UI.for.WinForms.GridView} | {version} |

**Unmapped assemblies**: {list, or "none"}

## Risks and Notes
- {feed not yet resolvable, unmapped assemblies, mixed reference styles, unknown version, other blockers}
```
