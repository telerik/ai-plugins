"""Extract conservative Upgrade Agent task and workflow outcomes from hook events."""

import json
import os
import re
import sys
from pathlib import Path


SCENARIOS = (
    "telerik-winforms-version-upgrade",
    "telerik-winforms-control-conversion",
    "telerik-winforms-assembly-to-nuget",
    "telerik-winforms-licensing",
    "telerik-for-dotnet-version-upgrade",
    "telerik-for-dotnet-framework-upgrade",
)


def decode(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def objects(value):
    value = decode(value)
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


def response_text(value):
    value = decode(value)
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict) and not value.get("isError"):
        for key in ("content", "text", "value", "result", "text_result_for_llm",
                    "structuredContent"):
            if key in value:
                yield from response_text(value[key])
    elif isinstance(value, list):
        for child in value:
            yield from response_text(child)


def get_tool_input(event):
    for key in ("tool_input", "toolArgs"):
        if key in event:
            value = decode(event[key])
            if isinstance(value, dict):
                return value
    return {}


def get_response(event):
    for key in ("tool_response", "toolResult", "tool_result"):
        if key in event:
            return decode(event[key])
    return None


def bool_value(value):
    return value is True or (isinstance(value, str) and value.lower() == "true")


def find_scenario(text, log_file):
    response_scenarios = [scenario for scenario in SCENARIOS if scenario in text]
    if len(response_scenarios) == 1:
        return response_scenarios[0]
    try:
        lines = Path(log_file).read_text(encoding="utf-8-sig").splitlines()
        for line in reversed(lines):
            entry = json.loads(line)
            skill_id = entry.get("skill_id")
            if entry.get("event") == "skill_read" and skill_id in SCENARIOS:
                return skill_id
    except (OSError, ValueError):
        pass
    return None


def parse():
    event = json.load(sys.stdin)
    tool_name = str(event.get("tool_name") or event.get("toolName") or "")
    tool_input = get_tool_input(event)
    response = get_response(event)
    text = "\n".join(response_text(response))
    scenario_id = find_scenario(text, os.environ["TELEMETRY_LOG_FILE"])
    if not scenario_id:
        return []

    session_id = str(event.get("session_id") or event.get("sessionId") or "unknown")
    timestamp = str(event.get("timestamp") or "")
    records = []
    task_id = tool_input.get("taskId") or tool_input.get("task_id")
    is_complete_task = bool(re.search(r"(?i)upgrade.*[/_.:-]complete_task$", tool_name))

    if is_complete_task and task_id is not None:
        task_record = {
            "event": "workflow_task_result",
            "timestamp": timestamp,
            "session_id": session_id,
            "scenario_id": scenario_id,
            "task_id": str(task_id),
            "failed": bool_value(tool_input.get("failed")),
        }
        records.append(task_record)

    all_complete = any(
        bool_value(obj.get("allTasksComplete"))
        for obj in objects(response)
    ) or bool(re.search(r"""(?i)["']?allTasksComplete["']?\s*:\s*["']?true\b""", text))
    if not all_complete:
        return records

    task_results = {}
    try:
        lines = Path(os.environ["TELEMETRY_LOG_FILE"]).read_text(
            encoding="utf-8-sig").splitlines()
        last_outcome = max(
            (index for index, line in enumerate(lines)
             if (json.loads(line).get("event") == "workflow_outcome"
                 and json.loads(line).get("scenario_id") == scenario_id)),
            default=-1,
        )
        for line in lines[last_outcome + 1:]:
            previous = json.loads(line)
            if (previous.get("event") == "workflow_task_result"
                    and previous.get("scenario_id") == scenario_id
                    and previous.get("task_id")):
                task_results[previous["task_id"]] = bool(previous.get("failed"))
    except (OSError, ValueError):
        pass
    if is_complete_task and task_id is not None:
        task_results[str(task_id)] = bool_value(tool_input.get("failed"))

    failed_count = sum(task_results.values())
    task_snapshots = []
    full_task_snapshot = None
    total_tasks = None
    reported_failed_count = None
    for obj in objects(response):
        if total_tasks is None:
            for key in ("totalTasks", "totalTaskCount", "taskCount"):
                value = obj.get(key)
                if isinstance(value, int) and not isinstance(value, bool):
                    total_tasks = value
                    break
        if reported_failed_count is None:
            value = obj.get("failedTasks")
            if isinstance(value, int) and not isinstance(value, bool):
                reported_failed_count = value
            elif isinstance(value, list):
                reported_failed_count = len(value)
        for key in ("tasks", "allTasks"):
            value = obj.get(key)
            if isinstance(value, list) and value and all(
                    isinstance(item, dict)
                    and (item.get("taskId") or item.get("task_id") or item.get("id")) is not None
                    and (item.get("status") is not None or "failed" in item)
                    for item in value):
                full_task_snapshot = value
                break
        task_key = obj.get("taskId") or obj.get("task_id") or obj.get("id")
        status = obj.get("status")
        if task_key is not None and (status is not None or "failed" in obj):
            task_snapshots.append((str(task_key), bool_value(obj.get("failed")), status))
        if (bool_value(obj.get("failed"))
                or str(status).lower() in {"failed", "blocked", "abandoned"}):
            failed_count = max(failed_count, 1)

    if reported_failed_count is not None:
        failed_count = max(failed_count, reported_failed_count)
    if any(failed or str(status).lower() in {"failed", "blocked", "abandoned"}
           for _, failed, status in task_snapshots):
        failed_count = max(failed_count, 1)

    if failed_count:
        outcome = "completed_with_failures"
    elif reported_failed_count == 0:
        outcome = "succeeded"
    elif full_task_snapshot and all(
            not bool_value(item.get("failed"))
            and (item.get("status") is None
                 or str(item.get("status")).lower() in {"complete", "completed", "succeeded"})
            for item in full_task_snapshot):
        outcome = "succeeded"
        total_tasks = len(full_task_snapshot)
    elif total_tasks is not None and len(task_results) >= total_tasks:
        outcome = "succeeded"
    else:
        outcome = "completed_unknown"

    log_file = Path(os.environ["TELEMETRY_LOG_FILE"])
    try:
        lines = log_file.read_text(encoding="utf-8-sig").splitlines()
        latest_outcome = None
        latest_outcome_index = -1
        for index, line in enumerate(lines):
            previous = json.loads(line)
            if (previous.get("event") == "workflow_outcome"
                    and previous.get("scenario_id") == scenario_id):
                latest_outcome = previous
                latest_outcome_index = index
        new_task_observed = is_complete_task and task_id is not None
        new_task_observed = new_task_observed or any(
            json.loads(line).get("event") == "workflow_task_result"
            and json.loads(line).get("scenario_id") == scenario_id
            for line in lines[latest_outcome_index + 1:]
        )
        if latest_outcome and not new_task_observed:
            if (latest_outcome.get("outcome") != "completed_unknown"
                    or latest_outcome.get("outcome") == outcome):
                return records
    except (OSError, ValueError):
        pass

    records.append({
        "event": "workflow_outcome",
        "timestamp": timestamp,
        "session_id": session_id,
        "scenario_id": scenario_id,
        "outcome": outcome,
        "total_tasks": total_tasks,
        "observed_tasks": len(task_results) or len(task_snapshots),
        "failed_tasks": failed_count,
        "status_source": "get_state" if "get_state" in tool_name.lower() else "complete_task",
    })
    return records


def main():
    for record in parse():
        record["source"] = "telerik-winforms-upgrade-plugin"
        print(json.dumps(record, separators=(",", ":")))


if __name__ == "__main__":
    try:
        main()
    except (OSError, TypeError, ValueError, KeyError) as error:
        print(f"Telerik workflow outcome detection failed: {error}", file=sys.stderr)
        sys.exit(1)
