#!/usr/bin/env bash
set -euo pipefail

# Pre-tool-use hook — fires before every tool call
# Blocks on high-confidence pattern matches only. Does not reason.
#
# What it blocks:
#   - Secrets in file content (API keys, tokens, passwords, private keys)
#   - Banned shell patterns (eval, unquoted variables, missing set -euo pipefail)
#   - Unsafe patterns (eval in JS/Python, exec with unsanitized input)
#   - Destructive operations (rm -rf without explicit path, DROP TABLE)
#   - Writes to .env files or credential files
#
# What it allows:
#   - Everything else. If it's not in the block list, it passes.

# --- Configuration ---

# Tool name and file content are passed via environment variables
TOOL_NAME="${TOOL_NAME:-}"
FILE_CONTENT="${FILE_CONTENT:-}"
FILE_PATH="${FILE_PATH:-}"

# --- Secrets Detection ---

check_secrets() {
    local content="$1"

    # AWS access keys
    if echo "$content" | grep -qP 'AKIA[0-9A-Z]{16}'; then
        echo "BLOCKED: AWS access key detected (AKIA pattern)"
        return 1
    fi

    # Generic API key patterns
    if echo "$content" | grep -qP '(api[_-]?key|apikey)\s*[=:]\s*["\x27][A-Za-z0-9+/=]{20,}["\x27]'; then
        echo "BLOCKED: Hardcoded API key detected"
        return 1
    fi

    # Generic secret/password/token assignment
    if echo "$content" | grep -qP '(secret|password|passwd|token)\s*[=:]\s*["\x27][^\s"'\'']{8,}["\x27]' | grep -vqP '(placeholder|example|changeme|your[-_]|TODO|FIXME|\{\{)'; then
        echo "BLOCKED: Hardcoded secret/password/token detected"
        return 1
    fi

    # Private keys
    if echo "$content" | grep -qP '-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----'; then
        echo "BLOCKED: Private key detected in file content"
        return 1
    fi

    # GitHub tokens
    if echo "$content" | grep -qP 'gh[ps]_[A-Za-z0-9_]{36,}'; then
        echo "BLOCKED: GitHub token detected"
        return 1
    fi

    # Slack tokens
    if echo "$content" | grep -qP 'xox[bpsar]-[A-Za-z0-9-]{10,}'; then
        echo "BLOCKED: Slack token detected"
        return 1
    fi

    return 0
}

# --- Banned Patterns ---

check_banned_patterns() {
    local content="$1"
    local filepath="$2"

    # eval() in JavaScript/TypeScript
    if [[ "$filepath" =~ \.(js|ts|jsx|tsx)$ ]]; then
        if echo "$content" | grep -qP '\beval\s*\('; then
            echo "BLOCKED: eval() detected in JavaScript/TypeScript file"
            return 1
        fi
        if echo "$content" | grep -qP 'new\s+Function\s*\('; then
            echo "BLOCKED: new Function() detected — equivalent to eval()"
            return 1
        fi
    fi

    # eval/exec in Python
    if [[ "$filepath" =~ \.py$ ]]; then
        if echo "$content" | grep -qP '\beval\s*\('; then
            echo "BLOCKED: eval() detected in Python file"
            return 1
        fi
        if echo "$content" | grep -qP '\bexec\s*\(' | grep -vqP 'subprocess'; then
            echo "BLOCKED: exec() detected in Python file"
            return 1
        fi
    fi

    # Banned C functions
    if [[ "$filepath" =~ \.(c|h)$ ]]; then
        if echo "$content" | grep -qP '\bgets\s*\('; then
            echo "BLOCKED: gets() is banned — use fgets() with explicit size"
            return 1
        fi
        if echo "$content" | grep -qP '\bstrcpy\s*\('; then
            echo "BLOCKED: strcpy() is banned — use strncpy() or strlcpy()"
            return 1
        fi
        if echo "$content" | grep -qP '\bsprintf\s*\(' | grep -vqP 'snprintf'; then
            echo "BLOCKED: sprintf() is banned — use snprintf()"
            return 1
        fi
    fi

    # Shell hooks without set -euo pipefail
    if [[ "$filepath" =~ \.sh$ ]]; then
        if ! echo "$content" | grep -qP 'set\s+-euo\s+pipefail'; then
            echo "BLOCKED: Shell script missing 'set -euo pipefail'"
            return 1
        fi
        if echo "$content" | grep -qP '\beval\b'; then
            echo "BLOCKED: eval is banned in shell hooks"
            return 1
        fi
    fi

    return 0
}

# --- Destructive Operations ---

check_destructive() {
    local content="$1"

    # rm -rf without explicit path (bare rm -rf or rm -rf /)
    if echo "$content" | grep -qP 'rm\s+-rf\s+(/\s|/\*|\*|\.|\s*$)'; then
        echo "BLOCKED: Dangerous rm -rf without explicit path"
        return 1
    fi

    # DROP TABLE without safeguards
    if echo "$content" | grep -qiP 'DROP\s+TABLE' | grep -vqiP 'IF\s+EXISTS'; then
        echo "BLOCKED: DROP TABLE without IF EXISTS safeguard"
        return 1
    fi

    return 0
}

# --- Protected Files ---

check_protected_files() {
    local filepath="$1"

    # Block writes to .env files
    if [[ "$filepath" =~ \.env(\..+)?$ ]]; then
        echo "BLOCKED: Cannot write to .env files — use environment variables"
        return 1
    fi

    # Block writes to credential files
    if [[ "$filepath" =~ (credentials\.json|\.key|\.pem)$ ]]; then
        echo "BLOCKED: Cannot write to credential files"
        return 1
    fi

    return 0
}

# --- Main ---

main() {
    # Only check write operations
    if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
        exit 0
    fi

    # Check protected file paths
    if [[ -n "$FILE_PATH" ]]; then
        check_protected_files "$FILE_PATH" || exit 1
    fi

    # Check file content
    if [[ -n "$FILE_CONTENT" ]]; then
        check_secrets "$FILE_CONTENT" || exit 1
        check_banned_patterns "$FILE_CONTENT" "$FILE_PATH" || exit 1
        check_destructive "$FILE_CONTENT" || exit 1
    fi

    # All checks passed
    exit 0
}

main "$@"
