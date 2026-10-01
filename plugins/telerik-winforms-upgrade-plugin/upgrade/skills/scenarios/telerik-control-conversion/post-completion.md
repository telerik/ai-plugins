# Post-Completion Stage — Telerik WinForms Control Conversion

After all conversion tasks complete, summarize results and suggest follow-up
actions.

## Step 1: Generate Summary

Report results **against the assessment's conversion units** — the list of
form/user-control class pairs is the baseline, so completeness is measured
against it.

- **Telerik version**: {version} (newly installed / already referenced)
- **Projects modified**: list of `.csproj` files changed
- **Classes converted**: {count} of {in-scope count} (assessment total: {count})
- **`itemsToReview` resolved**: {count} — properties/events with a Telerik
  alternative applied
- **`itemsToReview` with no alternative**: list, so the user knows what behavior
  was dropped
- **Classes deferred or failed**: list with the reason for each
- **Application license activation**: configured / not needed
- **Theme applied**: {theme name} / not applied
- **Conversion count used**: {count} *(note if a trial cap was hit)*

## Step 2: Offer Remaining Forms

If conversion units were deferred during planning (out of scope) or during
execution (conversion issues), offer to handle them now:

> **Remaining Forms**
>
> {count} form(s) or user control(s) still use standard Microsoft WinForms
> controls:
> {list with the reason each was skipped}
>
> Would you like to convert them as well?

If every unit is converted, state that explicitly and skip this step.

## Step 3: Verification Reminders

Remind the user to manually verify what the agent cannot:

- Open each converted form in the Visual Studio Designer
- Run the application and exercise the converted screens
- Check data-bound grids and lists against the original behavior
- Confirm the theme renders consistently across all forms
- Review any `itemsToReview` entries that had no Telerik alternative

Once satisfied, the `.bak` files the converter left beside each modified source
file can be deleted.

## Step 4: Suggest Future Enhancements

Present available follow-up options:

1. **Telerik Version Upgrade**: run the `telerik-version-upgrade`
   scenario to move to a newer Telerik release, with breaking-changes detection.

3. **Generate Report**: Create a detailed conversion report summarizing all
   changes made, files modified, and any remaining action items.
