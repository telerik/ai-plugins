/**
 * version-bump.mjs
 *
 * Two modes:
 *
 *   CI:      node ./scripts/version-bump.mjs ci
 *     Used by the GitHub Actions version-bump workflow on push to main.
 *     Reads the triggering commit message to determine the bump type and the
 *     commit's changed files to scope which plugins are affected, then bumps
 *     those plugins and syncs marketplace.json. Git add/commit/push is left
 *     to the workflow.
 *
 *   Manual:  node ./scripts/version-bump.mjs [<plugin>|all] [major|minor|patch]
 *     Bumps the specified plugin(s) by the given type and syncs marketplace.json.
 *     Defaults: all  patch
 *
 * Conventional commit → bump type mapping:
 *   feat!: / fix!: / BREAKING CHANGE footer  →  major
 *   feat:                                     →  minor
 *   fix: / perf: / refactor:                  →  patch
 *   chore: / docs: / style: / test: / ci: … →  (no bump)
 */

import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

import { CommitParser } from 'conventional-commits-parser';

const execFileAsync = promisify(execFile);

// CommitParser instance shared across calls — configured to handle the `!`
// breaking-change notation as well as BREAKING CHANGE footer keywords.
const commitParser = new CommitParser({
  headerPattern: /^(\w*)(?:\(([\w$.*-]*)\))?(!)?:\s(.*)$/,
  headerCorrespondence: ['type', 'scope', 'breaking', 'subject'],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
  breakingHeaderPattern: /^(\w*)(?:\(([\w$.*-]*)\))?!:\s(.*)$/,
});

const REPO_ROOT = process.cwd();
const PLUGINS_DIR = path.join(REPO_ROOT, 'plugins');
const MARKETPLACE_PATH = path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json');

const VALID_BUMP_TYPES = ['major', 'minor', 'patch'];

// ---------------------------------------------------------------------------
// Semver helpers
// ---------------------------------------------------------------------------

function parseSemver(version) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid semver string: "${version}"`);
  }
  return parts;
}

function bumpVersion(version, type) {
  const [major, minor, patch] = parseSemver(version);
  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ---------------------------------------------------------------------------
// Plugin discovery
// ---------------------------------------------------------------------------

async function findAllPluginNames() {
  const entries = await fs.readdir(PLUGINS_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

function pluginJsonPath(pluginName) {
  return path.join(PLUGINS_DIR, pluginName, '.claude-plugin', 'plugin.json');
}

// ---------------------------------------------------------------------------
// Core operations
// ---------------------------------------------------------------------------

async function bumpPluginVersion(pluginName, bumpType) {
  const jsonPath = pluginJsonPath(pluginName);

  let pluginJson;
  try {
    pluginJson = await readJson(jsonPath);
  } catch {
    throw new Error(`Could not read plugin.json for "${pluginName}" at ${jsonPath}`);
  }

  const oldVersion = pluginJson.version;
  if (!oldVersion) {
    throw new Error(`plugin.json for "${pluginName}" is missing a "version" field`);
  }

  const newVersion = bumpVersion(oldVersion, bumpType);
  pluginJson.version = newVersion;
  await writeJson(jsonPath, pluginJson);

  return { pluginName, oldVersion, newVersion };
}

/**
 * Reads the fields that are synced into marketplace.json from a plugin.json.
 */
async function readPluginFields(pluginName) {
  const jsonPath = pluginJsonPath(pluginName);
  const pluginJson = await readJson(jsonPath);
  return {
    version: pluginJson.version ?? '0.0.0',
    description: pluginJson.description ?? '',
  };
}

/**
 * Syncs the marketplace.json:
 *  - Reads current versions from every plugin's plugin.json
 *  - Updates (or inserts) each plugin entry in marketplace.plugins[]
 *  - Bumps the marketplace top-level version by bumpType
 *
 * Returns the new marketplace top-level version.
 */
async function syncMarketplace(allPluginNames, bumpType) {
  let marketplace;
  try {
    marketplace = await readJson(MARKETPLACE_PATH);
  } catch {
    throw new Error(`Could not read marketplace.json at ${MARKETPLACE_PATH}`);
  }

  if (!Array.isArray(marketplace.plugins)) {
    marketplace.plugins = [];
  }

  // Sync every plugin's fields from its plugin.json
  for (const pluginName of allPluginNames) {
    let fields;
    try {
      fields = await readPluginFields(pluginName);
    } catch {
      // Plugin folder exists but has no plugin.json — skip
      console.warn(`  [warn] No plugin.json for "${pluginName}", skipping marketplace sync for it.`);
      continue;
    }

    const existing = marketplace.plugins.find((p) => p.name === pluginName);
    if (existing) {
      existing.version = fields.version;
      existing.description = fields.description;
    } else {
      // Add a minimal entry for newly discovered plugins
      marketplace.plugins.push({
        name: pluginName,
        description: fields.description,
        version: fields.version,
        author: { name: 'Progress' },
        source: `./plugins/${pluginName}`,
        category: 'development',
      });
      console.log(`  [new] Added "${pluginName}" to marketplace.json`);
    }
  }

  // Bump the marketplace's own top-level version
  const oldMarketplaceVersion = marketplace.version ?? '0.0.0';
  marketplace.version = bumpVersion(oldMarketplaceVersion, bumpType);

  await writeJson(MARKETPLACE_PATH, marketplace);

  return { oldVersion: oldMarketplaceVersion, newVersion: marketplace.version };
}

// ---------------------------------------------------------------------------
// Conventional commits — bump type detection
// ---------------------------------------------------------------------------

/**
 * Returns 'major', 'minor', 'patch', or null (no bump) based on a
 * conventional commit message, using conventional-commits-parser.
 */
function determineBumpType(commitMessage) {
  const parsed = commitParser.parse(commitMessage);

  if (!parsed.type) return null; // Not a conventional commit — skip

  const isBreaking = parsed.notes.some(
    (n) => n.title === 'BREAKING CHANGE' || n.title === 'BREAKING-CHANGE'
  );
  if (isBreaking) return 'major';

  const type = parsed.type.toLowerCase();
  if (type === 'feat') return 'minor';
  if (['fix', 'perf', 'refactor'].includes(type)) return 'patch';

  // chore, docs, style, test, ci, build, revert → no version bump
  return null;
}

/**
 * Given a list of changed file paths and all known plugin names, returns
 * the subset of plugins whose files were touched.
 */
function getAffectedPlugins(changedFiles, allPluginNames) {
  const affected = new Set();
  for (const file of changedFiles) {
    for (const pluginName of allPluginNames) {
      if (file.startsWith(`plugins/${pluginName}/`)) {
        affected.add(pluginName);
      }
    }
  }
  return [...affected];
}

// ---------------------------------------------------------------------------
// Git helpers
// ---------------------------------------------------------------------------

async function git(...args) {
  const { stdout } = await execFileAsync('git', args, { cwd: REPO_ROOT });
  return stdout.trim();
}

async function getLastCommitMessage() {
  return git('log', '-1', '--pretty=%B', 'HEAD');
}

async function getLastCommitFiles() {
  const output = await git('diff-tree', '--no-commit-id', '-r', '--name-only', 'HEAD');
  return output ? output.split('\n').filter(Boolean) : [];
}

// ---------------------------------------------------------------------------
// CLI commands
// ---------------------------------------------------------------------------

async function runManual(pluginArg, bumpTypeArg) {
  if (!VALID_BUMP_TYPES.includes(bumpTypeArg)) {
    console.error(
      `Error: Invalid bump type "${bumpTypeArg}". Must be one of: ${VALID_BUMP_TYPES.join(', ')}`
    );
    process.exit(1);
  }

  const allPluginNames = await findAllPluginNames();

  let targetPlugins;
  if (pluginArg === 'all') {
    targetPlugins = allPluginNames;
  } else {
    if (!allPluginNames.includes(pluginArg)) {
      console.error(
        `Error: Plugin "${pluginArg}" not found in ${PLUGINS_DIR}.\nAvailable: ${allPluginNames.join(', ')}`
      );
      process.exit(1);
    }
    targetPlugins = [pluginArg];
  }

  console.log(`\nBumping ${bumpTypeArg} version for: ${targetPlugins.join(', ')}\n`);

  for (const pluginName of targetPlugins) {
    const { oldVersion, newVersion } = await bumpPluginVersion(pluginName, bumpTypeArg);
    console.log(`  ${pluginName}: ${oldVersion} → ${newVersion}`);
  }

  console.log('');
  const { oldVersion: oldMV, newVersion: newMV } = await syncMarketplace(
    allPluginNames,
    bumpTypeArg
  );
  console.log(`  marketplace version: ${oldMV} → ${newMV}`);
  console.log('\nDone.\n');
}

/**
 * CI mode: reads the last commit message and changed files, bumps the
 * affected plugin(s) and syncs marketplace.json. Git add/commit/push is
 * handled by the GitHub Actions workflow.
 */
async function runCi() {
  // 1. Determine bump type from the triggering commit message
  const commitMessage = await getLastCommitMessage();
  const bumpType = determineBumpType(commitMessage);

  if (!bumpType) {
    console.log('[version-bump] Commit type does not require a version bump. Skipping.');
    return;
  }

  // 2. Scope to plugins touched by this commit
  const allPluginNames = await findAllPluginNames();
  const changedFiles = await getLastCommitFiles();
  const affectedPlugins = getAffectedPlugins(changedFiles, allPluginNames);

  if (affectedPlugins.length === 0) {
    console.log('[version-bump] No plugin files changed in this commit. Skipping.');
    return;
  }

  console.log(`\n[version-bump] ${bumpType} bump → ${affectedPlugins.join(', ')}\n`);

  // 3. Bump only the affected plugins
  for (const pluginName of affectedPlugins) {
    const { oldVersion, newVersion } = await bumpPluginVersion(pluginName, bumpType);
    console.log(`  ${pluginName}: ${oldVersion} → ${newVersion}`);
  }

  // 4. Sync ALL plugin versions into marketplace.json
  console.log('');
  const { oldVersion: oldMV, newVersion: newMV } = await syncMarketplace(
    allPluginNames,
    bumpType
  );
  console.log(`  marketplace version: ${oldMV} → ${newMV}`);
  console.log('\n[version-bump] Files updated. Workflow will handle the commit.\n');
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  const [firstArg = 'all', secondArg = 'patch'] = process.argv.slice(2);

  if (firstArg === 'ci') {
    await runCi();
    return;
  }

  await runManual(firstArg, secondArg);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
