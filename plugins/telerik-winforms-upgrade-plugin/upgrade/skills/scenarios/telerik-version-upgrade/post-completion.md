# Post-Completion Stage — Telerik WinForms Version Upgrade

After all tasks complete, summarize results and suggest follow-up actions.

## Step 1: Generate Summary

Present a concise summary of what was accomplished:

- **Telerik version**: {from} → {to}
- **.NET target**: {tfm} (unchanged by this scenario)
- **Projects modified**: list of `.csproj` files changed
- **Delivery method**: NuGet (unchanged) / assembly references retargeted in
  place / migrated to NuGet this run (only if the customer accepted the
  one-time offer)
- **Breaking changes resolved**: {count} of {total findings}
- **Application license activation**: configured / verified unchanged / not needed
- **Outstanding issues**: list, or "none"

## Step 2: Offer Control Conversion

Reuse the **MS control conversion opportunity** flag already recorded in
`assessment.md` (a fast first-match check — do not re-scan the project here).

If it was recorded `Yes`:

> **Telerik Control Conversion Available**
>
> Your project still includes standard Microsoft WinForms control(s).
> Telerik UI for WinForms offers equivalents with rich theming, advanced data
> visualization, and extended configuration options. Would you like to convert
> them?
>
> This runs the **telerik-control-conversion** scenario, which uses the
> Telerik MCP migration tools to analyze your forms and convert controls while
> preserving your application logic.

If it was recorded `No`, skip this step.

## Step 3: Verification Reminders

Remind the user to manually verify what the agent cannot:

- Open the affected forms in the Visual Studio Designer
- Run the application and exercise the screens touched by breaking-change fixes
- Confirm licensing activates cleanly on a fresh build when licensing was set up

## Step 4: Suggest Future Enhancements

Present available follow-up options:

1. **Generate Report**: Create a detailed upgrade report summarizing all changes
   made, files modified, and any remaining action items.
