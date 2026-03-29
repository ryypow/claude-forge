# Claude Templates — How to Create a Domain

A domain is a complete Claude Code configuration for a specific kind of project — ML,
frontend, DevOps, embedded, or anything else. Each domain gives Claude the context,
tools, and workflows it needs to be useful from the first prompt.

This guide walks you through creating your own.

---

## What's in a Domain?

Every domain is a folder with 8 subfolders. Here's what each one does:

| Folder | What goes in it | Example |
|---|---|---|
| `agents/` | Specialist personas Claude can become | A code reviewer, a database auditor |
| `skills/` | Reference knowledge Claude can look up | API design patterns, testing conventions |
| `commands/` | Slash commands users can invoke | `/new-endpoint`, `/run-tests` |
| `hooks/` | Shell scripts that run automatically before/after tool calls | Pre-commit linting, post-deploy health checks |
| `rules/` | Hard rules Claude must always follow | "Never use raw SQL from user input" |
| `mcp-configs/` | Connections to external tools and services | Figma, AWS, Snowflake, Weights & Biases |
| `scripts/` | Setup and utility scripts | Environment setup, dependency installation |
| `tests/` | Tests for your hooks | One test per hook file |

---

## Agents vs. Skills — When to Use Which

This is the most important distinction to get right.

### Agents = doers

An agent is a **focused persona** that Claude becomes to perform a specific type of task.
Agents have restricted tool access and a narrow scope. They *do work*.

Use an agent when:
- The task involves **reading, writing, or running something**
- You want Claude to follow a **specific methodology** for a class of problems
- The task should be **isolated** from Claude's general behavior (e.g., a security
  reviewer shouldn't also be writing code)

Examples:
- `code-reviewer` — reads code and produces a structured review
- `pipeline-designer` — designs CI/CD workflows
- `db-reviewer` — audits SQL queries for performance and safety

Agents come in two types:

| Type | Can do | Tools |
|---|---|---|
| **Reviewer / Auditor** | Read and analyze, but never modify | Read, Glob, Grep |
| **Author / Runner** | Read, write, and execute | Read, Write, Edit, Glob, Grep (or Bash) |

### Skills = knowledge

A skill is a **reference document** that Claude loads when it needs domain knowledge.
Skills don't do anything — they teach Claude *how to think* about a topic.

Use a skill when:
- You want Claude to know **patterns, conventions, or best practices**
- The knowledge applies **across multiple tasks** (not just one command)
- You find yourself **explaining the same thing** to Claude repeatedly

Examples:
- `api-design` — REST conventions, versioning, error formats
- `safe-c-patterns` — MISRA/CERT C rules, banned functions, bounds checking
- `testing-strategy` — when to write unit vs. integration vs. e2e tests

### Quick decision guide

```
"I want Claude to DO something specific"     → Agent
"I want Claude to KNOW something"            → Skill
"I want a shortcut the user can type"        → Command
"I want something to run automatically"      → Hook
"I want a rule Claude must always follow"    → Rule
```

---

## Creating a Domain — Step by Step

### Step 1: Run `/new-domain`

Tell Claude what kind of project this domain is for. You don't need to know what agents
or skills are yet — Claude will ask you about your workflows and figure it out with you.

> /new-domain
> "I'm building a domain for mobile app development with React Native."

Claude's `domain-planner` will then ask you questions like:
- What does your typical workflow look like, start to finish?
- What tasks do you repeat most often?
- Where do things usually go wrong?
- What conventions or best practices do you follow?
- What external tools do you use daily?

Based on your answers, it maps your workflow to the right template pieces (agents,
skills, commands, hooks, rules, and tool connections), then hands off to the
`template-architect` to design the folder structure and scaffold everything.

### Step 2: Fill in the placeholders

After scaffolding, each file has TODOs marking where you need to add content.
You can fill them in manually or use these commands:

- **`/new-agent`** — Claude writes an agent file for you. Provide the agent name,
  what it should do, and whether it's a reviewer (read-only) or author (read-write).

- **`/new-skill`** — Claude writes a skill file for you. Provide the skill name
  and a one-sentence description of what knowledge it should contain.

### Step 3: Review your domain

```
/review-domain <your-domain-name>
```

This audits your domain for missing pieces, incomplete files, or convention issues.
It produces a gap report telling you exactly what to fix.

### Step 4: Verify before committing

```
/verify
```

Runs 17 checks across structure, content, security, and git conventions. Nothing
ships until all checks pass.

### Step 5: Check for base promotions

```
/sync-base
```

If you've built multiple domains, this checks whether anything you wrote is duplicated
across 3 or more domains. If so, it belongs in the shared `base/` layer, not in each
domain individually. Run this after building a new domain to keep the repo clean.

### Step 6: Release

```
/release <your-domain-name>
```

Bumps the version in `versions.json`, creates git tags (`<domain>@<version>`), and
prepares a PR description for `dev → main`. The release command runs its own pre-flight
checks — it will refuse to proceed if `/verify` hasn't passed or if the changelog is
missing an entry.

See `.claude/commands/release.md` for the full release workflow.

---

## What Happens Behind the Scenes

The step-by-step guide above uses commands, but those commands invoke specialized agents
and skills automatically. Here's what's running under the hood:

### Implicit agents

Each command activates a focused agent with restricted tool access:

| Step | Command | Agent activated | What it does |
|---|---|---|---|
| 1 | `/new-domain` | `domain-planner` → `template-architect` | Planner interviews you about workflows, then architect designs the folder structure |
| 2 | `/new-agent` | `agent-author` | Writes agent files with correct structure, scope boundaries, and tool restrictions |
| 2 | `/new-skill` | `skill-author` | Writes skill files with valid frontmatter and trigger keywords |
| 3 | `/review-domain` | `domain-reviewer` | Read-only audit of a domain for gaps, convention issues, and missing pieces |
| 4 | `/verify` | `template-verifier` | Runs the 17-check quality and security gate |

### Implicit skills

Skills are reference knowledge that agents load automatically when they need domain
expertise. You never invoke a skill directly — the right skill activates based on context:

| Skill | What it teaches | When it activates |
|---|---|---|
| `domain-design` | How to scope and qualify a new domain — what earns its own template vs. what belongs in base | During `/new-domain` when the planner is deciding what your domain needs |
| `skill-authoring` | SKILL.md format, frontmatter requirements, trigger keyword writing | During `/new-skill` and whenever an agent writes or reviews a skill file |
| `template-conventions` | Naming rules, folder structure, comment style, MCP config documentation standards | Across all steps — any time files are created or reviewed for convention compliance |

### Hooks

The `pre-tool-use` hook runs automatically before every tool call in this repo. It
pattern-matches for security issues (secrets, banned shell patterns, unsafe Node.js
patterns) and blocks the operation if it finds a match. This is the fast, deterministic
first tier of the three-tier security model described in the root `CLAUDE.md`.

---

## Example: What a Domain Looks Like

Here's what the ML domain includes to give you an idea of scope:

```
ml/
├── agents/
│   ├── experiment-tracker.md      ← Agent: tracks runs and results
│   ├── data-validator.md          ← Agent: checks dataset integrity
│   └── model-evaluator.md         ← Agent: runs evaluation benchmarks
├── skills/
│   ├── experiment-design/SKILL.md ← Skill: hypothesis → experiment workflow
│   ├── data-pipeline/SKILL.md     ← Skill: ETL and feature engineering patterns
│   └── model-eval/SKILL.md        ← Skill: how to pick and apply metrics
├── commands/
│   ├── new-experiment.md          ← /new-experiment — scaffold a run
│   ├── eval.md                    ← /eval — evaluate current model
│   └── compare.md                 ← /compare — diff two experiments
├── hooks/
│   ├── pre-train.sh               ← Validates data before training starts
│   └── post-experiment.sh         ← Logs results after a run completes
├── rules/
│   ├── experiment-tracking.md     ← "Always log hyperparameters and seeds"
│   └── data-handling.md           ← "Never train on test data, version datasets"
├── mcp-configs/
│   ├── wandb.json                 ← Weights & Biases experiment tracking
│   └── huggingface.json           ← HuggingFace model/dataset access
├── scripts/
│   └── setup-env.js               ← Python venv, CUDA, dependency setup
└── tests/
    └── pipeline.test.js           ← Tests for the hook scripts
```

Notice the pattern: agents *do things* (track, validate, evaluate), skills *teach
things* (design patterns, pipeline conventions, evaluation methodology), and commands
give users *shortcuts* for common workflows.

---

## Commands Reference

| Command | What it does |
|---|---|
| `/new-domain` | Design and scaffold a complete domain from scratch |
| `/new-agent` | Create an agent file in an existing domain |
| `/new-skill` | Create a skill file in an existing domain |
| `/review-domain` | Audit a domain for gaps and issues (read-only) |
| `/verify` | Run quality and security checks before committing |
| `/sync-base` | Find duplicated files that should move to the shared base layer |
| `/release` | Tag and release a domain version |

---

## Agents Available in This Repo

These agents help you build templates (they're the "meta" layer — agents that create agents):

| Agent | What it does | When to use it |
|---|---|---|
| `domain-planner` | Asks about your workflows and maps them to template concepts | Automatically via `/new-domain` (runs first) |
| `template-architect` | Turns the plan into folder structure and file specs | Automatically via `/new-domain` (runs after planner) |
| `agent-author` | Writes agent files | Automatically via `/new-agent`, or ask directly |
| `skill-author` | Writes skill files | Automatically via `/new-skill`, or ask directly |
| `domain-reviewer` | Audits domains for completeness | Automatically via `/review-domain` |
| `template-verifier` | Runs the 17-check verification gate | Automatically via `/verify` |

---

## Tips

- **Start small.** 2-3 agents and 2-3 skills is plenty. You can always add more later.
- **Name things for what they do.** `code-reviewer` not `code-agent`. `api-design` not
  `api-stuff`.
- **Reviewers should be read-only.** If an agent's job is to analyze or audit, it should
  never have Write or Edit access. This prevents it from "fixing" things without you
  knowing.
- **One skill = one topic.** If a skill covers two unrelated things, split it into two
  skills. Each should be under 300 lines.
- **Rules are for non-negotiables.** Don't put style preferences in rules. Rules are for
  things that would cause real problems if violated — security requirements, data handling
  policies, safety constraints.
- **Every hook needs a test.** If you add a hook in `hooks/`, add a matching test in
  `tests/`.

---

## Version Bumps

When you change a domain, bump its version in `versions.json`:

| What changed | Bump type | Example |
|---|---|---|
| Typo, clarification, URL fix | Patch | `1.0.0 → 1.0.1` |
| Added a new agent, skill, or command | Minor | `1.0.0 → 1.1.0` |
| Removed or renamed an agent, restructured the domain | Major | `1.0.0 → 2.0.0` |

---

## Branch Naming

```
feature/<domain>/<description>   — new domain or feature work
fix/<domain>/<description>       — bug fixes to an existing domain
base/<description>               — changes to the shared base layer
```
