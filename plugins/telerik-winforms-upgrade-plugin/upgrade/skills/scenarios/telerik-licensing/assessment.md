# Assessment Stage — Telerik WinForms Licensing

Establish the current licensing state for every in-scope project. Write
findings to `assessment.md` in the workflow folder.

## Step 1: Detect

Load `telerik-winforms-license-detection` and run it. This is the only
detection step — do not re-implement any part of it here. It always
reports the Step 0 MCP-prerequisite result (`mcpLicensePresent`), even when
no in-scope project references Telerik — record that result regardless. When
the Telerik CLI is installed, also record its non-secret validation result
and the WinForms product status.

If no in-scope project references Telerik, per-project mechanism detection
(`mechanism`, `entryPointShape`, etc.) has nothing to report — record that
plainly rather than as a blocker. The MCP-prerequisite result is still the
assessment's main finding in that case.

## Step 2: Check for a CI/CD Pipeline (Heuristic, Not Doc-Sourced)

Look for common pipeline definition files in the repository root or a
`.github/workflows`/`azure-pipelines.yml`-style location. This is a plain
file-presence check, not a documented Telerik behavior — record only
whether a pipeline appears to exist; do not assume its platform without
confirming.

## Step 3: Write Assessment

```markdown
# Telerik WinForms Licensing Assessment

## Solution Summary
- **Solution**: {solution path}
- **MCP-prerequisite key present**: Yes/No (independent of Telerik presence)
- **MCP CLI validation**: Confirmed / Reports no usable license / Unavailable
- **WinForms product license status**: Licensed / Not listed / Expired / Unknown
- **MCP license path**: {resolved path, path only}
- **In-scope projects**: {count}
- **Projects referencing Telerik**: {count, or "none — MCP key only"}
- **Projects requiring a license (Q1 2025+)**: {list, or "none"}

## Per-Project Detection

*(omit this section entirely if no in-scope project references Telerik)*

### {project name}
- **License required**: Yes/No ({version})
- **Mechanism**: nuget-file / nuget-envvar / script-key / hybrid-manual-registration / openedge-manual-registration / none / not-applicable
- **Reference style / TFM**: {from telerik-winforms-reference-detection}
- **Entry point shape**: standard / add-in-or-plugin / openedge
- **Artifacts found**: {list with location and precedence outcome}
- **EvidenceAttribute language**: C# / VB / n/a

## Solution-Level Consistency
- **Consistent mechanism across all projects**: Yes/No — {detail if No}

## CI/CD
- **Pipeline detected**: Yes/No — {file(s) found, or "none"}

## Risks and Notes
{blockers, unmapped/ambiguous artifacts, anything outside documented coverage}
```
