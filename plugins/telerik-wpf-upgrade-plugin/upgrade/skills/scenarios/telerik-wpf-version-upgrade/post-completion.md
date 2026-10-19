# Post-Completion Stage — Telerik WPF Version Upgrade

After all tasks complete, summarize results and suggest follow-up actions.

## Step 1: Generate Summary

Present a concise summary of what was accomplished:

- **Telerik version**: {from} → {to}
- **.NET target**: {tfm} (unchanged by this scenario)
- **Flavor**: Xaml / NoXaml per project (unchanged by this scenario)
- **Projects modified**: list of `.csproj`/`.vbproj` files changed
- **Delivery method**: NuGet (unchanged) / assembly references retargeted in
  place / migrated to NuGet this run (only if the customer accepted the
  one-time offer)
- **Breaking changes resolved**: {count} of {total findings}
- **NoXaml theming**: checks passed / copied theme XAML refreshed / refresh
  deferred (open item) / not applicable
- **Application license activation**: configured / verified unchanged / not needed
- **Outstanding issues**: list, or "none"

## Step 2: Verification Reminders

Remind the user to manually verify what the agent cannot:

- Open the affected views in the Visual Studio XAML designer
- Run the application and exercise the screens touched by breaking-change
  fixes, and confirm the Telerik controls render with the expected theme
- Confirm licensing activates cleanly on a fresh build when licensing was set up

## Step 3: Suggest Future Enhancements

Present available follow-up options:

1. **Generate Report**: Create a detailed upgrade report summarizing all changes
   made, files modified, and any remaining action items.
