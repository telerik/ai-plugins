---
name: telerik-blazor-browser-validation
description: "Use when validating a generated or modified Telerik UI for Blazor app in a real browser, running an agentic repair loop, checking that a route renders, inspecting console/runtime errors, exercising interactions, or using Playwright MCP feedback."
allowed-tools: "*"
---

# Telerik UI for Blazor — Browser Validation (Agentic Repair Loop)


This skill handles the optional browser validation phase for Telerik UI for Blazor. It must be executed **after** the main implementation workflow is complete and after `telerik_validator_assistant` has reported no errors.

**MCP Tools:** 
- All `browser_*` tools referenced in this skill are provided by the **playwright** MCP server. 
- All `telerik_*` tools are provided by the **Telerik.Blazor.MCP** MCP server


---

## Step 1: Gather Browser Validation Context

Determine the following before proceeding. If any required item is missing and cannot be inferred from the project structure or prior conversation, ask a single concise clarification question.

| Item | How to determine |
|---|---|
| Target app project | Infer from the `.csproj` file in the workspace; ask if multiple projects exist |
| Run command | Default: `dotnet run` in the project directory |
| Target route | Infer from the `@page` directive of the implemented component; ask if ambiguous |
| Expected user-facing behavior | Infer from the original prompt; confirm if complex |

---

## Step 2: Start or Reuse the Blazor Development Server

If the development server is not already running, start it with `dotnet run` (or the project-specific run command) in a terminal. Wait for the server to report a listening URL before navigating.

Reuse an existing server session if one is already running for the same project.

---

## Step 3: Navigate to the Target Route

```
browser_navigate({ url="http://localhost:<port>/<route>" })
```

Use the port reported by `dotnet run`. If the app uses HTTPS, use the HTTPS URL.

---

## Step 4: Wait for the Route to Settle

```
browser_wait_for({ text="<expected heading or landmark text>" })
```

Wait for a visible landmark, heading, or primary component on the page. If the page has no predictable static text, wait for a short fixed delay using the tool's timeout option.

---

## Step 5: Initial Snapshot and Console Check

Capture the rendered page structure and inspect for runtime errors:

```
browser_snapshot()
browser_console_messages()
```

Use the snapshot to verify:
- The expected page structure is present.
- Primary Telerik UI components appear in the accessibility tree (roles such as `grid`, `dialog`, `combobox`, `tab`, etc.).
- No critical DOM errors or missing component roots.

Use console messages to verify:
- No blocking JavaScript errors.
- No Blazor circuit errors or unhandled exceptions.

---

## Step 6: Exercise the Main Interaction Path

Walk through the primary user workflow described in the original prompt. Use the tools below at each step:

| Tool | Use when |
|---|---|
| `browser_navigate` | Opening the target route, or re-navigating after a repair pass |
| `browser_wait_for` | Waiting for a route, heading, loading transition, or interaction result to settle |
| `browser_snapshot` | After navigation and after each meaningful interaction, to inspect the rendered structure |
| `browser_console_messages` | After navigation and after each meaningful interaction, to detect runtime errors |
| `browser_click` | Activating a button, menu item, tab, grid command, dialog action, or call to action |
| `browser_fill_form` | Completing multiple form fields |
| `browser_type` | Entering text into one focused editable field |
| `browser_select_option` | Selecting from a native select or supported dropdown surface |
| `browser_press_key` | Keyboard confirmation, navigation, or basic focus validation |
| `browser_resize` | Confirming the route remains usable at a different viewport |
| `browser_take_screenshot` | Capturing visual evidence for a finding that is hard to describe from the snapshot alone |
| `browser_close` | Closing the browser when the validation loop is complete |

After each meaningful interaction, call:

```
browser_snapshot()
browser_console_messages()
```

---

## Step 7: Evaluate Findings

After completing the interaction path, evaluate whether the page passes the browser validation checklist:

### Browser Validation Checklist

- [ ] The app starts and the target route responds (HTTP 200, no redirect to error page).
- [ ] The route renders the expected page, feature, or component surface.
- [ ] No blocking console/runtime errors are present.
- [ ] Primary Telerik UI components appear in the accessibility snapshot.
- [ ] The main interaction path completes successfully at least once.
- [ ] Relevant loading, empty, and error states are not visibly broken when they are part of the implemented UI.
- [ ] The page remains usable after the interaction (no crash, blank state, or broken layout).

If all checklist items pass, skip to Step 9 (close browser and report success).

---

## Step 8: Repair Loop (max 3 attempts)

If issues are found, apply focused fixes and re-validate. The loop is bounded to **3 repair attempts**. Increment the attempt counter at the start of each pass.

### Per-attempt repair procedure

1. **Summarize the evidence.** List the specific snapshot findings, console errors, or failed checklist items.

2. **Apply targeted code fixes.**

   - If the fix involves a Telerik component API, call `telerik_component_assistant` first to retrieve the correct API before editing:
     ```
     telerik_component_assistant({ query="<specific question about the component>" })
     ```
   - If the fix involves layout or spacing, call `telerik_layout_assistant` to retrieve the correct Kendo utility classes:
     ```
     telerik_layout_assistant({ query="<specific layout question>" })
     ```
   - If the fix involves icons, call `telerik_icon_assistant` to retrieve the correct icon name:
     ```
     telerik_icon_assistant({ query="<icon description>" })
     ```

3. **Re-run Telerik validation** for all changed Razor files:
   ```
   telerik_validator_assistant({ filePath="<absolute path to .razor file>" })
   ```
   Fix any new validator errors before continuing.

4. **Re-run browser checks.** Repeat Steps 3–7:
   ```
   browser_navigate({ url="<target URL>" })
   browser_wait_for({ text="<landmark text>" })
   browser_snapshot()
   browser_console_messages()
   ```
   Then re-exercise the interaction path and re-evaluate the checklist.

5. If the checklist passes, exit the loop. If not and attempts remain, continue to the next attempt.

### If 3 attempts are exhausted

Stop the loop. Do not attempt further repairs. Proceed to Step 9 and report all remaining issues.

---

## Step 9: Close the Browser and Report

```
browser_close()
```

Report the final status in this format:

### Browser Validation Report

**Result:** `PASS` | `PASS WITH WARNINGS` | `FAIL`

**Route validated:** `<URL>`

**Repair attempts:** `<n> / 3`

**Checklist:**

| Check | Status | Notes |
|---|---|---|
| App starts and route responds | ✅ / ❌ | |
| Expected page structure rendered | ✅ / ❌ | |
| No blocking console/runtime errors | ✅ / ❌ | |
| Telerik components in accessibility snapshot | ✅ / ❌ | |
| Main interaction path completed | ✅ / ❌ | |
| Loading/empty/error states not broken | ✅ / ⚠️ / N/A | |
| Page usable after interaction | ✅ / ❌ | |

**Remaining issues (if any):**

List any checklist items that could not be resolved within the repair loop, with a brief description of the evidence and a suggested next step for the user.
