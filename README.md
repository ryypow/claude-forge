# Claude Forge

**Forging Claude into a specialist with domain-specific templates.**

Claude Code starts every session from scratch — no memory of your stack, your conventions,
or your workflows. Claude Forge fixes that. Pick a domain template, scaffold it into your
project, and Claude is ready to work the way you work from the first prompt.

Each template is a domain-specific configuration: agents specialized in the respective domain, skills that encode best practices, commands that automate common or domain-specific tasks, and hooks that catch mistakes before they happen.

---

## How It Works

Every template is built from two layers:

- **Base** — universal foundations that apply to any project: git conventions, code review,
  security hygiene, debugging methodology
- **Domain** — everything specific to your discipline: specialized agents, domain knowledge,
  workflow commands, and connections to the tools you use

  When you scaffold a project, these two layers merge into your `.claude/` folder:

```
your project's .claude/ = base + domain
```

If the domain and base disagree on something, the domain wins.

---

## Available Domains

| Domain | Folder | What it's for |
|---|---|---|

---

## Quick Start

### Option 1: Scaffold script

```bash
node base/scripts/scaffold.js --domain ml --output ~/projects/my-project
```

This copies the base layer and your chosen domain into `~/projects/my-project/.claude/`,
ready to go.

### Option 2: Manual setup

```bash
# Copy base into your project
cp -r base/.claude/* my-project/.claude/

# Copy your chosen domain on top (overwrites base where needed)
cp -r ml/.claude/* my-project/.claude/

# Copy the domain's CLAUDE.md to your project root
cp ml/CLAUDE.md my-project/CLAUDE.md
```

Then open the `CLAUDE.md` in your project and fill in the placeholders (project name,
languages, frameworks, team conventions).

---

## What's in a Domain

Every domain has the same 8 folders:

| Folder | What goes in it | Example |
|---|---|---|
| `agents/` | Specialist personas Claude can become | A code reviewer, a database auditor |
| `skills/` | Reference knowledge Claude can look up | API design patterns, testing conventions |
| `commands/` | Slash commands users can invoke | `/new-endpoint`, `/run-tests` |
| `hooks/` | Scripts that run automatically before/after actions | Pre-commit linting, post-deploy checks |
| `rules/` | Hard rules Claude must always follow | "Never use raw SQL from user input" |
| `mcp-configs/` | Connections to external tools and services | Figma, AWS, Snowflake, W&B |
| `scripts/` | Setup and utility scripts | Environment setup, dependency installation |
| `tests/` | Tests for your hooks | One test per hook file |

---

## Create Your Own Domain

Don't see a domain that fits your project? Create one.

```
/new-domain
```

Claude will ask about your workflows — what you build, what tasks you repeat, where things
go wrong, what tools you use — and design a domain template based on your answers. No need
to understand the template structure upfront; the `domain-planner` agent figures out what
you need through conversation.

See [`.claude/README.md`](.claude/README.md) for the full guide on creating domains,
writing agents and skills, and understanding the tooling.

---

## Contributing

This repo includes tooling agents that help maintain template quality:

| Command | What it does |
|---|---|
| `/new-domain` | Design and scaffold a new domain from scratch |
| `/new-agent` | Create an agent file in an existing domain |
| `/new-skill` | Create a skill file in an existing domain |
| `/review-domain` | Audit a domain for gaps and issues |
| `/verify` | Run quality and security checks before committing |

See [`.claude/CLAUDE.md`](.claude/CLAUDE.md) for contributor conventions, versioning
rules, and the full verification checklist.

---

## Base Layer Detail

The base layer is the most critical piece of this repository. Every project gets it, so it must be universal, lean, and high signal.

### Agents

| Agent | Role | When it activates |
|---|---|---|
| `code-reviewer` | Balanced review across Python, TS/JS, Rust, C. Flags bad patterns, not style preferences. Distinguishes "this is wrong" from "this is different from how I'd do it." | On-demand via `/review` |
| `planner` | Decomposes tasks before touching code. Enforces spec-before-implementation discipline. | On-demand via `/plan` |
| `debugger` | Systematic root cause analysis: stack traces, bisecting, hypothesis testing. | On-demand |
| `git-agent` | PR descriptions, conventional commits, branch naming, changelog entries. | On-demand via `/commit` |
| `security-sentinel` | Proactive monitor with narrow scope: hardcoded secrets, injection risks, unsafe memory patterns. Fires unprompted on critical finds only — silent otherwise. | Proactive |

### Skills

| Skill | Purpose |
|---|---|
| `git-workflow` | Branch → PR → merge conventions |
| `code-review` | Balanced review checklist: what to flag vs. what to let go |
| `security-hygiene` | Baseline rules across Python/TS/Rust/C: no secrets, input validation, safe memory, dependency pinning |
| `debugging` | Systematic debugging methodology per language |

### Commands

| Command | Purpose |
|---|---|
| `/plan` | Decompose a task and produce a spec before writing any code |
| `/review` | Full on-demand code audit of current changes |
| `/commit` | Staged commit with a generated conventional commit message |
| `/audit` | Full security and best-practices sweep — on-demand, thorough |
| `/standup` | Summarize what changed this session across all files touched |

### Language Context

Base is configured for Python, TypeScript/JavaScript, Rust, and C. Security hygiene rules and the pre-tool-use hook are tuned for all four. Domain templates may extend or narrow this (e.g. embedded narrows to C/Rust only, frontend narrows to TS/JS).

---
