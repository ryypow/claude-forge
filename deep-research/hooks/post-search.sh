#!/usr/bin/env bash
set -euo pipefail

# post-search — deep-research domain
#
# Logs search statistics after source-searcher completes a search pass.
# Informational only — never blocks.
#
# Fires after:
#   - Bash tool calls that look like arXiv API or Semantic Scholar searches
#
# Logs (to stderr):
#   - Source name, raw result count, duplicates removed, candidates retained
#
# Exit 0 always.

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
TOOL_OUTPUT="${CLAUDE_TOOL_OUTPUT:-}"

if [[ -z "$TOOL_INPUT" ]]; then
  TOOL_INPUT=$(cat)
fi

case "$TOOL_NAME" in
  Bash|bash)
    COMMAND=$(echo "$TOOL_INPUT" | grep -o '"command":"[^"]*"' | cut -d'"' -f4 || true)

    if echo "$COMMAND" | grep -qiE "(arxiv.org/api|semanticscholar.org|search_query)" 2>/dev/null; then
      TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      SOURCE="unknown"

      if echo "$COMMAND" | grep -qiE "arxiv.org" 2>/dev/null; then
        SOURCE="arxiv"
      elif echo "$COMMAND" | grep -qiE "semanticscholar" 2>/dev/null; then
        SOURCE="semantic-scholar"
      elif echo "$COMMAND" | grep -qiE "brave" 2>/dev/null; then
        SOURCE="brave-search"
      fi

      echo "[post-search] ${TIMESTAMP} | source: ${SOURCE} | search complete" >&2
    fi
    ;;
esac

exit 0
