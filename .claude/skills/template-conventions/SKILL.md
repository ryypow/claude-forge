---
name: template-conventions
description: Covers the naming rules, folder structure requirements, comment style, and MCP config documentation standards that apply across all files in the claude-templates repository.
domain: meta
triggers:
  - template conventions
  - naming conventions
  - file naming rules
  - how to name this file
  - comment style in templates
  - MCP config documentation
  - folder structure requirements
  - template structure rules
---

## Overview

This skill covers the formatting and structural conventions that apply to all files in the
claude-templates repository — regardless of domain. It is the reference for "how should this
be structured" questions that aren't specific to skills, agents, or commands individually.
For skill-specific structure, use the `skill-authoring` skill. For agent-specific structure,
consult `agent-author`. This skill covers the conventions they share.

---

## File naming

### General rules
- All file and folder names are **kebab-case**: `pre-tool-use.sh`, `data-pipeline/`, `new-endpoint.md`
- No spaces, no underscores, no camelCase in file or folder names
- Abbreviations are acceptable only when universally understood: `mcp`, `ci`, `etl`, `iac`

### Agent files
- Named for the agent's role, not its domain: `code-reviewer.md` not `base-code-reviewer.md`
- Stored at: `<domain>/agents/<agent-name>.md`

### Skill folders and files
- Folder name is the skill name in kebab-case
- The skill file is always named `SKILL.md` (uppercase) — not `skill.md`, not `<skill-name>.md`
- Stored at: `<domain>/skills/<skill-name>/SKILL.md`

### Command files
- Named for the command without the slash: `new-domain.md` for `/new-domain`
- Stored at: `<domain>/commands/<command-name>.md`

### Hook files
- Shell hooks: `<timing>-<event>.sh` — e.g., `pre-tool-use.sh`, `post-deploy.sh`
- Node.js hooks: `<timing>-<event>.js` — e.g., `post-experiment.js`
- Stored at: `<domain>/hooks/<hook-name>.<ext>`

### MCP config files
- Named for the service: `github.json`, `wandb.json`, `snowflake.json`
- Stored at: `<domain>/mcp-configs/<service-name>.json`

### Rules files
- Named for what the rule governs: `git-conventions.md`, `memory-safety.md`
- Stored at: `<domain>/rules/<rule-name>.md`

---

## Folder structure

Every domain must have exactly these 8 folders — no more, no fewer:

```
<domain>/
├── agents/
├── skills/
├── commands/
├── hooks/
├── rules/
├── mcp-configs/
├── scripts/
└── tests/
```

`scripts/` must contain `setup-env.js`. This is the entry point for environment setup in every
domain. Name it exactly this — do not name it `setup.js`, `install.js`, or anything else.

`tests/` must contain at least one test file per hook. Test files are named to match their hook:
`pre-tool-use.sh` → `pre-tool-use.test.js` (or `.test.sh` if shell-based).

---

## Comment style

### In shell hooks
- Opening comment block: explain what the hook guards against and what it allows
- Inline comments: only for non-obvious pattern choices (regex, thresholds)
- No narrating comments: do not explain what the code does line-by-line

```bash
#!/usr/bin/env bash
set -euo pipefail

# Guards against: secrets patterns, eval in hook files, writes to .env
# Allows: all other tool calls to pass through

# Matches: sk-, ghp_, AKIA... (common API key prefixes)
SECRET_PATTERN='(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{36}|AKIA[0-9A-Z]{16})'
```

### In MCP config files
Every MCP config must have a comment block explaining:
1. Why this MCP is needed in this specific domain (not just what it does)
2. What operations it enables for users of this template

```json
{
  "_comment": "wandb: ML experiment tracking. Enables reading run history, comparing hyperparameters, and logging metrics without leaving the coding workflow. Not in base because it is specific to training workflows.",
  "mcpServers": { ... }
}
```

### In CLAUDE.md files
- Use H2 (`##`) for top-level sections, H3 (`###`) for subsections
- No H4 or deeper — if you need H4, the section should be its own rules file
- Tables for reference information (lists of agents, skills, commands)
- Code blocks for structure examples and output formats
- Placeholders for project-specific values use angle brackets: `<your-project-name>`

### In rules files
- Lead with the rule itself, not the rationale
- Follow with a "Why:" line explaining the origin or motivation
- Follow with a "How to apply:" line covering edge cases and scope

```markdown
## No hardcoded secrets in any tracked file

**Why:** Secrets committed to git propagate to every clone and every git history viewer,
even after deletion. Rotation does not help if the secret was ever pushed.

**How to apply:** Use environment variable references in all config files. In MCP configs,
reference `$ENV_VAR_NAME`. In scripts, read from `process.env`. Never assign a literal
token, key, or password in any file that gets committed.
```

---

## MCP config requirements

Every MCP config file must satisfy all four:

1. **Explicit scopes** — list the exact scopes requested; no wildcards (`*` is never acceptable)
2. **No hardcoded credentials** — use `$ENV_VAR_NAME` references, never literal values
3. **Domain explanation comment** — the `_comment` field explaining why this MCP is in this
   domain specifically (see comment style above)
4. **Official endpoint** — the `url` or server config must point to the official service URL,
   not a proxy or self-hosted mirror, unless the domain CLAUDE.md explicitly documents why

---

## Placeholder conventions

Domain CLAUDE.md files are templates — they must leave placeholders for project-specific values.
Use angle bracket syntax for all placeholders:

```
<project-name>
<target-hardware>
<primary-language>
<team-name>
<database-type>
```

Never fill in a specific value that should vary per project. A domain CLAUDE.md with
`primary language: Python` hard-coded is not a template — it is a configuration for one project.

---

## When NOT to apply this skill

For SKILL.md-specific structure rules (frontmatter fields, trigger writing, content format),
use the `skill-authoring` skill. For agent file-specific structure, consult `agent-author`.
This skill covers the conventions that apply across all file types in the repo.
