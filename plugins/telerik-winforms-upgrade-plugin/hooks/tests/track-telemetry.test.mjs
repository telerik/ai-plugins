import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const pluginRoot = fileURLToPath(new URL('../..', import.meta.url));
const config = JSON.parse(readFileSync(path.join(pluginRoot, 'hooks.json'), 'utf8'));
const powershellDirectory = process.platform === 'win32'
  ? path.join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0')
  : '';
const testPath = process.platform === 'win32'
  ? `${powershellDirectory};${path.join(process.env.SystemRoot, 'System32')}`
  : process.env.PATH;

test('configured PowerShell hooks preserve variables and stdin', {
  skip: process.platform !== 'win32',
}, () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'telerik-hook-test-'));
  try {
    const installedRoot = path.join(directory, 'plugin with spaces');
    const scriptDirectory = path.join(installedRoot, 'hooks', 'scripts');
    mkdirSync(scriptDirectory, { recursive: true });
    copyFileSync(
      path.join(pluginRoot, 'hooks', 'scripts', 'track-telemetry.ps1'),
      path.join(scriptDirectory, 'track-telemetry.ps1'),
    );

    function invoke(event, payload, roots) {
      const env = { ...process.env, APPDATA: directory };
      for (const key of Object.keys(env)) {
        if (key.toLowerCase() === 'path') delete env[key];
      }
      env.PATH = testPath;
      env.TELERIK_TELEMETRY_OFF = '0';
      delete env.PLUGIN_ROOT;
      delete env.CLAUDE_PLUGIN_ROOT;
      Object.assign(env, roots);
      const result = spawnSync('powershell.exe', [
        '-NoProfile', '-NonInteractive', '-Command', config.hooks[event][0].powershell,
      ], { input: JSON.stringify(payload), encoding: 'utf8', env, timeout: 10000 });
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stderr, '');
      assert.deepEqual(JSON.parse(result.stdout), { continue: true });
    }

    for (const rootVariable of ['PLUGIN_ROOT', 'CLAUDE_PLUGIN_ROOT']) {
      const roots = { [rootVariable]: installedRoot };
      const common = { session_id: rootVariable, timestamp: '2026-11-13T10:00:00Z' };
      invoke('SessionStart', common, roots);
      invoke('PostToolUse', {
        ...common,
        tool_name: 'Read',
        tool_input: {
          filePath: path.join(pluginRoot, 'upgrade', 'skills', 'lazy',
            'telerik-winforms-component-guidance', 'SKILL.md'),
        },
      }, roots);
      invoke('SessionEnd', common, roots);

      const entries = readFileSync(path.join(directory, 'Telerik', 'upgrade-plugin',
        `session-${rootVariable}.jsonl`), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
      assert.deepEqual(entries.map(entry => entry.event),
        ['session_start', 'skill_read', 'session_end']);
      assert.ok(entries.every(entry => entry.session_id === rootVariable));
      assert.equal(entries[1].skill_id, 'telerik-winforms-component-guidance');
      assert.equal(entries[1].discovery, 'lazy');
    }

    for (const event of Object.keys(config.hooks)) {
      invoke(event, { session_id: 'missing-root' }, {});
      invoke(event, { session_id: 'missing-script' }, { PLUGIN_ROOT: directory });
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('telemetry forwarding respects opt-out, CLI support, and failure isolation', {
  skip: process.platform !== 'win32',
}, () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'telerik-forwarding-test-'));
  try {
    const bin = path.join(directory, 'CLI with spaces');
    mkdirSync(bin);
    const fixture = path.join(pluginRoot, 'hooks', 'tests', 'TelemetryCliFixture.cs');
    const compile = spawnSync('powershell.exe', [
      '-NoProfile', '-NonInteractive', '-Command',
      'Add-Type -Path $env:FIXTURE -OutputAssembly $env:EXECUTABLE -OutputType ConsoleApplication',
    ], {
      encoding: 'utf8',
      env: { ...process.env, FIXTURE: fixture, EXECUTABLE: path.join(bin, 'telerik.exe') },
      timeout: 30000,
    });
    assert.ifError(compile.error);
    assert.equal(compile.status, 0, compile.stderr);

    const bash = path.join(process.env.ProgramFiles, 'Git', 'bin', 'bash.exe');
    assert.ok(existsSync(bash), 'Git Bash is required to validate the Bash hook on Windows.');
    for (const shell of ['powershell', 'bash']) {
      for (const mode of ['success', 'disabled', 'missing', 'unsupported',
        'failure', 'timeout-help', 'timeout-record']) {
        const output = path.join(directory, `${shell}-${mode}`);
        mkdirSync(output);
        const env = { ...process.env };
        // Windows environment variable names are case-insensitive.
        for (const key of Object.keys(env)) {
          if (key.toLowerCase() === 'path') delete env[key];
        }
        Object.assign(env, {
          PATH: mode === 'missing' ? testPath : `${bin};${testPath}`,
          APPDATA: output,
          PLUGIN_ROOT: pluginRoot,
          TELERIK_TELEMETRY_OFF: mode === 'disabled' ? '1' : '0',
          TEST_TELEMETRY_DIRECTORY: output,
          TEST_TELEMETRY_MODE: mode,
        });
        const session = { session_id: 'forwarding', timestamp: '2026-11-13T10:00:00Z' };
        const events = mode === 'success' || mode === 'disabled'
          ? ['SessionStart', 'PostToolUse', 'SessionEnd']
          : ['SessionStart'];
        for (const event of events) {
          const payload = {
            ...session,
            tool_name: 'Read',
            tool_input: {
              filePath: path.join(pluginRoot, 'upgrade', 'skills', 'lazy',
                'telerik-winforms-component-guidance', 'SKILL.md'),
            },
          };
          const args = shell === 'powershell'
            ? ['-NoProfile', '-NonInteractive', '-Command', config.hooks[event][0].powershell]
            : ['-c', 'export PATH="/usr/bin:$PATH"; eval "$1"', '--', config.hooks[event][0].bash];
          const started = Date.now();
          const result = spawnSync(shell === 'powershell' ? 'powershell.exe' : bash, args, {
            input: JSON.stringify(payload), encoding: 'utf8', env, timeout: 6000,
          });
          assert.ifError(result.error);
          assert.equal(result.status, 0, `${shell}/${mode}: ${result.stderr}`);
          assert.deepEqual(JSON.parse(result.stdout), { continue: true });
          assert.ok(Date.now() - started < 5000, `${shell}/${mode}: exceeded hook budget`);
          if (['unsupported', 'failure', 'timeout-help', 'timeout-record'].includes(mode)) {
            assert.match(result.stderr, /failed|timed out/, `${shell}/${mode}`);
          } else {
            assert.equal(result.stderr, '', `${shell}/${mode}`);
          }
        }
        const log = path.join(output, 'Telerik', 'upgrade-plugin', 'session-forwarding.jsonl');
        const calls = path.join(output, 'calls.txt');
        const forwarded = path.join(output, 'forwarded.jsonl');
        if (mode === 'disabled') {
          assert.equal(existsSync(log), false);
          assert.equal(existsSync(calls), false);
        } else {
          const lines = readFileSync(log, 'utf8').trim().split(/\r?\n/);
          assert.equal(lines.length, events.length);
          if (mode === 'success') {
            assert.deepEqual(readFileSync(forwarded, 'utf8').trim().split(/\r?\n/), lines);
            assert.deepEqual(lines.map(line => JSON.parse(line).event),
              ['session_start', 'skill_read', 'session_end']);
            assert.equal(readFileSync(calls, 'utf8').trim().split('\n').length, 6);
          } else {
            assert.equal(existsSync(forwarded), false);
            if (mode === 'missing') assert.equal(existsSync(calls), false);
            if (mode === 'unsupported' || mode === 'timeout-help') {
              assert.equal(readFileSync(calls, 'utf8').trim(), 'telemetry|record|--help');
            }
          }
        }
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
