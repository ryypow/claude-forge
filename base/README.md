# Base Layer

The shared foundation that ships with every Claude Forge template. Base provides the
agents, skills, commands, hooks, and rules that every project needs regardless of domain —
code review, debugging, git workflows, security monitoring, and research methodology.

Base is never used alone. It is always paired with a domain template. When you scaffold
a project, base goes in first and the domain layer goes on top:

```
your .claude/ = base + domain
```

If the domain disagrees with base on something, the domain wins.

---

## What's Inside

### Agents — 5 specialist personas

| Agent | What it does | Type | Activation |
|---|---|---|---|
| `code-reviewer` | Balanced code review — flags bugs, security issues, and bad patterns. Ignores style preferences. | Read-only | `/review` |
| `planner` | Decomposes tasks into concrete steps before code is written. Forces spec-before-implementation discipline. | Read-only | `/plan` |
| `debugger` | Systematic root cause analysis — reproduce, isolate, hypothesize, verify, fix. No guessing. | Active (Bash) | When debugging |
| `git-agent` | Conventional commits, branch naming, PR descriptions, changelog entries. | Active (Bash) | `/commit` |
| `security-sentinel` | Proactive monitor for critical security issues. Fires unprompted when it finds secrets, injection, or unsafe memory. Silent otherwise. | Read-only | Automatic |

**Read-only** agents can use Read, Glob, and Grep. They analyze but never modify files.
**Active** agents can also use Bash to run commands (git, tests, build tools).

### Skills — 5 knowledge references

| Skill | What it teaches Claude |
|---|---|
| `research-methodology` | How to investigate engineering decisions — evaluate options before implementing. Powers the `/spike` command. |
| `git-workflow` | Branch naming, conventional commits, PR workflow, merge strategy. How this project manages code changes. |
| `code-review` | What to flag vs. what to let go. Review methodology that catches real problems without nitpicking. |
| `security-hygiene` | Non-negotiable security rules across Python, TypeScript, Rust, and C — secrets, injection, memory safety, dependency pinning. |
| `debugging` | Systematic debugging: read the error, reproduce, isolate, hypothesize, verify. Language-specific tools and common bug patterns. |

### Commands — 6 slash commands

| Command | What it does |
|---|---|
| `/spike` | Run a time-boxed investigation of a technical decision. Produces an options matrix and recommendation — no code. |
| `/plan` | Decompose a task into concrete steps with file paths, risks, and tests. No code until the plan is approved. |
| `/review` | Full code review of current changes. Findings categorized as Critical, Warning, or Suggestion. |
| `/commit` | Stage files, generate a conventional commit message from the diff, and commit after approval. |
| `/audit` | Comprehensive security and best-practices sweep — secrets, dependencies, code quality, configuration. |
| `/standup` | One-paragraph summary of what changed this session — done, in progress, blockers, next steps. |

### Hooks — 2 automated scripts

| Hook | When it runs | What it does |
|---|---|---|
| `pre-tool-use.sh` | Before every tool call | Pattern-matches for secrets, banned functions, `eval()`, destructive ops. Blocks on certainty. Fast, no reasoning. |
| `session-summary.sh` | End of session | Appends a one-line entry to `.claude/session-log.md` with date, branch, summary, and file count. |

### Rules — 3 non-negotiable rule sets

| Rule | Scope |
|---|---|
| `git-conventions` | Conventional commits, branch naming, PR requirements, prohibited actions (no force-push to main) |
| `code-quality` | Complexity limits, no dead code, error handling, testing requirements, naming standards |
| `security-baseline` | No secrets in code, no `eval()`, validate external input, banned C functions, pin dependencies, no dangerous `rm -rf` |

### MCP Configs — 2 tool integrations

| MCP | Why it's in base |
|---|---|
| `github.json` | Every project uses GitHub for PRs, issues, and code search. Uses `$GITHUB_TOKEN` env var — no hardcoded credentials. |
| `context7.json` | Live documentation lookup across languages and frameworks. Gives Claude current docs instead of relying on training data. |

### Scripts — 2 utility scripts

| Script | What it does |
|---|---|
| `scaffold.js` | Merges base + a domain into a project's `.claude/` folder. Handles conflicts (domain wins). Reports what was copied. |
| `validate.js` | Validates a domain template's structure — checks all 8 folders exist, skills have frontmatter, agents have allowed-tools, hooks have `set -euo pipefail`, no secrets. |

### Tests — 1 test file

| Test | Coverage |
|---|---|
| `scaffold.test.js` | 11 tests covering scaffold.js (help, args, missing domain, dry-run) and validate.js (structure, skills, agents, hooks, valid domain). |

---

## Security Model

Base implements a three-tier security model that balances speed with thoroughness:

```
Tier 1: Hooks         — fast, automatic, pattern matching (pre-tool-use.sh)
Tier 2: Claude         — automatic, reasoning, context-aware (after every edit)
Tier 3: /audit         — on-demand, thorough, full codebase sweep
```

**Tier 1** catches the obvious — secrets, `eval()`, banned C functions, destructive shell
commands. It runs before every tool call and blocks instantly. No false positives because
it only matches high-confidence patterns.

**Tier 2** catches the subtle — injection vulnerabilities that need context, privilege
escalation risks, unsafe patterns that aren't simple regex matches. Claude evaluates
these after every file edit and surfaces critical findings immediately.

**Tier 3** catches everything else — dependency health, code complexity, test coverage
gaps, configuration issues. Run `/audit` when you want the full picture.

---

## Language Support

Base is configured for four languages. Domain templates may narrow this (embedded uses
only C/Rust) or extend it (frontend adds CSS/HTML concerns).

| Language | What base covers |
|---|---|
| **Python** | Type hints, `pathlib`, `subprocess.run(shell=False)`, formatter conventions |
| **TypeScript/JS** | Strict mode, no `any` without justification, parameterized queries, input validation |
| **Rust** | `// SAFETY:` comments on unsafe, `clippy::pedantic`, no `unwrap()` in libraries, `Cargo.lock` |
| **C** | Bounded buffers, banned functions list, null checks after `malloc`, return value checks |

---

## How Domains Override Base

When base and a domain both provide the same file, the domain version wins. This lets
domains customize anything:

- **Hooks** — the embedded domain overrides `pre-tool-use.sh` with a stricter version
  that bans `malloc` in ISRs and `printf` in production code
- **Rules** — a domain can tighten `security-baseline.md` (add more rules) or relax it
  (with documented justification)
- **CLAUDE.md** — each domain has its own `CLAUDE.md` that replaces the base version
  with domain-specific context, agents, and workflows

Things that are **additive** (agents, skills, commands) don't conflict — the domain's
agents join the base agents, they don't replace them.

---

## File Tree

```
base/
├── CLAUDE.md                          # Universal session instructions (template with placeholders)
├── README.md                          # This file
├── agents/
│   ├── code-reviewer.md               # Balanced code review — bugs and security, not style
│   ├── planner.md                      # Task decomposition before implementation
│   ├── debugger.md                     # Systematic root cause analysis
│   ├── git-agent.md                    # Commits, PRs, branches, changelogs
│   └── security-sentinel.md           # Proactive critical security monitor
├── skills/
│   ├── research-methodology/
│   │   └── SKILL.md                    # Engineering investigation workflow
│   ├── git-workflow/
│   │   └── SKILL.md                    # Branch, commit, PR, and merge conventions
│   ├── code-review/
│   │   └── SKILL.md                    # Review methodology — what to flag vs. let go
│   ├── security-hygiene/
│   │   └── SKILL.md                    # Security rules across Python/TS/Rust/C
│   └── debugging/
│       └── SKILL.md                    # Reproduce, isolate, hypothesize, verify, fix
├── commands/
│   ├── spike.md                        # /spike — time-boxed technical investigation
│   ├── plan.md                         # /plan — decompose task into steps
│   ├── review.md                       # /review — full code review
│   ├── commit.md                       # /commit — conventional commit workflow
│   ├── audit.md                        # /audit — security and best-practices sweep
│   └── standup.md                      # /standup — session summary
├── hooks/
│   ├── pre-tool-use.sh                 # Blocks secrets, eval, banned functions, destructive ops
│   └── session-summary.sh              # Logs session activity to session-log.md
├── rules/
│   ├── git-conventions.md              # Commit format, branch naming, PR rules
│   ├── code-quality.md                 # Complexity, dead code, error handling, testing
│   └── security-baseline.md            # Secrets, injection, eval, memory safety, dependencies
├── mcp-configs/
│   ├── github.json                     # GitHub PR/issue/code-search integration
│   └── context7.json                   # Live documentation lookup
├── scripts/
│   ├── scaffold.js                     # Merges base + domain → .claude/
│   └── validate.js                     # Validates domain template structure
└── tests/
    └── scaffold.test.js                # 11 tests for scaffold and validate scripts
```

---

## Using Base

### With the scaffold script

```bash
node base/scripts/scaffold.js --domain ml --output ~/projects/my-project
```

This copies base into `~/projects/my-project/.claude/`, then copies the `ml` domain on
top. Conflicts are resolved in favor of the domain. The domain's `CLAUDE.md` is placed
at the project root.

### Manually

```bash
# Copy base into your project
cp -r base/* my-project/.claude/

# Copy your chosen domain on top
cp -r ml/* my-project/.claude/

# Copy the domain's CLAUDE.md to the project root
cp ml/CLAUDE.md my-project/CLAUDE.md
```

Then open `my-project/CLAUDE.md` and fill in the placeholders — project name, languages,
frameworks, and repository URL.

### Validating a domain

```bash
node base/scripts/validate.js path/to/domain
```

Checks structure (8 folders), content (skill frontmatter, agent allowed-tools), and
security (no secrets, no eval in hooks). Exit code 0 = pass, 1 = failures found.

---

## Running Tests

```bash
node base/tests/scaffold.test.js
```

Runs 11 tests covering both `scaffold.js` and `validate.js`. No test framework
required — uses Node.js built-in `assert`. Tests create temporary directories, run the
scripts, and verify output.
