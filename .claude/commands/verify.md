# /verify

Run the full security and quality verification checklist. Nothing commits until this passes.

## Usage

```
/verify [<domain> ...]
```

If no domain is specified, verify all domains with uncommitted changes (determined from
`git diff --name-only` and `git diff --cached --name-only`).

## Steps

1. **Identify scope** — determine which domains have modified files using git status.
   If a specific domain is passed, scope to that domain only.

2. **Invoke `template-verifier`** to run all 17 checks across four categories:

   **STRUCTURE (4 checks)**
   - All modified domains have all 8 required folders
   - `versions.json` updated for all modified domains
   - `CHANGELOG.md` has an entry for this change
   - No domain-level file is identical to a base file (missed base promotion)

   **CONTENT (5 checks)**
   - All SKILL.md files have valid frontmatter (name, description, domain, triggers)
   - All agent files have all required sections (role, allowed-tools, activation, does-not-do)
   - All shell hook files start with `set -euo pipefail`
   - No MCP config has wildcard scopes or hardcoded credentials
   - No rules file contradicts `base/rules/security-baseline.md` without justification

   **SECURITY (5 checks)**
   - No tracked file contains secret patterns
   - No agent has `allowed-tools: *` or wildcard equivalent
   - No hook file uses `eval` or unvalidated external input
   - No skill instructs Claude to bypass security checks
   - All new MCP endpoints use `https://` and point to official service domains

   **GIT (3 checks)**
   - Branch name follows `(feature|fix|base)/<domain>/<description>`
   - No sensitive files are staged (`.env`, `*.key`, `*.pem`, `node_modules/`)
   - Commit message follows conventional commits format

3. **Output the structured report** in the template-verifier format.

4. **On PASS**: print "Safe to commit." and suggest running `/commit` via the git-agent.

5. **On FAIL**: print each failing check with its remediation step. Do not suggest committing.
   Fix the findings, then re-run `/verify`.

## Output format

```
/verify — <domain(s)> — <date>

STRUCTURE   PASS (4/4)
CONTENT     PASS (5/5)
SECURITY    PASS (5/5)
GIT         PASS (3/3)

Overall: PASS
Safe to commit.
```

Paste this output into every PR description. It is the single source of truth that a change
has been reviewed before merging.

## Important

`/verify` is a gate, not a suggestion. No commit, no PR, and no release proceeds without a
passing `/verify` run. If you find yourself thinking "it's just a small change, I'll skip
verify" — that is exactly when you should not skip it.
