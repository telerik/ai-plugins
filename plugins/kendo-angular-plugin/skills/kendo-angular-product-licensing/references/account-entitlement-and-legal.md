# Account, Entitlement & Legal — Kendo UI for Angular Licensing

Branches where the issue is account/seat assignment, license scope, payload decoding, commercial/legal interpretation, or the KENDO_UI_LICENSE→TELERIK_LICENSE migration — not local activation mechanics. Many of these route to Sales/Legal/licensing operations rather than resolving in-channel.

### Account and License Assignment Mismatch

Use when the customer has a commercial account but the downloaded key triggers TKL101 or reports invalid entitlement even in a clean project.

```yaml
strong_signals:
    - TKL101 persists with newly downloaded key from commercial account.
    - Key was generated before the seat assignment step was finalized.
    - Key decodes to a different account or no entitlement for the requested product.
    - Customer reports only one seat in account but multiple developers need access.
    - Assigned seat is on a sub-account or team license different from the billing account.
    - Customer has both a personal Telerik account and a corporate SSO account; key was downloaded from the wrong account portal.

triage_order:
    - Verify which account email was used to generate the key.
    - Verify seat is assigned and finalized on that exact account.
    - Confirm product family in the downloaded key matches the product family triggering the error.
    - Confirm key was downloaded after seat assignment was completed (not before).
    - If seat assignment is recent, regenerate key and re-activate.
    - If account has multiple products or team licenses, confirm the correct license scope.

do:
    - Instruct customer to verify seat assignment state before re-downloading.
    - Instruct customer to download fresh key after seat assignment is confirmed.
    - Clarify that key generated before seat assignment will not include new entitlements.
    - If multiple accounts exist, confirm which account owns the correct entitlement.
    - If customer has corporate SSO: confirm they accessed the portal through the SSO path (not a personal login) and that the downloaded key corresponds to the seat on the corporate account.
    - Escalate to licensing operations if account assignment cannot be confirmed via self-service.

avoid:
    - Repeating re-download instructions without confirming seat assignment is finalized first.
    - Assuming TKL101 is always a file or encoding issue before checking account assignment.
    - Asking for key content without first establishing account/seat assignment state.
```

Safe response template (standard):

```text
TKL101 typically means the key does not include entitlement for the installed product version, which can happen when the key was generated before seat assignment was finalized, or when the key is for a different product family than the one showing the warning.

Please verify your seat is fully assigned in your account, then download a fresh key and re-activate from the project root.
```

Safe response template (seat assignment timing):

```text
If your license key was generated before the seat assignment step completed, the key will not reflect the new entitlement. Please log in to your account, confirm the seat is assigned, then download a new key and re-run activation.
```

---

### Legal and Commercial Scope Questions

Use this branch when the ticket is about licensing scope interpretation rather than technical activation failure.

```yaml
strong_signals:
    - Customer asks who needs licenses in internal wrapper/design-system models.
    - Customer asks peerDependency vs bundled licensing implications.
    - Customer asks redistribution/public package/marketplace licensing obligations.
    - Customer's legal/procurement team questions whether indirect consumers need individual seats.
    - Customer asks if AGPL applies to their private deployment.
    - Customer asks about OEM or white-label redistribution obligations.

key_policy_clarifications:
    - Internal wrapper package: developers who build apps that include Kendo components (direct or via wrapper) need valid seats.
    - peerDependency vs bundled: both models require the consuming app developer to hold a valid license.
    - Public redistribution or marketplace listing: always route to Sales/Legal — do not advise unilaterally.
    - AGPL questions: route to Legal — do not advise unilaterally.
    - OEM or white-label redistribution: route to Sales/Licensing — special agreement required.

recommended_resolution:
    - Provide direct guidance for internal wrapper-consumption model (developer who builds needs a seat).
    - Route non-standard distribution, OEM, white-label, AGPL, or contract interpretation to Legal/Sales Licensing.
    - Capture intended distribution model in handoff payload.
    - Do not make unilateral licensing scope rulings for redistribution, AGPL, or OEM scenarios.

handoff_payload:
    - product_family
    - internal_only_vs_redistributed
    - who_builds_directly_with_kendo
    - who_only_consumes_wrapper
    - dependency_model_peer_vs_bundled
    - requested_commercial_outcome
```

Safe response template (internal wrapper model):

```text
For internal use with a wrapper/design system, each developer who builds an application that includes Kendo components — directly or through your wrapper — needs a valid seat. Developers who only consume your wrapper's public API without directly referencing Kendo packages may have different requirements depending on your agreement. We recommend confirming the exact seat scope with your account team.
```

Safe response template (redistribution or OEM inquiry):

```text
Redistribution, OEM, and white-label licensing involve special agreement terms that we cannot confirm unilaterally. I am routing this to Sales/Licensing with the details of your intended distribution model for a formal review and response.
```

---

### Subscription to Perpetual Transition State

```yaml
strong_signals:
    - Customer asks how long to wait after subscription expiration for perpetual key.
    - Customer treats telerik-license.txt filename as suspicious.

recommended_resolution:
    - Clarify no waiting window is required.
    - Clarify telerik-license.txt is expected.
    - Re-download and activate key after status transition.
```

Safe response template:

```text
No waiting window is required between subscription expiration and perpetual key availability. The telerik-license.txt filename is the expected and correct file name — there is nothing wrong with it. Please re-download your key from the portal and re-activate.
```

---

### Mixed License Payload Decoding Confusion

```yaml
strong_signals:
    - Customer decodes JWT and sees earlier expiry than expected renewal date.
    - Activation succeeds while decoded payload appears contradictory.

recommended_resolution:
    - Validate relevant entitlement in full licenses collection, not first object only.
    - Clarify decoded payload may include mixed perpetual/subscription records.
    - Treat activation success as authoritative check.
```

Safe response template:

```text
A single license key file can contain multiple records covering perpetual and subscription entitlements, each with different dates. When you decode the JWT, you may see an earlier expiry from an older record in the collection. Activation success is the authoritative check — the tool evaluates all records and returns valid when any applicable record covers your installed package version. If activation succeeds, your license is valid.
```

---

### Commercial License Portal Generation Mismatch

```yaml
strong_signals:
    - Commercial account downloads file that still decodes as trial.
    - Activation succeeds but runtime shows trial-expired warning.

recommended_resolution:
    - Classify as portal payload generation anomaly.
    - Escalate to licensing operations with account and download timestamp.
    - Avoid repeated regenerate/reinstall loops while payload anomaly is unresolved.
```

Safe response template:

```text
This appears to be a portal payload generation issue on our end rather than a problem with your account entitlement. Please do not attempt further key regeneration cycles. I am escalating this to our licensing operations team with your account details and key download timestamp for investigation.
```

---

### Cross-Product License Scope Mismatch

Use when the customer has entitlement for one product family but the runtime warning is emitted by a different product family's package.

```yaml
strong_signals:
    - Customer has valid Kendo UI for Angular license but warning appears from a different product family package (e.g. KendoReact or jQuery).
    - Mixed product families in the same app (for example, Angular and React packages installed together).
    - Key decoded and confirmed valid for one product line, but another product line in node_modules triggers the warning.
    - Third-party dependency pulls in a Kendo product package outside the customer's licensed family.

triage_order:
    - Identify exact package name and version triggering the warning (not just the product the customer believes they use).
    - Verify which product family or families appear in node_modules (npm ls @progress/).
    - Confirm whether the triggering package is a direct or transitive dependency.
    - If transitive: identify which direct dependency introduces it.
    - Confirm account license covers the triggering product family.

recommended_resolution:
    - If customer has entitlement for the triggering family, regenerate key scoped to include that family.
    - If triggering package is a transitive dependency and not needed, pin it to a free or compatible version or remove it.
    - If entitlement does not cover triggering product, route to Sales for cross-product coverage.
    - Do not assume all @progress/* packages are covered by a single product license.

avoid:
    - Treating all @progress/* package warnings as the same license scope.
    - Recommending key refresh for the wrong product family.
    - Missing transitive dependencies as source of cross-product warning.
```

Safe response template:

```text
The warning may be coming from a different Kendo product family package than the one you licensed. Please run 'npm ls @progress/' in your project root to identify every @progress package present, including transitive dependencies, and share the output so we can confirm whether the triggering package is within your license scope.
```

---

### Free Component Version-Gating Confusion

```yaml
strong_signals:
    - Customer expects a component to be free but uses an older major where it was premium.

recommended_resolution:
    - Confirm installed version and first free release line.
    - Route to upgrade guidance instead of repeated activation troubleshooting.
```

Safe response template:

```text
This component became available without a license requirement in a specific major version of Kendo UI for Angular. If you are on an older major release, a license is still required for that version line. The recommended path is upgrading to the latest supported major where the component is free. If staying on the older major is required, please contact Sales for licensing options.
```

---

### Licensing Model Change and Workflow Impact

Use when the customer references earlier guidance that conflicted with current enforcement behavior.

```yaml
strong_signals:
    - Customer cites older written guidance that implied non-licensed developers could work safely if they did not modify Kendo imports.
    - Current behavior shows popup/checks for any developer who runs or builds a project containing premium Kendo UI for Angular features.
    - Customer frames the issue as potential agreement breach or procurement risk.
    - Customer's legal or procurement team is involved.

agent_behavior:
    - Acknowledge that previous guidance may have reflected the model active at that time.
    - Explain current model behavior clearly: running or building a project with premium components requires valid license entitlement for each developer in that context.
    - Do not promise unsupported popup suppression or workarounds.
    - Route contract or breach concerns to Legal/Account Management for formal review.

must_capture_for_handoff:
    - Quoted prior guidance or date if provided by customer
    - Current workflow topology (who runs or builds, who edits components)
    - Current blocked roles and business impact
    - Requested commercial or legal outcome
```

Safe response template:

```text
Thank you for sharing the earlier guidance. Based on current licensing enforcement, any developer who runs or builds a project containing premium Kendo UI for Angular features must have valid license entitlement.

If your team's original adoption decision relied on older guidance, we should route this for formal commercial and legal review with your account team so the impact on your workflow can be addressed with the proper authority.
```

---

## KENDO_UI_LICENSE to TELERIK_LICENSE Migration Checklist

Use when a customer upgraded from a pre-2025 Q1 setup and still sees activation failures after switching to the new variable name or file name.

```yaml
common_missed_locations:
    1. CI pipeline secret — secret was renamed in code but old KENDO_UI_LICENSE secret still exists and is injected by a cached pipeline step.
    2. Shell profile — ~/.bashrc or ~/.zshrc still exports KENDO_UI_LICENSE; new TELERIK_LICENSE is not set; old variable is still accepted by current tooling but may contain a stale key value.
    3. .env file — file was updated but CRLF/BOM artifact was introduced during editing (see .env encoding section).
    4. Docker build args — Dockerfile ARG/ENV still references KENDO_UI_LICENSE.
    5. Vercel / Netlify / Azure environment variable panel — old variable still active alongside new one; env var takes precedence over file, so stale KENDO_UI_LICENSE env var shadows fresh telerik-license.txt.
    6. .npmrc or postinstall scripts — custom activation scripts reference old variable name.
    7. IDE or OS-level environment variable (Windows System Properties) — old KENDO_UI_LICENSE persists at system level.

migration_checklist:
    - Shell profile: remove KENDO_UI_LICENSE export, add TELERIK_LICENSE export, reload profile.
    - CI secrets: add TELERIK_LICENSE secret with current key value; optionally remove KENDO_UI_LICENSE to avoid shadowing.
    - .env files: rename variable; verify encoding after editing.
    - Docker: update ARG/ENV in Dockerfile and --build-arg in CI build command.
    - Hosting panels (Vercel, Netlify, Azure): add TELERIK_LICENSE; remove KENDO_UI_LICENSE.
    - Postinstall / custom scripts: update any hardcoded variable references.
    - Windows System Properties: update or remove old system-level variable.

avoid:
    - Assuming renaming in one location is sufficient.
    - Leaving KENDO_UI_LICENSE active alongside TELERIK_LICENSE — old variable is still accepted and its value will be used, potentially pointing to a stale key.
```

Safe response template:

```text
The old KENDO_UI_LICENSE variable name is still accepted by current tooling, so if it is still set anywhere with an outdated key value, it may shadow the new TELERIK_LICENSE. Please check all locations where the variable was previously set — shell profiles, CI secrets, .env files, Docker build args, and hosting platform environment variables — and either remove KENDO_UI_LICENSE or ensure it has the current key value.
```

---

## Commercial, Bundle & Support Reference

Doc-verified facts (Telerik official docs, current as of June 2026) for entitlement, bundle-scope, support, renewal, and discount questions. Most of these are commercial decisions — surface the fact, then route the customer to Sales rather than ruling on pricing in-channel.

```yaml
bundle_scope:
    - A single license key file authorizes every product in the DevCraft bundle. ThemeBuilder is excluded.
    - Relevance to Cross-Product License Scope Mismatch: a DevCraft key legitimately covers multiple product families (KendoReact, Kendo UI for Angular/Vue/jQuery, Telerik .NET, etc.). Before treating a cross-family warning as an entitlement gap, confirm whether the customer holds a bundle key.
    - The Kendo UI bundle covers the four JS libraries (jQuery, Angular, React, Vue) plus the AI tools.

seat_assignment_basis:
    - The EULA requires each developer who uses the components at design time to be assigned to a license seat.
    - If the purchaser is also the sole developer, they are auto-assigned — no manual step needed.
    - This is the authoritative grounding for the Account and License Assignment Mismatch branch: an unassigned or wrongly assigned seat is an EULA/seat issue, not an activation bug.

deployment:
    - Licenses have no deployment limits — unlimited applications, servers, and domains.
    - Only developers need seats; there are no per-server, per-app, or per-domain runtime fees.
    - Use this to answer "how many servers/apps can I deploy to" — the answer is unlimited.

support_and_updates:
    - A license includes 12 months of product updates (new features and fixes) plus technical support.
    - Ticket turnaround is 24–72 hours depending on the support package; phone support is available if the license tier allows it.
    - Subscription provides continuous updates/support; perpetual includes 1 year, after which the support plan must be renewed to keep receiving updates and support.

renewal_and_conversion:
    - Telerik/Kendo licenses are perpetual in nature: the product keeps working after the subscription year ends, but on the last version released before expiry, with no further updates or support.
    - Early renewal is offered at 50% of the original license price.
    - A perpetual license can be converted to a subscription. There is NO subscription-to-perpetual upgrade path.
    - Auto-renewal is available via the account's Your Licenses page.
    - Route all pricing/renewal/conversion specifics to Sales.

discounts_and_special_programs:
    - A 10% discount is offered to educational, government, and non-profit organizations, provided the license is purchased directly from Progress.
    - Progress may request documentation confirming eligibility.
    - This gives "do I qualify for a discount" tickets a home: state the program exists, then route to Sales.

do:
    - State the verified fact, then route commercial decisions (pricing, renewal, conversion, discounts, bundle purchases) to Sales.
    - For bundle holders, check bundle scope before diagnosing a cross-family warning as missing entitlement.

avoid:
    - Quoting exact prices or committing to a discount amount beyond the published 10% program — confirm with Sales.
    - Treating a seat-assignment or bundle-scope question as a technical activation failure.
```

Safe response template (bundle scope):

```text
If your key is a DevCraft (or Kendo UI) bundle key, it covers every product in that bundle under a single key — including the family showing the warning. Before we treat this as a missing entitlement, let's confirm which products your bundle includes and that the triggering package is one of them.
```

Safe response template (discount inquiry):

```text
There is a 10% discount for educational, government, and non-profit organizations when the license is purchased directly from Progress, and you may be asked for documentation confirming eligibility. I'll route you to our Sales team to confirm eligibility and apply it to your purchase.
```
