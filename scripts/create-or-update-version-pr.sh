#!/usr/bin/env bash
# create-or-update-version-pr.sh
#
# Stages version files, commits them onto a dedicated branch, force-pushes,
# then creates a PR against main — or updates the existing open one.
#
# Usage:
#   ./scripts/create-or-update-version-pr.sh <branch> <commit-msg>
#
# Environment:
#   GH_TOKEN  GitHub token with contents:write and pull-requests:write

set -euo pipefail

BRANCH="${1:?Usage: $0 <branch> <commit-msg>}"
COMMIT_MSG="${2:?Usage: $0 <branch> <commit-msg>}"

# ---------------------------------------------------------------------------
# Stage version files
# ---------------------------------------------------------------------------
find plugins -name "plugin.json" -path "*/.claude-plugin/*" -exec git add {} +
git add .claude-plugin/marketplace.json

# Nothing to do if no files changed (commit type didn't warrant a bump)
if git diff --staged --quiet; then
  echo "No version changes — skipping PR."
  exit 0
fi

# ---------------------------------------------------------------------------
# Commit onto the bump branch and force-push
# ---------------------------------------------------------------------------
git checkout -B "$BRANCH"
git commit -m "$COMMIT_MSG"
git push --force origin "$BRANCH"

# ---------------------------------------------------------------------------
# Create a new PR or report the existing one
# ---------------------------------------------------------------------------
EXISTING_PR=$(gh pr list \
  --base main \
  --head "$BRANCH" \
  --state open \
  --json number \
  --jq '.[0].number')

if [ -n "$EXISTING_PR" ]; then
  echo "PR #$EXISTING_PR already exists — branch updated, no new PR needed."
else
  gh pr create \
    --base main \
    --head "$BRANCH" \
    --title "$COMMIT_MSG" \
    --body "Automated version bump triggered by a conventional commit merged to \`main\`. Review the version changes and merge to apply them."
  echo "Version bump PR created."
fi
