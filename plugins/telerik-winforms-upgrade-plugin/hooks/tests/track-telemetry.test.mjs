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
      assert.ok(entries.every(entry => entry.source === 'telerik-winforms-upgrade-plugin'));
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

test('Upgrade task outcomes are scoped and classified conservatively', {
  skip: process.platform !== 'win32',
}, () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'telerik-workflow-hook-test-'));
  try {
    const python = spawnSync('python', ['-c', 'import sys; print(sys.executable)'],
      { encoding: 'utf8' });
    assert.equal(python.status, 0, 'Python 3 is required for Bash workflow detection tests.');
    const pythonDirectory = path.dirname(python.stdout.trim());
    const bash = path.join(process.env.ProgramFiles, 'Git', 'bin', 'bash.exe');
    const scenario = 'telerik-winforms-version-upgrade';
    const block = `<skill name="${scenario}">instructions</skill>`;
    const modes = {
      success: { taskIds: ['001', '002'], failedTask: null, outcome: 'succeeded' },
      failure: { taskIds: ['001', '002'], failedTask: '001', outcome: 'completed_with_failures' },
      unknown: { taskIds: ['001'], failedTask: null, outcome: 'completed_unknown' },
    };

    for (const shell of ['powershell', 'bash']) {
      for (const [mode, expected] of Object.entries(modes)) {
        const output = path.join(directory, `${shell}-${mode}`);
        mkdirSync(output);
        const env = { ...process.env };
        for (const key of Object.keys(env)) {
          if (key.toLowerCase() === 'path') delete env[key];
        }
        Object.assign(env, {
          PATH: `${pythonDirectory};${testPath}`,
          APPDATA: output,
          PLUGIN_ROOT: pluginRoot,
          TELERIK_TELEMETRY_OFF: '0',
        });

        function invoke(hook, payload) {
          const args = shell === 'powershell'
            ? ['-NoProfile', '-NonInteractive', '-Command', hook.powershell]
            : ['-c', 'export PATH="/usr/bin:$PATH"; eval "$1"', '--', hook.bash];
          const result = spawnSync(shell === 'powershell' ? 'powershell.exe' : bash, args, {
            input: JSON.stringify({
              session_id: mode,
              timestamp: '2026-11-13T10:00:00Z',
              ...payload,
            }),
            encoding: 'utf8',
            env,
            timeout: 10000,
          });
          assert.ifError(result.error);
          assert.equal(result.status, 0, `${shell}/${mode}: ${result.stderr}`);
          assert.equal(result.stderr, '', `${shell}/${mode}`);
          assert.deepEqual(JSON.parse(result.stdout), { continue: true });
        }

        invoke(config.hooks.PostToolUse[0], {
          tool_name: 'Upgrade-get_instructions',
          tool_input: { kind: 'scenario', query: scenario },
          tool_result: { result_type: 'success', text_result_for_llm: block },
        });

        for (const taskId of expected.taskIds) {
          const finalTask = taskId === expected.taskIds.at(-1);
          invoke(config.hooks.PostToolUse[1], {
            tool_name: 'Upgrade-complete_task',
            tool_input: {
              taskId,
              filesModified: [],
              failed: taskId === expected.failedTask,
            },
            tool_result: {
              result_type: 'success',
              text_result_for_llm: finalTask
                ? JSON.stringify({ taskProgress: { allTasksComplete: true, totalTasks: 2 } })
                : 'Task status recorded.',
            },
          });
        }

        const log = path.join(output, 'Telerik', 'upgrade-plugin',
          `session-${mode}.jsonl`);
        const entries = readFileSync(log, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
        assert.ok(entries.every(entry => entry.source === 'telerik-winforms-upgrade-plugin'), shell);
        assert.equal(entries.filter(entry => entry.event === 'workflow_task_result').length,
          expected.taskIds.length, `${shell}/${mode}`);
        const outcomes = entries.filter(entry => entry.event === 'workflow_outcome');
        assert.equal(outcomes.length, 1, `${shell}/${mode}`);
        assert.equal(outcomes[0].scenario_id, scenario, `${shell}/${mode}`);
        assert.equal(outcomes[0].outcome, expected.outcome, `${shell}/${mode}`);
        assert.equal(outcomes[0].failed_tasks, expected.failedTask ? 1 : 0, `${shell}/${mode}`);
      }

      const stateOutput = path.join(directory, `${shell}-state-success`);
      mkdirSync(stateOutput);
      const stateEnv = { ...process.env };
      for (const key of Object.keys(stateEnv)) {
        if (key.toLowerCase() === 'path') delete stateEnv[key];
      }
      Object.assign(stateEnv, {
        PATH: `${pythonDirectory};${testPath}`,
        APPDATA: stateOutput,
        PLUGIN_ROOT: pluginRoot,
        TELERIK_TELEMETRY_OFF: '0',
      });
      const skillHook = config.hooks.PostToolUse[0];
      const workflowHook = config.hooks.PostToolUse[1];
      const statePayload = {
        session_id: 'state-success',
        timestamp: '2026-11-13T10:00:00Z',
      };
      const invokeStateHook = (hook, payload) => {
        const args = shell === 'powershell'
          ? ['-NoProfile', '-NonInteractive', '-Command', hook.powershell]
          : ['-c', 'export PATH="/usr/bin:$PATH"; eval "$1"', '--', hook.bash];
        const result = spawnSync(shell === 'powershell' ? 'powershell.exe' : bash, args, {
          input: JSON.stringify({ ...statePayload, ...payload }),
          encoding: 'utf8',
          env: stateEnv,
          timeout: 10000,
        });
        assert.ifError(result.error);
        assert.equal(result.status, 0, `${shell}/state-success: ${result.stderr}`);
        assert.equal(result.stderr, '');
        assert.deepEqual(JSON.parse(result.stdout), { continue: true });
      };
      invokeStateHook(skillHook, {
        tool_name: 'Upgrade-get_instructions',
        tool_input: { kind: 'scenario', query: scenario },
        tool_result: { result_type: 'success', text_result_for_llm: block },
      });
      invokeStateHook(workflowHook, {
        tool_name: 'Upgrade-get_state',
        tool_input: { path: 'C:\\private\\project' },
        tool_result: {
          result_type: 'success',
          text_result_for_llm: JSON.stringify({
            taskProgress: {
              allTasksComplete: true,
              tasks: [
                { taskId: '001', status: 'completed' },
                { taskId: '002', status: 'succeeded' },
              ],
            },
          }),
        },
      });
      const stateLog = path.join(stateOutput, 'Telerik', 'upgrade-plugin',
        'session-state-success.jsonl');
      const stateEntries = readFileSync(stateLog, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
      const stateOutcome = stateEntries.find(entry => entry.event === 'workflow_outcome');
      assert.equal(stateOutcome?.outcome, 'succeeded', `${shell}/state-success`);
      assert.ok(stateEntries.every(entry => !JSON.stringify(entry).includes('private')));

      const stateFailureOutput = path.join(directory, `${shell}-state-failure`);
      mkdirSync(stateFailureOutput);
      stateEnv.APPDATA = stateFailureOutput;
      statePayload.session_id = 'state-failure';
      invokeStateHook(skillHook, {
        tool_name: 'Upgrade-get_instructions',
        tool_input: { kind: 'scenario', query: scenario },
        tool_result: { result_type: 'success', text_result_for_llm: block },
      });
      invokeStateHook(workflowHook, {
        tool_name: 'Upgrade-get_state',
        tool_input: { path: 'C:\\private\\project' },
        tool_result: {
          result_type: 'success',
          text_result_for_llm: JSON.stringify({
            taskProgress: {
              allTasksComplete: true,
              tasks: [
                { taskId: '001', status: 'failed' },
                { taskId: '002', status: 'completed' },
              ],
            },
          }),
        },
      });
      const stateFailureLog = path.join(stateFailureOutput, 'Telerik', 'upgrade-plugin',
        'session-state-failure.jsonl');
      const stateFailureEntries = readFileSync(stateFailureLog, 'utf8')
        .trim().split(/\r?\n/).map(JSON.parse);
      const stateFailureOutcome = stateFailureEntries
        .find(entry => entry.event === 'workflow_outcome');
      assert.equal(stateFailureOutcome?.outcome, 'completed_with_failures',
        `${shell}/state-failure`);
    }

    assert.ok(new RegExp(config.hooks.PostToolUse[1].matcher).test('Upgrade/get_state'));
    assert.ok(new RegExp(config.hooks.PostToolUse[1].matcher).test('Upgrade-complete_task'));
    assert.ok(!new RegExp(config.hooks.PostToolUse[1].matcher).test('Unrelated/get_state'));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('telemetry forwarding respects opt-out, CLI support, and failure isolation', {
  skip: process.platform !== 'win32',
}, async () => {
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

    await test('direct reads and returned Upgrade MCP skills are both recorded', {
      skip: process.platform !== 'win32',
    }, () => {
      const directory = mkdtempSync(path.join(tmpdir(), 'telerik-mcp-hook-test-'));
      try {
        const python = spawnSync('python', ['-c', 'import sys; print(sys.executable)'],
          { encoding: 'utf8' });
        assert.equal(python.status, 0, 'Python 3 is required for Bash MCP detection tests.');
        const pythonDirectory = path.dirname(python.stdout.trim());
        const bash = path.join(process.env.ProgramFiles, 'Git', 'bin', 'bash.exe');
        const scenario = 'telerik-winforms-version-upgrade';
        const lazy = 'telerik-winforms-component-guidance';
        const extension = 'telerik-for-dotnet-version-upgrade';
        const block = id => `<skill name="${id}" path="not-a-local-path">instructions</skill>`;
        assert.ok(new RegExp(config.hooks.PostToolUse[0].matcher)
          .test('mcp__Upgrade__get_instructions'));
        assert.ok(new RegExp(config.hooks.PostToolUse[0].matcher)
          .test('Upgrade-get_instructions'));

        for (const shell of ['powershell', 'bash']) {
          const output = path.join(directory, shell);
          mkdirSync(output);
          const env = { ...process.env };
          for (const key of Object.keys(env)) {
            if (key.toLowerCase() === 'path') delete env[key];
          }
          Object.assign(env, {
            PATH: `${pythonDirectory};${testPath}`,
            APPDATA: output,
            PLUGIN_ROOT: pluginRoot,
            TELERIK_TELEMETRY_OFF: '0',
          });
          function invoke(payload) {
            const args = shell === 'powershell'
              ? ['-NoProfile', '-NonInteractive', '-Command', config.hooks.PostToolUse[0].powershell]
              : ['-c', 'export PATH="/usr/bin:$PATH"; eval "$1"', '--',
                config.hooks.PostToolUse[0].bash];
            const result = spawnSync(shell === 'powershell' ? 'powershell.exe' : bash, args, {
              input: JSON.stringify({
                session_id: 'mixed', timestamp: '2026-11-13T10:00:00Z', ...payload,
              }),
              encoding: 'utf8', env, timeout: 10000,
            });
            assert.ifError(result.error);
            assert.equal(result.status, 0, result.stderr);
            assert.equal(result.stderr, '');
            assert.deepEqual(JSON.parse(result.stdout), { continue: true });
          }
          for (const tool of ['read_file', 'view', 'Read']) {
            invoke({
              tool_name: tool,
              tool_input: { path: path.join(pluginRoot, 'upgrade', 'skills', 'lazy', lazy, 'SKILL.md') },
            });
          }
          invoke({
            tool_name: 'mcp__Upgrade__get_instructions',
            tool_input: { kind: 'scenario', query: scenario },
            tool_response: { content: [{ type: 'text', text: block(scenario) }] },
          });
          invoke({
            toolName: 'Upgrade/get_instructions',
            toolArgs: JSON.stringify({ kind: 'skill', query: 'guidance' }),
            toolResult: { result: { content: [
              { type: 'text', text: block(lazy) + block(extension) + block(lazy) },
              { type: 'text', text: block('building-projects') + block('telerik-wpf-version-upgrade') },
            ] } },
          });
          invoke({
            tool_name: 'mcp_Upgrade_get_instructions',
            tool_response: JSON.stringify({ value: block(scenario) }),
          });
          invoke({
            hook_event_name: 'PostToolUse',
            tool_name: 'Upgrade-get_instructions',
            tool_input: { kind: 'skill', query: 'telerik-winforms-license-detection' },
            tool_result: {
              result_type: 'success',
              text_result_for_llm: block('telerik-winforms-license-detection'),
            },
          });
          invoke({
            tool_name: 'Upgrade/get_instructions',
            tool_response: { isError: true, content: [{ text: block(scenario) }] },
          });
          invoke({
            tool_name: 'Upgrade/get_instructions',
            tool_input: { kind: 'scenario', query: scenario },
            tool_response: 'No matching instructions.',
          });
          invoke({
            tool_name: 'Unrelated/get_instructions',
            tool_response: block(scenario),
          });
          const entries = readFileSync(path.join(output, 'Telerik', 'upgrade-plugin',
            'session-mixed.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
          assert.ok(entries.every(entry => entry.source === 'telerik-winforms-upgrade-plugin'), shell);
          assert.deepEqual(entries.map(entry => [entry.skill_id, entry.discovery]), [
            [lazy, 'lazy'], [lazy, 'lazy'], [lazy, 'lazy'],
            [scenario, 'scenario'], [lazy, 'lazy'],
            [extension, 'scenarioExtension'], [scenario, 'scenario'],
            ['telerik-winforms-license-detection', 'lazy'],
          ], shell);
        }
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
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
          assert.ok(lines.every(line => JSON.parse(line).source === 'telerik-winforms-upgrade-plugin'));
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
