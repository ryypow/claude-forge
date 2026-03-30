#!/usr/bin/env bash
set -euo pipefail

# pre-store — deep-research domain
#
# Guards against storing incomplete paper records in Neo4j or pgvector.
# Fires before any Bash tool call that writes to the knowledge graph.
#
# Guards against:
#   - Missing required fields: title, source_url, abstract
#   - Storing a paper from title alone (no fetched content)
#
# Allows:
#   - Writes that include all required fields
#   - Non-graph Bash operations (git, node, curl for external fetching)
#
# Input: CLAUDE_TOOL_NAME and CLAUDE_TOOL_INPUT env vars, or stdin JSON
# Exit 0 = allow. Exit 1 = block.

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

if [[ -z "$TOOL_NAME" ]]; then
  TOOL_NAME=$(echo "$TOOL_INPUT" | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4 || true)
fi

if [[ -z "$TOOL_INPUT" ]]; then
  TOOL_INPUT=$(cat)
fi

case "$TOOL_NAME" in
  Bash|bash)
    COMMAND=$(echo "$TOOL_INPUT" | grep -o '"command":"[^"]*"' | cut -d'"' -f4 || true)

    # Only inspect commands that look like graph writes
    if ! echo "$COMMAND" | grep -qiE "(neo4j|cypher|MERGE|CREATE|pgvector|INSERT INTO paper)" 2>/dev/null; then
      exit 0
    fi

    # Check for title field presence
    if echo "$COMMAND" | grep -qiE "(MERGE|CREATE).*Paper" 2>/dev/null; then
      if ! echo "$COMMAND" | grep -qE '"title"' 2>/dev/null; then
        echo "BLOCKED: Attempted to store a Paper node without a 'title' field." >&2
        echo "  All Paper nodes require: title, source_url, abstract" >&2
        echo "  Ensure paper-analyzer has fully analyzed this paper before storing." >&2
        exit 1
      fi

      if ! echo "$COMMAND" | grep -qE '"source_url"' 2>/dev/null; then
        echo "BLOCKED: Attempted to store a Paper node without a 'source_url' field." >&2
        echo "  source_url must be the URL the paper was actually fetched from." >&2
        echo "  Do not store papers that could not be fetched." >&2
        exit 1
      fi

      if ! echo "$COMMAND" | grep -qE '"abstract"' 2>/dev/null; then
        echo "BLOCKED: Attempted to store a Paper node without an 'abstract' field." >&2
        echo "  Fetch and analyze the paper before storing it." >&2
        exit 1
      fi
    fi

    # Check pgvector inserts for required fields
    if echo "$COMMAND" | grep -qiE "INSERT INTO paper_embeddings" 2>/dev/null; then
      if ! echo "$COMMAND" | grep -qE "paper_id" 2>/dev/null; then
        echo "BLOCKED: pgvector insert missing paper_id." >&2
        exit 1
      fi
    fi
    ;;
esac

exit 0
