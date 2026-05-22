import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

import chokidar from 'chokidar';
import Handlebars from 'handlebars';
import yaml from 'js-yaml';

const execFileAsync = promisify(execFile);
const repoRoot = process.cwd();
const command = process.argv[2] ?? 'build';

async function main() {
  if (command === 'build') {
    const buildResult = await buildAll();
    logBuildSummary(buildResult);
    return;
  }

  if (command === 'watch') {
    await watchAll();
    return;
  }

  if (command === 'check') {
    const errors = await checkAll();
    if (errors.length > 0) {
      console.error('\nTemplate integrity check failed:\n');
      for (const error of errors) {
        console.error(`  ✗ ${error}\n`);
      }
      process.exitCode = 1;
      return;
    }
    console.log('Template integrity check passed.');
    return;
  }

  throw new Error(`Unsupported command "${command}". Use "build", "watch", or "check".`);
}

async function buildAll() {
  const configPaths = await findTemplateConfigPaths();
  const configs = await loadTemplateConfigs(configPaths);

  if (configs.length === 0) {
    console.log('No templates.yaml files found.');
    return { configCount: 0, templateCount: 0, fileCount: 0 };
  }

  let templateCount = 0;
  let fileCount = 0;

  for (const config of configs) {
    for (const templateEntry of config.templates) {
      templateCount += 1;
      fileCount += await renderTemplateDirectory(templateEntry);
    }
  }

  return {
    configCount: configs.length,
    templateCount,
    fileCount,
    configPaths,
  };
}

async function watchAll() {
  let watcher;
  let rebuildTimer;

  const scheduleBuild = async (reason) => {
    if (rebuildTimer) {
      clearTimeout(rebuildTimer);
    }

    rebuildTimer = setTimeout(async () => {
      try {
        if (watcher) {
          await watcher.close();
        }

        const buildResult = await buildAll();
        logBuildSummary(buildResult);

        const watchPaths = await collectWatchPaths();
        watcher = chokidar.watch(watchPaths, {
          ignoreInitial: true,
        });

        watcher.on('all', async (eventName, changedPath) => {
          console.log(`[watch] ${eventName}: ${path.relative(repoRoot, changedPath)}`);
          await scheduleBuild(changedPath);
        });
      } catch (error) {
        console.error(error.message);
      }
    }, 100);

    if (reason) {
      console.log(`[watch] rebuilding after change in ${path.relative(repoRoot, reason)}`);
    }
  };

  await scheduleBuild();
}

async function findTemplateConfigPaths() {
  const pluginsRoot = path.join(repoRoot, 'plugins');
  const entries = await fs.readdir(pluginsRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(pluginsRoot, entry.name, 'templates.yaml'));
}

async function loadTemplateConfigs(configPaths) {
  const configs = [];

  for (const configPath of configPaths) {
    try {
      await fs.access(configPath);
    } catch {
      continue;
    }

    const fileContent = await fs.readFile(configPath, 'utf8');
    const parsed = yaml.load(fileContent);

    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.templates)) {
      throw new Error(`Invalid templates config in ${path.relative(repoRoot, configPath)}. Expected a top-level "templates" array.`);
    }

    const configDir = path.dirname(configPath);
    const templates = parsed.templates.map((entry, index) => normalizeTemplateEntry(entry, configPath, configDir, index));
    assertUniqueDestinations(templates, configPath);

    configs.push({
      configPath,
      templates,
    });
  }

  return configs;
}

function assertUniqueDestinations(templates, configPath) {
  const seenDestinations = new Map();

  for (const templateEntry of templates) {
    const destinationKey = templateEntry.destinationPath;

    if (seenDestinations.has(destinationKey)) {
      throw new Error(
        `Duplicate template destination in ${path.relative(repoRoot, configPath)}: ${path.relative(repoRoot, destinationKey)}`,
      );
    }

    seenDestinations.set(destinationKey, templateEntry.sourcePath);
  }
}

function normalizeTemplateEntry(entry, configPath, configDir, index) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error(`Invalid template entry #${index + 1} in ${path.relative(repoRoot, configPath)}.`);
  }

  const { source, destination, variables } = entry;

  if (typeof source !== 'string' || source.length === 0) {
    throw new Error(`Template entry #${index + 1} in ${path.relative(repoRoot, configPath)} is missing a string "source".`);
  }

  if (typeof destination !== 'string' || destination.length === 0) {
    throw new Error(`Template entry #${index + 1} in ${path.relative(repoRoot, configPath)} is missing a string "destination".`);
  }

  if (!variables || typeof variables !== 'object' || Array.isArray(variables)) {
    throw new Error(`Template entry #${index + 1} in ${path.relative(repoRoot, configPath)} is missing an object "variables".`);
  }

  return {
    configPath,
    sourcePath: path.resolve(configDir, source),
    destinationPath: path.resolve(configDir, destination),
    variables,
  };
}

async function renderTemplateDirectory(templateEntry) {
  const { sourcePath, destinationPath, variables, configPath } = templateEntry;
  const sourceStats = await fs.stat(sourcePath).catch(() => null);

  if (!sourceStats?.isDirectory()) {
    throw new Error(`Template source is missing or not a directory: ${path.relative(repoRoot, sourcePath)} (from ${path.relative(repoRoot, configPath)})`);
  }

  await fs.rm(destinationPath, { recursive: true, force: true });
  await fs.mkdir(destinationPath, { recursive: true });

  return copyRenderedDirectory(sourcePath, destinationPath, variables, destinationPath);
}

async function copyRenderedDirectory(currentSourceDir, currentDestinationDir, variables, destinationRoot) {
  const entries = await fs.readdir(currentSourceDir, { withFileTypes: true });
  let fileCount = 0;

  for (const entry of entries) {
    const renderedName = renderString(entry.name, variables);
    const sourceEntryPath = path.join(currentSourceDir, entry.name);
    const destinationEntryPath = path.join(currentDestinationDir, renderedName);
    assertInsideDestination(destinationRoot, destinationEntryPath);

    if (entry.isDirectory()) {
      await fs.mkdir(destinationEntryPath, { recursive: true });
      fileCount += await copyRenderedDirectory(sourceEntryPath, destinationEntryPath, variables, destinationRoot);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const fileContent = await fs.readFile(sourceEntryPath, 'utf8');
    const renderedContent = renderString(fileContent, variables);
    await fs.mkdir(path.dirname(destinationEntryPath), { recursive: true });
    await fs.writeFile(destinationEntryPath, renderedContent, 'utf8');
    fileCount += 1;
  }

  return fileCount;
}

function renderString(template, variables) {
  return Handlebars.compile(template, { noEscape: true })(variables);
}

function assertInsideDestination(destinationRoot, targetPath) {
  const relativePath = path.relative(destinationRoot, targetPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Rendered path escapes destination: ${targetPath}`);
  }
}

async function collectWatchPaths() {
  const configPaths = await findTemplateConfigPaths();
  const configs = await loadTemplateConfigs(configPaths);
  const watchPaths = new Set(configPaths);

  for (const config of configs) {
    for (const templateEntry of config.templates) {
      watchPaths.add(templateEntry.sourcePath);
    }
  }

  return [...watchPaths];
}

function logBuildSummary(buildResult) {
  if (buildResult.configCount === 0) {
    return;
  }

  console.log(
    `Rendered ${buildResult.fileCount} files from ${buildResult.templateCount} template target(s) across ${buildResult.configCount} config file(s).`,
  );
}

async function checkAll() {
  const configPaths = await findTemplateConfigPaths();
  const configs = await loadTemplateConfigs(configPaths);

  if (configs.length === 0) {
    return [];
  }

  const stagedRelPaths = await getStagedPaths();
  const errors = [];

  for (const { configPath, templates } of configs) {
    const configRelPath = path.relative(repoRoot, configPath);
    const configStaged = stagedRelPaths.has(configRelPath);

    for (const templateEntry of templates) {
      const { sourcePath, destinationPath } = templateEntry;

      const sourceFiles = await collectFiles(sourcePath).catch(() => []);
      const stagedSourceFiles = sourceFiles.filter((f) => stagedRelPaths.has(path.relative(repoRoot, f)));

      const destIsDir = await fs.stat(destinationPath).then((s) => s.isDirectory()).catch(() => false);
      const destFiles = destIsDir ? await collectFiles(destinationPath) : [];
      const stagedDestFiles = destFiles.filter((f) => stagedRelPaths.has(path.relative(repoRoot, f)));

      const templateOrConfigChanged = configStaged || stagedSourceFiles.length > 0;
      const destChangedDirectly = stagedDestFiles.length > 0 && !templateOrConfigChanged;

      if (destChangedDirectly) {
        for (const f of stagedDestFiles) {
          errors.push(
            `Direct edit of generated file: ${path.relative(repoRoot, f)}\n` +
            `    Edit the template source (${path.relative(repoRoot, sourcePath)}) instead, then run: npm run templates:build`,
          );
        }
      }

      if (templateOrConfigChanged) {
        const syncErrors = await checkTemplateSync(templateEntry);
        errors.push(...syncErrors);
      }
    }
  }

  return errors;
}

async function checkTemplateSync({ sourcePath, destinationPath, variables, configPath }) {
  const sourceStats = await fs.stat(sourcePath).catch(() => null);

  if (!sourceStats?.isDirectory()) {
    return [
      `Template source is missing or not a directory: ${path.relative(repoRoot, sourcePath)}\n` +
      `    (referenced from ${path.relative(repoRoot, configPath)})`,
    ];
  }

  const expected = await renderInMemory(sourcePath, destinationPath, variables);
  const errors = [];

  for (const [relPath, expectedContent] of expected) {
    const actualPath = path.join(destinationPath, relPath);
    const actualContent = await fs.readFile(actualPath, 'utf8').catch(() => null);

    if (actualContent === null) {
      errors.push(
        `Generated file is missing: ${path.relative(repoRoot, actualPath)}\n` +
        `    Run: npm run templates:build  then restage the output.`,
      );
    } else if (actualContent !== expectedContent) {
      errors.push(
        `Generated file is stale: ${path.relative(repoRoot, actualPath)}\n` +
        `    Run: npm run templates:build  then restage the output.`,
      );
    }
  }

  const destIsDir = await fs.stat(destinationPath).then((s) => s.isDirectory()).catch(() => false);

  if (destIsDir) {
    const actualFiles = await collectFiles(destinationPath);
    for (const actualFile of actualFiles) {
      const relPath = path.relative(destinationPath, actualFile);
      if (!expected.has(relPath)) {
        errors.push(
          `Orphaned generated file (not produced by current template): ${path.relative(repoRoot, actualFile)}\n` +
          `    Run: npm run templates:build  then restage the output.`,
        );
      }
    }
  }

  return errors;
}

async function renderInMemory(sourcePath, destinationPath, variables) {
  const result = new Map();
  await collectRenderedFiles(sourcePath, destinationPath, variables, destinationPath, result);
  return result;
}

async function collectRenderedFiles(currentSourceDir, currentDestDir, variables, destRoot, result) {
  const entries = await fs.readdir(currentSourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const renderedName = renderString(entry.name, variables);
    const sourceEntryPath = path.join(currentSourceDir, entry.name);
    const destEntryPath = path.join(currentDestDir, renderedName);

    if (entry.isDirectory()) {
      await collectRenderedFiles(sourceEntryPath, destEntryPath, variables, destRoot, result);
    } else if (entry.isFile()) {
      const content = await fs.readFile(sourceEntryPath, 'utf8');
      result.set(path.relative(destRoot, destEntryPath), renderString(content, variables));
    }
  }
}

async function collectFiles(dir) {
  const files = [];
  await walkDirectory(dir, files);
  return files;
}

async function walkDirectory(dir, files) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
}

async function getStagedPaths() {
  try {
    const { stdout } = await execFileAsync('git', ['diff', '--cached', '--name-only'], { cwd: repoRoot });
    return new Set(stdout.split('\n').filter(Boolean));
  } catch {
    return new Set();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});