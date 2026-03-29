#!/usr/bin/env bash
set -euo pipefail

# pre-tool-use.sh — claude-templates repo tooling layer
#
# Guards against:
#   - Secret patterns in files being written (API keys, tokens, private keys)
#   - eval or unquoted variables in hook files being written
#   - Missing set -euo pipefail in new shell scripts under hooks/
#   - Writes to .env files or credential files (*.key, *.pem, *.p12, *.secret)
#   - rm -rf without an explicit safe path (blocks rm -rf / and rm -rf *)
#
# Allows:
#   - All other tool calls pass through without intervention
#   - This hook does NOT block C-specific patterns (gets, strcpy, etc.) —
#     that is the embedded domain's override hook, not needed here.
#
# Input: Claude Code passes tool name and parameters as JSON via stdin.
# Exit 0 = allow. Exit 1 = block (message printed to stderr).

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

# Read from stdin if env vars not set (fallback for direct invocation)
if [[ -z "$TOOL_INPUT" ]]; then
  TOOL_INPUT=$(cat)
fi

# Extract tool name from JSON input if not in env
if [[ -z "$TOOL_NAME" ]]; then
  TOOL_NAME=$(echo "$TOOL_INPUT" | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4 || true)
fi

# ── Only inspect Write, Edit, and Bash tool calls ────────────────────────────

case "$TOOL_NAME" in
  Write|Edit|write|edit)
    FILE_PATH=$(echo "$TOOL_INPUT" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4 || true)
    CONTENT=$(echo "$TOOL_INPUT" | grep -o '"content":"[^"]*"' | cut -d'"' -f4 || true)
    NEW_STRING=$(echo "$TOOL_INPUT" | grep -o '"new_string":"[^"]*"' | cut -d'"' -f4 || true)
    TEXT="${CONTENT}${NEW_STRING}"

    # ── Block 1: Writes to credential files ──────────────────────────────────
    if [[ -n "$FILE_PATH" ]]; then
      case "$FILE_PATH" in
        *.env|.env|*.key|*.pem|*.p12|*.secret|*credentials*|*secrets*)
          echo "BLOCKED: Attempt to write to a credential file: ${FILE_PATH}" >&2
          echo "  Store secrets in environment variables, not tracked files." >&2
          exit 1
          ;;
      esac
    fi

    # ── Block 2: Secret patterns in content ──────────────────────────────────
    # Matches common API key prefixes and private key headers.
    # This is pattern matching only — it does not reason about context.
    SECRET_PATTERNS=(
      'sk-[A-Za-z0-9]{20,}'          # OpenAI / Anthropic style keys
      'ghp_[A-Za-z0-9]{36}'          # GitHub personal access tokens
      'ghs_[A-Za-z0-9]{36}'          # GitHub app tokens
      'AKIA[0-9A-Z]{16}'             # AWS access key IDs
      '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY'  # Private key headers
      'password\s*=\s*["\x27][^"\x27]{4,}'          # password="literal"
      'token\s*=\s*["\x27][^"\x27]{8,}'             # token="literal"
      'secret\s*=\s*["\x27][^"\x27]{8,}'            # secret="literal"
    )

    for pattern in "${SECRET_PATTERNS[@]}"; do
      if echo "$TEXT" | grep -qE "$pattern" 2>/dev/null; then
        echo "BLOCKED: Potential secret detected in content being written to: ${FILE_PATH:-unknown}" >&2
        echo "  Pattern matched: ${pattern}" >&2
        echo "  Use environment variable references instead of literal values." >&2
        exit 1
      fi
    done

    # ── Block 3: Hook files missing set -euo pipefail ────────────────────────
    if [[ -n "$FILE_PATH" ]]; then
      case "$FILE_PATH" in
        */hooks/*.sh|*/.claude/hooks/*.sh)
          if ! echo "$TEXT" | grep -q 'set -euo pipefail'; then
            echo "BLOCKED: Shell hook file is missing 'set -euo pipefail': ${FILE_PATH}" >&2
            echo "  All shell hooks must start with: set -euo pipefail" >&2
            exit 1
          fi
          ;;
      esac
    fi

    # ── Block 4: eval in hook files ──────────────────────────────────────────
    if [[ -n "$FILE_PATH" ]]; then
      case "$FILE_PATH" in
        */hooks/*.sh|*/hooks/*.js|*/.claude/hooks/*)
          if echo "$TEXT" | grep -qE '^\s*eval\s'; then
            echo "BLOCKED: 'eval' detected in hook file: ${FILE_PATH}" >&2
            echo "  Hook files must not use eval — it bypasses all input validation." >&2
            exit 1
          fi
          ;;
      esac
    fi
    ;;

  Bash|bash)
    COMMAND=$(echo "$TOOL_INPUT" | grep -o '"command":"[^"]*"' | cut -d'"' -f4 || true)

    # ── Block 5: rm -rf without explicit safe path ────────────────────────────
    # Blocks: rm -rf /, rm -rf *, rm -rf with no path, rm -rf ~
    # Allows: rm -rf /explicit/absolute/path/to/specific/dir
    if echo "$COMMAND" | grep -qE 'rm\s+-rf?\s*(\/\s*$|\*|~|$)'; then
      echo "BLOCKED: Dangerous rm -rf pattern detected." >&2
      echo "  Command: ${COMMAND}" >&2
      echo "  Use rm -rf with an explicit, specific path only." >&2
      exit 1
    fi

    # Also block rm -rf / even with trailing content (root deletion)
    if echo "$COMMAND" | grep -qE 'rm\s+-rf?\s+/\s'; then
      echo "BLOCKED: rm -rf / detected — this would delete the filesystem root." >&2
      exit 1
    fi
    ;;
esac

# All checks passed — allow the tool call
exit 0
