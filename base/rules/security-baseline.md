# Security Baseline

These rules are non-negotiable. They apply to every file in every language. No exceptions for prototypes, spikes, or "just testing."

## Secrets

- **No hardcoded secrets in source code** — API keys, tokens, passwords, private keys, connection strings with credentials
- **Secrets go in environment variables** or a secret manager — never in code, config files, or comments
- **If a secret is committed, rotate it immediately** — it is compromised. Removing it from code is not enough; it remains in git history.
- **.env files must be gitignored** — `.env`, `.env.*`, `credentials.json`, `*.key`, `*.pem`

## Input Validation

- **Validate all external input at system boundaries** — user input, API responses, file contents, environment variables, CLI arguments
- **Validate type, range, format, and content** — not just one dimension
- **Reject by default** — allowlist what's valid, don't blocklist what's invalid

## Injection

- **Use parameterized queries for all database access** — no string concatenation with user input. No exceptions.
- **Use array-form subprocess calls** — never `shell=True` (Python), `exec(string)` (Node), or `system()` (C) with user input
- **Escape user content before rendering in HTML** — use framework-provided escaping. Never `innerHTML` with user data.

## eval() and Dynamic Execution

- **No eval() in any language** — JavaScript `eval()`, Python `eval()`/`exec()`, Ruby `eval()`
- **No `new Function()`** in JavaScript
- **No `setTimeout`/`setInterval` with string arguments** in JavaScript
- If you think you need `eval()`, use `JSON.parse()` for data or a proper parser for expressions.

## Memory Safety (C/Rust)

- **Banned C functions:** `gets()`, `strcpy()`, `sprintf()`, `scanf()` without width limit, `strcat()`
- **Use bounded alternatives:** `fgets()`, `strncpy()`/`strlcpy()`, `snprintf()`, `strncat()`
- **Every malloc needs:** a null check and a corresponding `free()` on every code path
- **Every buffer needs:** explicit size tracking
- **Rust unsafe blocks need:** a `// SAFETY:` comment explaining the invariant

## Dependencies

- **Pin dependencies** — commit lock files (`package-lock.json`, `Cargo.lock`, `poetry.lock`)
- **No floating versions in production** — exact pins or lock files
- **Review new dependencies before adding** — check maintenance, vulnerabilities, license, size
- **Minimize dependency count** — every dependency is attack surface

## Destructive Operations

- **No `rm -rf` without explicit paths** — never `rm -rf /`, `rm -rf *`, or unqualified `rm -rf`
- **No `DROP TABLE` without `IF EXISTS`**
- **No direct writes to production databases** without explicit safeguards
- **No disabling SSL verification** in production code
- **No CORS `*`** in production — specify allowed origins
