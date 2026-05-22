# App Scaffolding — Multi-View Applications

You are here because the decision table matched **app scaffolding**. Define the application architecture before enriching individual views.

If the prompt is generic, **invent** a bold app identity. Not "generic project app" — "TaskForge: a lightweight project management tool for small engineering teams shipping in 2-week sprints."

---

## The 7 Scaffold Steps

### A. App Identity
Working name + one-sentence purpose.

### B. User Roles
1–3 roles, what each primarily does. Pick one for the initial build.

### C. View Map
3–6 main views. For each: purpose, layout pattern (from `layout-patterns.md`), primary user role. More than 6 → narrow scope or phase it.

### D. Navigation Model

| Model | Best for | Details |
|-------|----------|---------|
| Sidebar | 4–8 views, business apps | 220px, icons + labels, collapsible on mobile |
| Top nav | 3–5 equally important views | Horizontal tab bar |
| Bottom tabs | Mobile-first, 3–5 views | Fixed bottom bar |
| Drawer | Max content width needed | Hidden behind toggle |

Also define **shared chrome**: logo, user menu, notifications, global search, breadcrumbs.

### E. Data Model
3–5 core entities with key fields and relationships.

### F. Shared Visual Identity
- **Density & Tone**: One choice for all views
- **Accent color**: One primary action color
- **Status palette**: Consistent state colors across views

### G. Build Order
State which view to build first. Present the plan conversationally, get confirmation, then build.

---

## App Brief Format

```
## App Brief: [Name]

**Purpose**: [One sentence]
**Primary User**: [Role for first build]
**Views**: [Numbered list with layout pattern]
**Navigation**: [Model + shared chrome]
**Data Model**: [Entities + relationships]
**Visual Identity**: Density: [H/M/L] | Tone: [Name] | Accent: [Color]
```

After the app brief, enrich the first view using the 7 dimensions from `enrichment-dimensions.md`, carrying forward the scaffold context.

---

## Example

**"Create a team messaging app"** → App: Relay — real-time team messaging with channels, DMs, file sharing. Primary User: Team Member. Views: 1. Chat (Conversational), 2. Channels (List-Detail), 3. Search (Search-First), 4. Settings (Form). Navigation: Sidebar (64px icon-only) + secondary channel list (240px). Data: Channel { id, name, type, members[], unreadCount }, Message { id, channelId, author, text, timestamp, attachments[] }, User { id, name, avatar, status }. Visual: Medium density, Clean & Professional, accent #6366F1 (indigo).
