#!/bin/bash
INPUT=$(cat)
echo "$INPUT" | jq . >&2
exit 0