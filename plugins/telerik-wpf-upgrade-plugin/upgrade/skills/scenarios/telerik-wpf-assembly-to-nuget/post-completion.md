# Post-Completion Stage — Telerik WPF Assembly-to-NuGet Migration

Summarize results and suggest follow-ups.

## Step 1: Generate Summary

- **Telerik version**: {version} (unchanged by this scenario)
- **Flavor per project**: Xaml / NoXaml (unchanged by this scenario), and
  any flavor decision the user made for a mixed-flavor blocker
- **Feed used**: NuGet.org / Telerik NuGet server
- **Projects migrated**: list of `.csproj`/`.vbproj` files changed
- **Packages added per project**: {package id + version list, including
  theme packages for NoXaml}
- **Assembly references removed**: {count} across {project count} projects
- **Unmapped assemblies**: list with how each was resolved, or "none"
- **NoXaml theming checks**: passed / issues (list)
- **Restore/build result**: clean / succeeded with deferred missing-license
  warnings / outstanding issues
- **Application activation**: not required (before Q1 2025) / verified /
  deferred (confirmed missing license) / blocked
- **Deferred licensing warnings**: affected projects and codes, or "none"

## Step 2: Verification Reminders

- Open each migrated project in Visual Studio and confirm it loads without
  reference warnings
- Open the views that use Telerik controls in the XAML designer and confirm
  they render with the expected theme
- Run the application and exercise screens that used the migrated controls
- Confirm restore/build succeeds on a machine that hasn't previously
  restored these packages, to catch feed-configuration gaps; report known
  missing-license warnings separately

## Step 3: Suggest Future Enhancements

1. **Telerik Version Upgrade**: run the `telerik-wpf-version-upgrade`
   scenario — now that the project is NuGet-based, upgrading is a version
   bump plus breaking-change fixes, with no reference-style migration needed.
2. **Generate Report**: create a detailed report of packages added,
   references removed, and any assemblies that needed a manual decision.

If application activation was deferred, also suggest the
`telerik-wpf-licensing` scenario to supply the missing license and resolve
the reported warnings. Do not start it automatically.
