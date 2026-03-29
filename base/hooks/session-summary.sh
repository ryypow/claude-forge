#!/usr/bin/env bash
set -euo pipefail

# Session summary hook — appends a one-line entry to .claude/session-log.md
# Runs at the end of a session or when explicitly triggered.
#
# Format: YYYY-MM-DD | branch | summary | files changed
#
# This hook reads git state to produce the summary. It does not
# require any arguments — it infers everything from the repo.

# --- Configuration ---

LOG_FILE=".claude/session-log.md"
DATE=$(date +%Y-%m-%d)

# --- Gather State ---

# Current branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "detached")

# Files changed (staged + unstaged + committed today)
COMMITTED_TODAY=$(git log --since="midnight" --pretty=format: --name-only 2>/dev/null | sort -u | grep -c '.' || echo "0")
UNCOMMITTED=$(git status --porcelain 2>/dev/null | grep -c '.' || echo "0")
TOTAL_FILES=$((COMMITTED_TODAY + UNCOMMITTED))

# Most recent commit message (if any commits today)
LAST_COMMIT=$(git log --since="midnight" --oneline -1 2>/dev/null || echo "no commits today")

# --- Write Entry ---

# Create log file with header if it doesn't exist
if [[ ! -f "$LOG_FILE" ]]; then
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "# Session Log" > "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    echo "| Date | Branch | Summary | Files |" >> "$LOG_FILE"
    echo "|---|---|---|---|" >> "$LOG_FILE"
fi

# Append entry
echo "| ${DATE} | ${BRANCH} | ${LAST_COMMIT} | ${TOTAL_FILES} changed |" >> "$LOG_FILE"

echo "Session logged to ${LOG_FILE}"
