---
name: security-hygiene
description: Baseline security rules across Python, TypeScript, Rust, and C — secrets management, input validation, safe memory patterns, and dependency hygiene
domain: base
triggers:
  - security
  - secrets
  - credentials
  - API key
  - injection
  - SQL injection
  - XSS
  - cross-site scripting
  - input validation
  - sanitize input
  - memory safety
  - buffer overflow
  - eval
  - hardcoded password
  - dependency vulnerability
  - supply chain
  - OWASP
---

## Overview

This skill covers the non-negotiable security rules that apply to every project regardless of domain. These are not aspirational guidelines — they are minimum standards that prevent the most common categories of security incidents.

---

## Secrets Management

### Rule: No secrets in source code. Ever.

Secrets include: API keys, tokens, passwords, private keys, connection strings with credentials, webhook URLs with auth tokens.

**Where secrets go:**
- Environment variables (loaded via `.env` files that are gitignored)
- Secret managers (AWS Secrets Manager, Vault, GCP Secret Manager)
- CI/CD secret stores (GitHub Actions secrets, GitLab CI variables)

**How to detect:**
- High-entropy strings (base64, hex) longer than 20 characters
- Patterns: `sk-`, `pk_`, `ghp_`, `AKIA`, `-----BEGIN`, `Bearer `
- Variable names containing: `key`, `token`, `secret`, `password`, `credential`, `auth`

**If a secret is committed:**
1. Rotate the secret immediately — assume it is compromised
2. Remove it from the code and commit the removal
3. The secret remains in git history even after removal — rotation is mandatory

---

## Input Validation

### Rule: Validate all external input at system boundaries.

External input includes: user form data, query parameters, request bodies, file uploads, API responses from third parties, environment variables, command-line arguments, file contents.

**Validation strategy:**

| Language | Approach |
|---|---|
| Python | Pydantic models, dataclasses with validation, manual type checks |
| TypeScript | Zod schemas, io-ts, manual validation functions |
| Rust | Type system + serde deserialization with validation |
| C | Manual bounds checking on every buffer, null checks on every pointer |

**What to validate:**
- Type: is it the expected type?
- Range: is it within acceptable bounds? (string length, number range, date range)
- Format: does it match the expected pattern? (email, URL, UUID)
- Content: does it contain disallowed characters? (SQL metacharacters, script tags)

---

## Injection Prevention

### SQL Injection

**Never do this:**
```python
query = f"SELECT * FROM users WHERE id = {user_input}"
```

**Always do this:**
```python
cursor.execute("SELECT * FROM users WHERE id = %s", (user_input,))
```

Use parameterized queries in every language. No exceptions. ORMs handle this automatically — raw queries need manual parameterization.

### Command Injection

**Never do this:**
```python
os.system(f"convert {filename} output.png")
```

**Always do this:**
```python
subprocess.run(["convert", filename, "output.png"], shell=False)
```

Never pass user input to `shell=True`, `exec`, `eval`, or `system()`. Use array-form subprocess calls that don't invoke a shell.

### XSS (Cross-Site Scripting)

- Escape all user-generated content before rendering in HTML
- Use framework-provided escaping (React's JSX auto-escapes, Django's template engine auto-escapes)
- Never use `innerHTML`, `dangerouslySetInnerHTML`, or `v-html` with user input
- Content-Security-Policy headers as defense in depth

---

## Memory Safety (C/Rust)

### C — Banned Functions

These functions are banned because they have no bounds checking:

| Banned | Safe Alternative |
|---|---|
| `gets()` | `fgets(buf, size, stdin)` |
| `strcpy()` | `strncpy()` or `strlcpy()` |
| `sprintf()` | `snprintf()` |
| `scanf("%s")` | `scanf("%Ns")` with width limit |
| `strcat()` | `strncat()` |

### C — Required Patterns

- Every `malloc()` must have a null check and a corresponding `free()` on every code path
- Every buffer must have explicit size tracking — no "just assume it's big enough"
- All array accesses must be bounds-checked
- All string operations must use bounded variants

### Rust — Required Patterns

- `unsafe` blocks must have a `// SAFETY:` comment explaining the invariant that makes this safe
- No `unwrap()` in library code — use `?` operator or explicit error handling
- Prefer `clippy::pedantic` lint level

---

## Dependency Hygiene

### Rules

- **Pin dependencies** — use lock files (`package-lock.json`, `Cargo.lock`, `poetry.lock`, `requirements.txt` with pinned versions). Commit lock files.
- **No floating versions in production** — `"express": "^4.18"` is a floating version. Pin to exact: `"express": "4.18.2"` or rely on the lock file.
- **Review new dependencies** — before adding a dependency, check: active maintenance, known vulnerabilities, license compatibility, size/footprint.
- **Minimize dependency count** — every dependency is an attack surface. If you can do it in 10 lines of code, don't add a package.

---

## eval() and Dynamic Execution

### Rule: No eval() in any language. No exceptions.

| Language | Banned | Why |
|---|---|---|
| JavaScript | `eval()`, `new Function()`, `setTimeout(string)` | Arbitrary code execution |
| Python | `eval()`, `exec()`, `compile()` with user input | Arbitrary code execution |
| Ruby | `eval()`, `send()` with user input | Arbitrary code execution |

If you think you need `eval()`, you don't. Use `JSON.parse()` for data, a proper parser for expressions, or a sandboxed interpreter for user code.

---

## When NOT to apply this skill

- These rules have no exceptions for prototypes, spikes, or "just testing." Security mistakes in prototypes become security mistakes in production when the prototype ships.
