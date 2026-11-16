"""Extract actually returned skills belonging to this plugin from a hook event."""

import json
from pathlib import Path
import re
import sys


def response_text(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from response_text(item)
    elif isinstance(value, dict) and not value.get("isError"):
        for key in ("content", "text", "value", "result", "text_result_for_llm"):
            yield from response_text(value.get(key))


def main():
    event = json.load(sys.stdin)
    response = next(
        (event[key] for key in ("tool_response", "toolResult", "tool_result") if key in event),
        None,
    )
    if isinstance(response, str) and response.lstrip().startswith("{"):
        response = json.loads(response)
    text = "\n".join(response_text(response))
    if not text:
        return
    root = Path(__file__).resolve().parents[2] / "upgrade" / "skills"
    catalog = {}
    for file in root.rglob("SKILL.md"):
        content = file.read_text(encoding="utf-8-sig")
        frontmatter = re.match(r"\A---\s*(.*?)\s*---", content, re.S)
        if frontmatter:
            fields = {}
            for key in ("name", "discovery"):
                field = re.search(r"^\s*" + key + r"\s*:\s*([^#\r\n]+)",
                                  frontmatter[1], re.M)
                if field:
                    fields[key] = field[1].strip().strip("\"'")
            if fields.get("name") and fields.get("discovery"):
                catalog[fields["name"]] = fields["discovery"]
    seen = set()
    for match in re.finditer(
        r"""<skill\b[^>]*\bname\s*=\s*["']([^"']+)["'][^>]*>.*?</skill>""",
        text, re.S,
    ):
        skill_id = match[1]
        if skill_id in catalog and skill_id not in seen:
            seen.add(skill_id)
            print(skill_id + "\t" + catalog[skill_id])


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, TypeError) as error:
        print(f"Telerik MCP skill detection failed: {error}", file=sys.stderr)
        sys.exit(1)
