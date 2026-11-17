import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import yaml from 'js-yaml';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

function readSkill(file) {
  const text = readFileSync(file, 'utf8');
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  assert.ok(frontmatter, `Missing frontmatter: ${file}`);
  return { ...yaml.load(frontmatter[1]), body: text.slice(frontmatter[0].length) };
}

for (const product of ['winforms', 'wpf']) {
  const skills = path.join(repoRoot, 'plugins', `telerik-${product}-upgrade-plugin`,
    'upgrade', 'skills');
  const extension = path.join(skills, 'extensions', `telerik-${product}-workflow-efficiency`);

  test(`${product}: efficiency guidance reaches execution and review for every standalone scenario`, () => {
    const skill = readSkill(path.join(extension, 'SKILL.md'));
    const metadata = skill.metadata;
    assert.equal(metadata.discovery, 'scenarioExtension');
    const scenarios = readdirSync(path.join(skills, 'scenarios'), { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => readSkill(path.join(skills, 'scenarios', entry.name, 'SKILL.md')).name);
    assert.deepEqual([...metadata['extends-scenario']].sort(), scenarios.sort());
    assert.deepEqual(metadata.scope, ['Execution', 'IntegrityReview']);
    assert.equal(typeof metadata.order, 'number');

    for (const scope of metadata.scope) {
      const instructionFile = metadata.scopeInstructions?.[scope] ?? 'SKILL.md';
      const fullPath = path.resolve(extension, instructionFile);
      assert.ok(fullPath.startsWith(`${extension}${path.sep}`), 'Scope path escapes extension');
      assert.ok(existsSync(fullPath), `Missing instructions for ${scope}`);
      const instructions = readFileSync(fullPath, 'utf8');
      assert.ok(instructions.trim().length > 0);
    }

    assert.match(skill.body, /initial verdict[\s\S]*clean PASS[\s\S]*review\.md/);
    assert.match(skill.body, /one bounded, unresolved question/);
    assert.ok(existsSync(path.join(skills, 'lazy',
      `telerik-${product}-component-guidance`, 'SKILL.md')));
  });

  test(`${product}: evidence reuse retains licensing and changed-input safeguards`, () => {
    const execution = readFileSync(path.join(extension, 'scopes', 'execution.md'), 'utf8');
    assert.match(execution, /configuration, toolchain,[\s\S]*build-relevant inputs/);
    assert.match(execution, /license inputs[\s\S]*TKL results/);
    assert.match(execution, /do not dispatch a second review while one is[\s\S]*active/);

    const licensing = readSkill(path.join(skills, 'lazy',
      `telerik-${product}-license-verification`, 'SKILL.md')).body;
    assert.match(licensing, /Reuse it only when[\s\S]*license inputs are unchanged/);
    assert.match(licensing, /preflight[\s\S]*alone is insufficient/);
  });

  test(`${product}: warnings are reported as known issues and never gate a task`, () => {
    const verification = readSkill(path.join(skills, 'lazy',
      `telerik-${product}-migration-verification`, 'SKILL.md')).body;
    assert.match(verification, /\*\*Build gate\*\*[\s\S]*?0 errors[\s\S]*?no\s+blocking `TKL\*` diagnostics/);
    assert.match(verification, /Report only[\s\S]*Dependency-graph[\s\S]*MSB3277/);
    assert.match(verification, /\*\*Known issues\*\*/);

    const execution = readFileSync(path.join(extension, 'scopes', 'execution.md'), 'utf8');
    assert.match(execution, /not a warning-free\s+build/);
    assert.match(execution, /never return `STATUS: blocked`/);
    const review = readSkill(path.join(extension, 'SKILL.md')).body;
    assert.match(review, /Do not raise a finding, or return CHANGES NEEDED, because the build has\s+warnings/);

    for (const entry of readdirSync(path.join(skills, 'scenarios'), { withFileTypes: true })
      .filter(candidate => candidate.isDirectory())) {
      const scenario = readFileSync(path.join(skills, 'scenarios', entry.name, 'SKILL.md'), 'utf8');
      assert.match(scenario, /^## Build Warnings Policy$/m,
        `${entry.name} is missing a Build Warnings Policy section`);
      assert.match(scenario, /\*\*Override for this scenario:\*\*/, entry.name);
      assert.match(scenario, /`complete_task`\s+without `failed`/, entry.name);
    }
  });
}

test('WinForms: every package-helper contract identifies mutation before restore', () => {
  const skills = path.join(repoRoot, 'plugins', 'telerik-winforms-upgrade-plugin',
    'upgrade', 'skills');
  const scenario = path.join(skills, 'scenarios', 'telerik-winforms-control-conversion');
  for (const file of [
    path.join(scenario, 'SKILL.md'),
    path.join(skills, 'lazy', 'telerik-winforms-conversion', 'SKILL.md'),
  ]) {
    const text = readFileSync(file, 'utf8');
    const row = text.split(/\r?\n/).find(line => line.startsWith('| `telerik_add_package_reference`'));
    assert.match(row, /Adds the missing[\s\S]*csprojModified[\s\S]*Does not restore/);
    assert.doesNotMatch(row, /[Ii]nstall instructions/);
  }
  const execution = readFileSync(path.join(scenario, 'execution.md'), 'utf8');
  assert.match(execution, /finish research and enrich `task\.md`[\s\S]*before calling it/);
  assert.match(execution, /Pin an inserted wildcard to the confirmed[\s\S]*version before restoring/);
});

test('WinForms: conversion plans group checkpoints without dropping per-class validation', () => {
  const scenario = path.join(repoRoot, 'plugins', 'telerik-winforms-upgrade-plugin',
    'upgrade', 'skills', 'scenarios', 'telerik-winforms-control-conversion');
  const planning = readFileSync(path.join(scenario, 'planning.md'), 'utf8');
  assert.match(planning, /One setup task per project[\s\S]*activation verification, and the baseline build/);
  assert.match(planning, /One task per class pair/);
  assert.match(planning, /One finalization task per project[\s\S]*full build before theming, theme setup,[\s\S]*final build/);

  const execution = readFileSync(path.join(scenario, 'execution.md'), 'utf8');
  assert.match(execution, /initial `\.cs` \/ `\.vb` control[\s\S]*conversion/);
  assert.match(execution, /narrowly scoped compiler\/API fixes[\s\S]*are allowed/);
  assert.match(execution, /A mapping cannot be confirmed[\s\S]*do not[\s\S]*guessed type\/property/);
  assert.match(execution, /Warnings only, no errors[\s\S]*Do not return\s+`blocked`/);

  assert.doesNotMatch(planning, /builds clean/);
  assert.match(planning, /Done when:[^\n]*0 errors and no blocking `TKL\*` diagnostics/);
});
