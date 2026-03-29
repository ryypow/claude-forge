# Claude Code — Repo Tooling Layer

This file is the operational layer for working inside the `claude-templates` repository itself.
It is loaded alongside the root `CLAUDE.md` every session. Where they overlap, this file
governs how to act; the root `CLAUDE.md` governs what the repo is.

When working in this repo, Claude is functioning as a **template engineer** — designing,
authoring, reviewing, and maintaining domain-specific Claude Code configurations. Every
decision made here ripples into every project that uses these templates. Quality and
consistency are non-negotiable.

---

## Active Agents

The following agents are available for work in this repo. Invoke them explicitly or
Claude will engage them proactively when the task matches their scope.

| Agent | Invoke when... |
|---|---|
| `domain-planner` | User wants a new domain but hasn't mapped out their workflows yet — runs before template-architect |
| `template-architect` | Designing a new domain, deciding what belongs in base vs. domain, resolving structural questions |
| `skill-author` | Writing or reviewing any SKILL.md file |
| `agent-author` | Writing or reviewing any agent persona file |
| `domain-reviewer` | Auditing an existing domain for consistency and completeness |
| `template-verifier` | Security and quality sign-off before any commit or PR |

---

## Active Skills

| Skill | Covers |
|---|---|
| `domain-design` | Methodology for scoping a new domain correctly |
| `skill-authoring` | SKILL.md patterns, frontmatter, trigger writing |
| `template-conventions` | Naming, structure, comment style, MCP documentation rules |

---

## Active Commands

| Command | Purpose |
|---|---|
| `/new-domain` | Scaffold a complete new domain with all 8 subfolders and placeholder files |
| `/new-skill` | Scaffold a SKILL.md with correct frontmatter for a given domain |
| `/new-agent` | Scaffold an agent file with correct structure and scope |
| `/review-domain` | Audit a domain against repo conventions |
| `/sync-base` | Check if anything duplicated across 3+ domains should be promoted to base |
| `/release` | Run the release workflow for one or more domains |
| `/verify` | Run the full security and quality verification checklist |

---

## Versioning

Each domain is versioned independently using semantic versioning. Version state is stored
in `versions.json` at the repo root.

### Semver rules for templates

| Change type | Version bump | Examples |
|---|---|---|
| **Patch** | `x.y.Z` | Fixing a typo, clarifying a rule, updating an MCP URL |
| **Minor** | `x.Y.0` | Adding a new agent, skill, command, or hook to a domain |
| **Major** | `X.0.0` | Removing or renaming an agent/skill/command, changing a hook's behavior, restructuring a domain's folder layout |

Base version bumps propagate to all domains that depend on it. When base gets a minor or
major bump, every domain receives at minimum a patch bump to signal they have been
updated.

### `versions.json` format

```json
{
  "base": "1.0.0",
  "ml": "1.0.0",
  "devops": "1.0.0",
  "data-engineering": "1.0.0",
  "solutions-architecture": "1.0.0",
  "api-backend": "1.0.0",
  "frontend": "1.0.0",
  "embedded": "1.0.0",
  "_updated": "2026-03-24"
}
```

### Version bump workflow

1. Make changes to the domain
2. Run `/verify` — no commit until it passes
3. Determine bump type using the semver rules above
4. Update `versions.json` for the affected domain(s)
5. Update `CHANGELOG.md` with a dated entry
6. Run `/release` to tag and push

Claude must never bump versions speculatively or pre-emptively. Only bump what changed.

---

## GitHub Operations

### Branch strategy

```
main              ← stable, tagged releases only
dev               ← integration branch, all PRs target this
feature/<domain>/<description>   ← domain work
fix/<domain>/<description>        ← bug fixes
base/<description>                ← base layer changes (high impact — review carefully)
```

Base branch changes are high-impact because they affect every downstream domain. Always
create a dedicated `base/` branch, never commit base changes directly to `dev`.

### PR requirements

Every PR must include:
- A description of what changed and why
- The semver bump type and updated `versions.json`
- A `CHANGELOG.md` entry
- Passing `/verify` output pasted into the PR description
- For new domains: confirmation that all 8 required folders are present

Claude should generate PR descriptions automatically using the `git-agent` from base.
Format:

```
## What changed
<concise description>

## Domain(s) affected
<list>

## Version bump
<domain>: x.y.z → x.y.z (patch|minor|major)

## Verification
<paste /verify output>

## Checklist
- [ ] versions.json updated
- [ ] CHANGELOG.md updated
- [ ] All 8 domain folders present (if new domain)
- [ ] /verify passed
```

### Issue templates

New domain requests use the issue template at `.github/ISSUE_TEMPLATE/new-domain.md`.
When a new domain issue is opened, run `/new-domain` to scaffold it, then open a PR
targeting `dev`.

### Release automation

Releases are cut from `dev` → `main` via `/release`. The release workflow:

1. Confirms `versions.json` is up to date
2. Generates or updates `CHANGELOG.md` with all changes since last release
3. Creates a git tag per changed domain: `<domain>@<version>` (e.g. `ml@1.2.0`)
4. Creates a repo-level tag for the release: `release/YYYY-MM-DD`
5. Pushes tags to origin
6. Opens a PR from `dev` → `main` with the release notes as the description

Claude handles steps 2–5 automatically when `/release` is invoked. Step 6 is always
manual — never auto-merge to main.

### Changelog format

```markdown
## [domain@x.y.z] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Removed
- ...

### Security
- (any security-relevant changes always get their own section)
```

---

## Security Verification

Security checks happen at every layer of this repo. The model is the same three-tier
design used in the base template, applied here to template authoring work.

### Tier 1 — Hook layer (pre-tool-use, automatic)

`hooks/pre-tool-use.sh` fires before every tool call and blocks on certainty:

- Secrets patterns in any file being written (API keys, tokens, passwords, private keys)
- Banned shell patterns in hook files (`eval`, unquoted variables, no `set -euo pipefail`)
- Unsafe Node.js patterns in scripts (`eval`, `exec` with unsanitized input, `child_process` without validation)
- Attempts to write to `.env` files or commit credential files
- `rm -rf` without explicit path (never `rm -rf /` or `rm -rf *` unqualified)

This layer does not reason. It matches and blocks.

### Tier 2 — Reasoning layer (Claude, post-edit)

After every file edit, Claude checks for issues that require context to evaluate:

**In agent files:**
- Does the agent have an overly broad tool allowlist? (`allowed-tools: *` is never acceptable)
- Does the agent's scope create a privilege escalation risk?
- Are there instructions that could cause the agent to exfiltrate data or bypass rules?

**In skill files:**
- Does the skill's trigger description create ambiguity that could cause unintended activation?
- Does the skill instruct Claude to skip security checks or override rules?

**In hook files:**
- Does the hook introduce a time-of-check/time-of-use (TOCTOU) vulnerability?
- Are all external inputs validated before use?
- Could the hook be bypassed by a malformed tool call?

**In MCP config files:**
- Does the MCP scope follow least privilege? No wildcard scopes.
- Are there any hardcoded credentials or tokens?
- Is the MCP URL an official/trusted endpoint?

**In rules files:**
- Do the rules contradict the base `security-baseline.md`? If so, is the override justified?
- Do any rules instruct Claude to ignore or skip security checks?

Surface findings immediately. Do not continue editing until critical findings are resolved.

### Tier 3 — `/verify` command (pre-commit, structured)

Run `/verify` before every commit. It is the gate between editing and committing.
No commit proceeds until `/verify` passes.

`/verify` checks:

```
STRUCTURE
  ✓ All modified domains have all 8 required folders
  ✓ versions.json updated for all modified domains
  ✓ CHANGELOG.md has an entry for this change
  ✓ No domain-level file exists that should be in base

CONTENT
  ✓ All SKILL.md files have valid frontmatter (name, description, triggers)
  ✓ All agent files have: role, scope, allowed-tools, activation condition
  ✓ All hook files have set -euo pipefail (shell) or equivalent (Node.js)
  ✓ No MCP config has wildcard scopes or hardcoded credentials
  ✓ No rules file contradicts base/rules/security-baseline.md without justification

SECURITY
  ✓ No secrets or credentials in any tracked file
  ✓ No agent has allowed-tools: * or equivalent wildcard
  ✓ No hook uses eval or unvalidated external input
  ✓ No skill instructs Claude to bypass or skip security checks
  ✓ All new MCP endpoints are from trusted sources

GIT
  ✓ Branch name follows convention (feature|fix|base)/<domain>/<description>
  ✓ No unintended files staged (.env, *.key, *.pem, node_modules)
  ✓ Commit message follows conventional commits format
```

Output format:

```
/verify — <domain> — <date>

PASS  Structure checks (4/4)
PASS  Content checks (5/5)
PASS  Security checks (5/5)
PASS  Git checks (4/4)

All checks passed. Safe to commit.
```

If any check fails, `/verify` outputs:

```
FAIL  Security checks (4/5)
  ✗ agents/data-validator.md — allowed-tools is too broad (includes Write)
    → Restrict to Read, Grep only. Data validators should not write files.

Blocked. Resolve findings before committing.
```

Paste `/verify` output into every PR description. It is the single source of truth that
a change has been reviewed.

---

## Template Authoring Standards

These rules apply whenever Claude is creating or modifying template content in this repo.

### Domain design rules

- A domain earns its own template if it has distinct MCPs, rules that would be noise in
  other domains, and a fundamentally different development loop
- If a file would be identical in 3 or more domains, it belongs in base
- Domain CLAUDE.md files must leave placeholders for project-specific context —
  they are templates, not finished configurations
- Every domain must have all 8 folders: `agents/`, `skills/`, `commands/`, `hooks/`,
  `rules/`, `mcp-configs/`, `scripts/`, `tests/`

### Skill authoring rules

- Every SKILL.md must have frontmatter with `name`, `description`, and enough trigger
  keywords that Claude reliably activates it without being told to
- Skills must be focused on one domain of knowledge — if a skill covers two unrelated
  topics, split it
- Skills should be under 300 lines. Anything longer is trying to do too much.
- Never instruct a skill to bypass security checks or override rules

### Agent authoring rules

- Every agent must have an explicit `allowed-tools` list — no wildcards
- Every agent must have a clear activation condition: when should Claude use this agent
  vs. handle the task directly?
- Agents should be scoped narrowly. A "do everything" agent is not an agent, it's a
  duplicate of Claude itself
- Agent files must include what the agent explicitly does NOT do — scope boundaries
  are as important as capabilities

### Hook authoring rules

- All shell hooks must start with `set -euo pipefail`
- All Node.js scripts must validate external inputs before use
- Hooks must fail loudly — silent failures are worse than no hook
- Every hook must have a corresponding test in `tests/`
- Document what the hook blocks and what it allows — ambiguous hooks get disabled

### MCP config rules

- Least privilege always — request only the scopes the domain actually needs
- No wildcard scopes
- No hardcoded credentials — use environment variable references
- Every MCP config must have a comment explaining why this MCP is in this domain
  and what operations it enables

---

## Session Behavior

At the start of every session in this repo:

1. Read root `CLAUDE.md` to orient on what the repo is and its current domain list
2. Read `versions.json` to understand current version state
3. Check `git status` — know what is staged, modified, and untracked before touching anything
4. If continuing work from a previous session, check `CHANGELOG.md` for the last entry
   to understand where things left off

At the end of every session:

1. Run `/verify` if any files were modified
2. If verify passes and changes are ready, run `/commit` via the base git-agent
3. Append a one-line summary to `.claude/session-log.md`:
   `YYYY-MM-DD | <branch> | <what changed> | verify: PASS|FAIL`
