# /audit

Run a comprehensive security and best-practices sweep across the codebase.

## Usage

```
/audit
/audit <directory>
```

Examples:
- `/audit` — sweep the entire project
- `/audit src/` — sweep only the src directory

## Steps

1. **Define scope** — if no path is given, audit the full project. If a path is given, audit that subtree.

2. **Security sweep** — check every file in scope for:
   - Hardcoded secrets (API keys, tokens, passwords, private keys)
   - Injection vulnerabilities (SQL, command, XSS)
   - `eval()` or dynamic code execution
   - Disabled security controls (SSL verification off, CORS `*`, auth bypassed)
   - Unsafe memory operations (C/Rust: banned functions, unbounded buffers)
   - Missing input validation at system boundaries

3. **Dependency health** — check for:
   - Lock file exists and is committed
   - Known vulnerabilities in dependencies (run `npm audit`, `pip audit`, `cargo audit` if available)
   - Outdated dependencies that are multiple major versions behind
   - Unnecessarily large dependency tree

4. **Code quality** — check for:
   - Functions over 50 lines that should be split
   - Dead code (unused imports, unreachable branches, commented-out code)
   - Error handling gaps (empty catch blocks, swallowed exceptions)
   - Missing tests for critical paths

5. **Configuration** — check for:
   - `.env` files or credentials not in `.gitignore`
   - Debug mode enabled in production configs
   - Overly permissive file permissions
   - Secrets in CI/CD config files

6. **Produce report** — structured output with findings by category and severity.

## Output Format

```markdown
## Security Audit — [date]

**Scope:** [what was audited]

### Security
| Severity | File | Finding |
|---|---|---|
| CRITICAL | `path:line` | [description] |
| HIGH | `path:line` | [description] |

### Dependencies
| Status | Package | Issue |
|---|---|---|
| WARN | `package@version` | [description] |

### Code Quality
| File | Finding |
|---|---|
| `path:line` | [description] |

### Configuration
| File | Finding |
|---|---|
| `path` | [description] |

### Summary
- **Critical:** N findings
- **High:** N findings
- **Warning:** N findings
- **Clean areas:** [what looked good]
```

## Notes

- This is the thorough, on-demand audit. For real-time monitoring, the `security-sentinel` agent handles critical issues proactively.
- Reference the `security-hygiene` skill for the full list of rules.
- Be thorough but actionable — every finding should include what to fix, not just what's wrong.
- Include clean areas in the summary. Knowing what's secure is as valuable as knowing what isn't.
