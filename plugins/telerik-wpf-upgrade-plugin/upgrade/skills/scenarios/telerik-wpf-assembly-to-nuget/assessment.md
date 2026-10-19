# Assessment Stage — Telerik WPF Assembly-to-NuGet Migration

Detect the current state and the target package set. Write findings to
`assessment.md` in the workflow folder.

## Step 1: Detect Version, Reference Style, and Flavor

Load **telerik-wpf-reference-detection** and run it for each in-scope
project. Record per project:
- Target framework, and whether it's .NET Framework or modern .NET
- Reference style: assembly, NuGet, packages.config, or mixed
- Current Telerik version (or "unknown" if it cannot be determined)
- Flavor: Xaml, NoXaml, mixed, or unknown — with the signals matched, from
  **telerik-wpf-xaml-flavor**
- For NoXaml: the theming mechanism (theme assemblies or copied
  `Themes.Implicit` XAML) and the themes in use
- The full list of Telerik `<Reference>` entries, when the style is assembly,
  including `Telerik.Windows.Themes.*` theme assembly references

Re-apply the early-exit check here per project: modern .NET with no assembly
references needs no work — record it as "already migrated," not a blocker.

A **mixed** flavor (in one project, or across projects that ship in the same
application) is a blocker: record every conflicting reference. An **unknown**
flavor is also a blocker for that project. Never pick a flavor here.

## Step 2: Determine the Required NuGet Feed

Load **telerik-wpf-nuget-feed-setup**. Using the detected UI version(s)
from Step 1:
- Version `2026.3.812` or later → NuGet.org, no configuration expected
- Version before `2026.3.812` → the Telerik NuGet server is required

Run its detection/validation steps and record: which feed is required,
whether it is already configured, and whether it actually resolves Telerik
packages of the project's flavor. Do not attempt package edits yet if the
feed doesn't resolve — that is a blocker for planning to surface, not
something to work around silently.

## Step 3: Map Assembly References to Packages

Load **telerik-wpf-assembly-mapping**. For each project with assembly
references and a resolved (non-mixed, known) flavor, resolve the minimal
NuGet package set for the detected version, flavor, and unchanged TFM.
Record:
- The resolved package list (id + version) per project — UI packages share
  the detected version; flavor-neutral Document Processing packages carry
  their own paired version
- For NoXaml: each theme assembly and the theme package that replaces it
- Any assembly with **no known mapping** — list it explicitly as a blocker,
  never substitute a guessed package

Skip this step for projects blocked on a mixed or unknown flavor; their
mapping runs after the flavor decision.

## Step 4: Write Assessment

Write `assessment.md` in the workflow folder:

```markdown
# Telerik WPF Assembly-to-NuGet Migration Assessment

## Solution Summary
- **Solution**: {solution path}
- **In-scope projects**: {count}
- **Already NuGet-based / nothing to do**: {list, or "none"}

## Per-Project Detection

### {projectName}
- **Target Framework**: {targetFramework} ({.NET Framework / modern .NET})
- **Reference Style**: assembly / NuGet / packages.config / mixed
- **Current Telerik Version**: {version or "unknown"}
- **Flavor**: Xaml / NoXaml / mixed / unknown — {signals matched}
- **Theming (NoXaml)**: {theme assemblies / copied Themes.Implicit XAML; themes in use, or "n/a"}
- **Assembly References**: {list of DLL names, or "n/a"}

## Flavor Consistency
- **Mixed flavor (blocker)**: {conflicting references per project/application, or "none"}
- **Inconsistent theming (warning)**: {details, or "none"}

## NuGet Feed
- **Required feed**: NuGet.org / Telerik NuGet server ({reason: version vs. 2026.3.812})
- **Currently configured**: {Yes/No}
- **Resolves Telerik packages**: {Yes/No}
- **Setup still needed**: {details or "none"}

## Package Mapping

### {projectName}
| Assembly | Resolved package | Version |
|----------|-------------------|---------|
| {Telerik.Windows.Controls.GridView.dll} | {Telerik.Windows.Controls.GridView.for.Wpf.Xaml} | {version} |

**Unmapped assemblies**: {list, or "none"}

## Risks and Notes
- {mixed or unknown flavor, feed not yet resolvable, unmapped assemblies, mixed reference styles, unknown version, other blockers}
```
