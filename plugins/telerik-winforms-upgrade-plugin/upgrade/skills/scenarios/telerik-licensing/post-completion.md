# Post-Completion Stage — Telerik WinForms Licensing

## Step 1: Summary

- **Mechanism per project**: before → after
- **Migration performed**: Yes/No (and for which projects)
- **CI/CD configured**: Yes/No/not applicable
- **Verification result**: clean / issues remaining (list)

## Step 2: Runtime Reminder

Remind the customer to run the application once and confirm no watermark,
banner, or modal dialog appears — a clean build alone does not fully prove
this.

## Step 3: Suggest Follow-Ups (Once, Not Pushy)

- If any project still has direct Telerik *control* assembly references and
  the customer might want those on NuGet too, mention the `telerik-assembly-to-nuget`
  scenario once — this scenario only touched licensing, not the control
  references themselves.
- **Generate Report**: offer a detailed summary of every file changed.

Do not repeat the NuGet migration offer here if it was already made (and
answered) during planning.
