# Contributing to telerik/ai-plugins

Thank you for contributing! This guide covers how the repository is structured, how to add or modify plugins, how shared templates work, and how versioning is managed.

---

## Plugin Structure

Every plugin lives under `plugins/` and follows this standard layout:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json        # Required: plugin manifest (name, version, description)
├── templates.yaml         # Optional: plugin-local template rendering config
├── skills/                # Agent skills — each in its own subdirectory
│   └── skill-name/
│       └── SKILL.md       # Skill instructions with YAML frontmatter
├── .mcp.json              # MCP server definitions
└── README.md
```

To add a new plugin, create a directory under `plugins/` following this layout, then register it in `.claude-plugin/marketplace.json`.

---

## Template Rendering

Shared template folders under `templates/` can be rendered into plugin-specific output using Handlebars variables defined in each plugin's `templates.yaml` file.

### Config format

Paths in `templates.yaml` are resolved relative to the folder containing that file. A plugin can define multiple template jobs in the same file as long as each job writes to a distinct destination.

```yaml
templates:
    - source: ../../templates/skills/prompt-enrichment
      destination: ./skills/prompt-enrichment
      variables:
          family: Kendo
          assistantPrefix: kendo-react

    - source: ../../templates/skills/another-template
      destination: ./skills/another-template
      variables:
          family: Kendo
          assistantPrefix: kendo-react
```

### Commands

Build all plugin templates once:

```bash
npm run templates:build
```

Rebuild automatically while templates or config files change:

```bash
npm run templates:watch
```

The renderer removes each destination folder before writing so the generated output mirrors the template source cleanly.

### Template authoring workflow

1. Edit files in `templates/...` or update a plugin's `templates.yaml`.
2. Run `npm run templates:build` to regenerate destination folders.
3. Stage both the source changes and the regenerated output before committing.

Do not hand-edit files inside `plugins/*/skills/...` paths that are managed by a `templates.yaml` entry — the pre-commit hook will reject the commit and ask you to make the change in the template source instead.

Validate template integrity at any time without building:

```bash
npm run templates:check
```

The hook runs this automatically on every `git commit`. It blocks the commit if:
- A template source or `templates.yaml` was staged but the destination is out of sync — run `templates:build` and re-stage.
- A generated destination file was edited directly without a matching template/config change — edit the template source instead.

---

## Versioning

Each plugin is versioned independently via its own `.claude-plugin/plugin.json` manifest. The root `.claude-plugin/marketplace.json` acts as the registry — it mirrors every plugin's `version` and `description` and carries its own top-level version that increments alongside the plugins.

### Automatic bumps (CI)

Version bumps happen automatically on every merge to `main` via the [Version Bump](.github/workflows/version-bump.yml) GitHub Actions workflow. The bump type is derived from the merge commit message following the [Conventional Commits](https://www.conventionalcommits.org/) spec.

Only the plugins whose files were touched by the commit get their version bumped. The marketplace top-level version is bumped by the same type on every qualifying merge.

The workflow commits the updated files back to `main` with the message `chore(release): bump plugin versions [skip ci]` so it does not trigger itself again.

### Manual bumps

To force a bump locally without waiting for CI:

```bash
# Patch-bump a single plugin
node ./scripts/version-bump.mjs kendo-react-plugin patch
```

### What gets updated

Each bump (CI or manual) touches:
- `plugins/<name>/.claude-plugin/plugin.json` — `version` field for affected plugins
- `.claude-plugin/marketplace.json` — `version` and `description` synced for every plugin, plus the top-level `version` bumped

---

## Commit conventions

This repository uses [Conventional Commits](https://www.conventionalcommits.org/). The commit type determines the version bump applied by CI:

| Type | Bump |
|------|------|
| `fix` | patch |
| `feat` | minor |
| `feat!` / `BREAKING CHANGE` | major |
| `chore`, `docs`, `refactor`, etc. | no bump |
