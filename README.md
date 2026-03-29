# Claude Forge

**Forging Claude into a specialist with domain-specific templates.**

Claude Code starts every session from scratch — no memory of your stack, your conventions,
or your workflows. Claude Forge fixes that. Pick a domain template, scaffold it into your
project, and Claude is ready to work the way you work from the first prompt.

Each template is an opinionated, domain-specific configuration: agents that know how to
review your code, skills that encode your best practices, commands that automate your
common tasks, and hooks that catch mistakes before they happen.

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
| Deep Research | `deep-research/` | Topic investigation, paper analysis, knowledge graphs |
| Machine Learning | `ml/` | Experiment tracking, model evaluation, data pipelines |
| DevOps | `devops/` | CI/CD, infrastructure, deployment, incident response |
| Data Engineering | `data-engineering/` | ETL, warehousing, orchestration, data contracts |
| Solutions Architecture | `solutions-architecture/` | System design, ADRs, trade-off analysis |
| API / Backend | `api-backend/` | REST/GraphQL APIs, services, databases, auth |
| Frontend | `frontend/` | UI components, accessibility, performance, design systems |
| Embedded Systems | `embedded/` | Bare-metal C/Rust, RTOS, hardware interfaces, safety |

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

## Project Structure

```
claude-templates/
│
├── deep-research/                          # Topic investigation, knowledge graphs, catalog generation
│   ├── CLAUDE.md                           # 5-phase workflow, source config, knowledge store context
│   ├── agents/
│   │   ├── topic-scoper.md                 # Maps topic to search plan: sub-themes, arXiv categories
│   │   ├── paper-analyzer.md               # Deep 10-section paper analysis + JSON output block
│   │   ├── source-searcher.md              # Multi-source search, deduplication, ranking
│   │   ├── knowledge-graph-builder.md      # Writes to Neo4j + pgvector
│   │   ├── catalog-generator.md            # Produces catalog.md + catalog.json from graph
│   │   └── knowledge-query.md              # NL → Cypher + pgvector queries
│   ├── skills/
│   │   ├── search-strategy/
│   │   │   └── SKILL.md                    # arXiv taxonomy, keyword expansion, Boolean search
│   │   ├── source-configuration/
│   │   │   └── SKILL.md                    # Adding sources to sources.yml
│   │   ├── knowledge-graph-patterns/
│   │   │   └── SKILL.md                    # Neo4j schema, Cypher patterns, pgvector queries
│   │   └── catalog-formatting/
│   │       └── SKILL.md                    # Description standards, catalog.json schema
│   ├── commands/
│   │   ├── deep-dive.md                    # /deep-dive — full pipeline: scope → search → store → catalog
│   │   ├── add-source.md                   # /add-source — configure a new source
│   │   ├── find-related.md                 # /find-related — graph + semantic similarity lookup
│   │   └── export-catalog.md               # /export-catalog — regenerate catalog from graph
│   ├── hooks/
│   │   ├── pre-store.sh                    # Validate required fields before graph writes
│   │   └── post-search.sh                  # Log search stats after source-searcher runs
│   ├── rules/
│   │   ├── source-integrity.md             # No papers stored from title alone
│   │   ├── knowledge-graph-schema.md       # Required properties, naming, no orphan nodes
│   │   └── catalog-standards.md            # Description length, theme minimums, badge format
│   ├── mcp-configs/
│   │   ├── arxiv.json                      # arXiv API (primary source)
│   │   ├── neo4j.json                      # Neo4j structural knowledge graph
│   │   ├── pgvector.json                   # pgvector semantic similarity store
│   │   └── brave-search.json               # Brave Search for non-arXiv sources
│   ├── scripts/
│   │   └── setup-env.js                    # Docker Compose setup or existing-instance config
│   ├── sources.yml                         # Extensible source config (arXiv default, others commented)
│   └── tests/
│       └── hooks.test.js                   # Tests for pre-store.sh and post-search.sh
│
├── base/                                   # Shared foundation (merged into all templates)
│   ├── CLAUDE.md                           # Universal instructions loaded every session
│   │                                       # Includes: language context (Python, TS/JS, Rust, C),
│   │                                       # security-sentinel proactive instruction,
│   │                                       # and composition rules for domain overrides
│   ├── agents/
│   │   ├── code-reviewer.md                # Balanced review across Python/TS/Rust/C
│   │   │                                   # Flags bad patterns, not style preferences
│   │   ├── planner.md                      # Task decomposition before touching code
│   │   │                                   # Forces spec before implementation
│   │   ├── debugger.md                     # Systematic root cause analysis
│   │   │                                   # Stack traces, bisecting, hypothesis testing
│   │   ├── git-agent.md                    # PR descriptions, conventional commits,
│   │   │                                   # branch naming, changelog entries
│   │   └── security-sentinel.md            # Proactive critical-issue monitor
│   │                                       # Narrow scope: secrets, injection, unsafe memory
│   │                                       # Fires unprompted on critical finds only
│   ├── skills/
│   │   ├── git-workflow/
│   │   │   └── SKILL.md                    # Branch → PR → merge conventions
│   │   ├── code-review/
│   │   │   └── SKILL.md                    # Balanced review checklist: what to flag vs. let go
│   │   ├── security-hygiene/
│   │   │   └── SKILL.md                    # Baseline rules: no secrets, input validation,
│   │   │                                   # safe C patterns, dependency pinning
│   │   └── debugging/
│   │       └── SKILL.md                    # Systematic debugging methodology per language
│   ├── commands/
│   │   ├── plan.md                         # /plan — decompose a task before implementing
│   │   ├── review.md                       # /review — full on-demand code audit
│   │   ├── commit.md                       # /commit — staged commit with conventional message
│   │   ├── audit.md                        # /audit — full security + best-practices sweep
│   │   └── standup.md                      # /standup — summarize what changed this session
│   ├── hooks/
│   │   ├── pre-tool-use.sh                 # Pattern matching only, fast, blocks on certainty:
│   │   │                                   # secrets regex, banned C functions, eval(),
│   │   │                                   # destructive ops (rm -rf, prod writes)
│   │   └── session-summary.sh              # Appends brief session log to history file
│   ├── rules/
│   │   ├── git-conventions.md              # Hard rules: commit format, branch naming, PR requirements
│   │   ├── code-quality.md                 # Complexity limits, naming, documentation thresholds
│   │   └── security-baseline.md            # Non-negotiables: no hardcoded secrets, no eval,
│   │                                       # memory safety flags for C, input validation
│   ├── mcp-configs/
│   │   ├── github.json                     # PR management, issue tracking, code search
│   │   └── context7.json                   # Live documentation lookup across all languages
│   ├── scripts/
│   │   ├── scaffold.js                     # Merges base + domain into a new project
│   │   └── validate.js                     # Validates template structure integrity
│   └── tests/
│       └── scaffold.test.js                # Tests for the scaffold and validate scripts
│
├── ml/                                     # Machine learning and data science
│   ├── CLAUDE.md                           # ML-specific context: experiment conventions,
│   │                                       # framework preferences, reproducibility rules
│   ├── agents/
│   │   ├── experiment-tracker.md           # Tracks runs, hyperparameters, and results
│   │   ├── data-validator.md               # Dataset integrity and schema validation
│   │   └── model-evaluator.md              # Evaluation metrics and benchmark agent
│   ├── skills/
│   │   ├── experiment-design/
│   │   │   └── SKILL.md                    # Hypothesis → experiment → analysis workflow
│   │   ├── data-pipeline/
│   │   │   └── SKILL.md                    # ETL patterns, feature engineering conventions
│   │   └── model-eval/
│   │       └── SKILL.md                    # Evaluation frameworks and metric selection
│   ├── commands/
│   │   ├── new-experiment.md               # /new-experiment — scaffold a new run
│   │   ├── eval.md                         # /eval — run evaluation suite on current model
│   │   └── compare.md                      # /compare — diff two experiment results
│   ├── hooks/
│   │   ├── pre-train.sh                    # Validate data and config before training starts
│   │   └── post-experiment.sh              # Log results and update experiment registry
│   ├── rules/
│   │   ├── experiment-tracking.md          # Mandatory logging, reproducibility requirements
│   │   └── data-handling.md                # PII rules, data versioning, split integrity
│   ├── mcp-configs/
│   │   ├── wandb.json                      # Weights & Biases experiment tracking
│   │   └── huggingface.json                # HuggingFace Hub model and dataset access
│   ├── scripts/
│   │   └── setup-env.js                    # Python venv, dependency, and CUDA setup
│   └── tests/
│       └── pipeline.test.js                # Tests for data pipeline utilities
│
├── devops/                                 # CI/CD, infrastructure, and platform engineering
│   ├── CLAUDE.md                           # Infra conventions, cloud provider context,
│   │                                       # deployment philosophy, on-call standards
│   ├── agents/
│   │   ├── pipeline-designer.md            # CI/CD pipeline authoring and review
│   │   ├── infra-planner.md                # Infrastructure change planning and blast radius
│   │   └── incident-responder.md           # Runbook-driven incident response guide
│   ├── skills/
│   │   ├── ci-cd-patterns/
│   │   │   └── SKILL.md                    # Pipeline design, caching, parallelism, gates
│   │   ├── iac-patterns/
│   │   │   └── SKILL.md                    # Terraform, Pulumi, CloudFormation conventions
│   │   └── observability/
│   │       └── SKILL.md                    # Logging, metrics, alerting, and SLO patterns
│   ├── commands/
│   │   ├── dry-run.md                      # /dry-run — plan infra changes before applying
│   │   ├── incident.md                     # /incident — open a structured incident runbook
│   │   └── pipeline.md                     # /pipeline — scaffold a new CI/CD workflow
│   ├── hooks/
│   │   ├── pre-apply.sh                    # Validate and plan before infra changes
│   │   └── post-deploy.sh                  # Health check and rollback trigger
│   ├── rules/
│   │   ├── infra-change.md                 # Approval gates, blast radius, rollback plan
│   │   └── pipeline-standards.md           # Required stages, secret management, artifact rules
│   ├── mcp-configs/
│   │   ├── aws.json                        # AWS resource management
│   │   ├── terraform-cloud.json            # Terraform Cloud workspace access
│   │   └── pagerduty.json                  # Incident and on-call management
│   ├── scripts/
│   │   └── setup-env.js                    # Tool version checks and credential validation
│   └── tests/
│       └── hooks.test.js                   # Tests for pre-apply and post-deploy hooks
│
├── data-engineering/                       # ETL, warehousing, and pipeline orchestration
│   ├── CLAUDE.md                           # Data stack context, warehouse conventions,
│   │                                       # orchestration tool, data contract standards
│   ├── agents/
│   │   ├── pipeline-reviewer.md            # ETL logic, idempotency, and error handling review
│   │   ├── schema-designer.md              # Data model and schema design agent
│   │   └── data-quality-monitor.md         # Freshness, completeness, and anomaly detection
│   ├── skills/
│   │   ├── pipeline-patterns/
│   │   │   └── SKILL.md                    # Idempotency, backfill, partitioning conventions
│   │   ├── dbt-patterns/
│   │   │   └── SKILL.md                    # Model structure, testing, documentation standards
│   │   └── data-contracts/
│   │       └── SKILL.md                    # Schema contracts, versioning, and SLA definitions
│   ├── commands/
│   │   ├── new-pipeline.md                 # /new-pipeline — scaffold with tests and docs
│   │   ├── backfill.md                     # /backfill — plan and validate a backfill run
│   │   └── data-check.md                   # /data-check — run quality checks on a dataset
│   ├── hooks/
│   │   ├── pre-run.sh                      # Validate upstream dependencies before pipeline run
│   │   └── post-run.sh                     # Log row counts, duration, and quality metrics
│   ├── rules/
│   │   ├── idempotency.md                  # All pipelines must be safely re-runnable
│   │   └── data-quality.md                 # Freshness SLAs, null thresholds, test requirements
│   ├── mcp-configs/
│   │   ├── snowflake.json                  # Snowflake warehouse access and query execution
│   │   ├── dbt-cloud.json                  # dbt Cloud job management and lineage
│   │   └── airflow.json                    # Airflow DAG management and run history
│   ├── scripts/
│   │   └── setup-env.js                    # Warehouse connection and tool version setup
│   └── tests/
│       └── pipeline.test.js                # Tests for pipeline utilities and hooks
│
├── solutions-architecture/                 # System design, ADRs, and trade-off analysis
│   ├── CLAUDE.md                           # Architecture principles, diagramming conventions,
│   │                                       # ADR format, decision-making framework
│   ├── agents/
│   │   ├── system-designer.md              # End-to-end system design with trade-off analysis
│   │   ├── adr-writer.md                   # Architecture Decision Record authoring agent
│   │   └── capacity-planner.md             # Load estimation and scaling analysis
│   ├── skills/
│   │   ├── system-design/
│   │   │   └── SKILL.md                    # Requirements → constraints → design workflow
│   │   ├── adr-process/
│   │   │   └── SKILL.md                    # ADR format, when to write one, review process
│   │   └── trade-off-analysis/
│   │       └── SKILL.md                    # Structured comparison of architectural options
│   ├── commands/
│   │   ├── design.md                       # /design — scaffold a system design document
│   │   ├── adr.md                          # /adr — create a new Architecture Decision Record
│   │   └── capacity.md                     # /capacity — run a back-of-envelope capacity estimate
│   ├── hooks/
│   │   └── session-summary.sh              # Append design decisions to architecture log
│   ├── rules/
│   │   ├── adr-standards.md                # Required sections, approval process, storage location
│   │   └── design-principles.md            # Core architectural principles and anti-patterns
│   ├── mcp-configs/
│   │   ├── confluence.json                 # Architecture docs and decision log storage
│   │   └── lucidchart.json                 # Diagramming and architecture visualization
│   ├── scripts/
│   │   └── setup-env.js                    # Diagramming tools and doc platform setup
│   └── tests/
│       └── hooks.test.js                   # Tests for session summary and export hooks
│
├── api-backend/                            # REST/GraphQL APIs, services, and databases
│   ├── CLAUDE.md                           # API design conventions, auth patterns,
│   │                                       # database access rules, error handling standards
│   ├── agents/
│   │   ├── api-designer.md                 # Endpoint design, versioning, and contract review
│   │   ├── db-reviewer.md                  # Query performance, migration safety, index review
│   │   └── auth-auditor.md                 # Authentication and authorization pattern review
│   ├── skills/
│   │   ├── api-design/
│   │   │   └── SKILL.md                    # REST/GraphQL conventions, versioning, error formats
│   │   ├── db-patterns/
│   │   │   └── SKILL.md                    # Query patterns, migration conventions, connection pooling
│   │   └── auth-patterns/
│   │       └── SKILL.md                    # JWT, OAuth, RBAC implementation patterns
│   ├── commands/
│   │   ├── new-endpoint.md                 # /new-endpoint — scaffold with validation and tests
│   │   ├── migration.md                    # /migration — generate and review a DB migration
│   │   └── load-test.md                    # /load-test — design a load test for an endpoint
│   ├── hooks/
│   │   ├── pre-migration.sh                # Validate migration safety before applying
│   │   └── pre-commit.sh                   # Type-check, lint, and test before commit
│   ├── rules/
│   │   ├── api-standards.md                # Versioning, pagination, error response format
│   │   ├── db-safety.md                    # Migration rules, query review, no raw SQL from input
│   │   └── auth-requirements.md            # Auth on all endpoints, token expiry, scope validation
│   ├── mcp-configs/
│   │   └── postman.json                    # API collection management and testing
│   ├── scripts/
│   │   └── setup-env.js                    # Database, environment, and dependency setup
│   └── tests/
│       └── hooks.test.js                   # Tests for migration and pre-commit hooks
│
├── frontend/                               # UI components, accessibility, and design systems
│   ├── CLAUDE.md                           # Component conventions, styling approach,
│   │                                       # framework context, accessibility requirements
│   ├── agents/
│   │   ├── component-reviewer.md           # Component design, prop API, and reusability review
│   │   ├── a11y-auditor.md                 # Accessibility compliance and WCAG review
│   │   └── perf-auditor.md                 # Bundle size, render performance, Core Web Vitals
│   ├── skills/
│   │   ├── component-design/
│   │   │   └── SKILL.md                    # Component patterns, prop conventions, composition
│   │   ├── testing-strategy/
│   │   │   └── SKILL.md                    # Unit, integration, and e2e test patterns
│   │   └── performance/
│   │       └── SKILL.md                    # Code splitting, lazy loading, render optimization
│   ├── commands/
│   │   ├── new-component.md                # /new-component — scaffold with tests and types
│   │   ├── tdd.md                          # /tdd — start a TDD cycle for a feature
│   │   └── e2e.md                          # /e2e — generate end-to-end test scenarios
│   ├── hooks/
│   │   ├── pre-commit.sh                   # Lint, type-check, and test before commit
│   │   └── post-build.sh                   # Bundle size check and asset validation
│   ├── rules/
│   │   ├── accessibility.md                # WCAG 2.1 AA compliance requirements
│   │   ├── component-standards.md          # Structure, naming, prop types, story requirements
│   │   └── performance-budgets.md          # Bundle size limits, LCP/CLS thresholds
│   ├── mcp-configs/
│   │   ├── figma.json                      # Design token and component spec access
│   │   └── vercel.json                     # Preview deployment and performance monitoring
│   ├── scripts/
│   │   └── setup-env.js                    # Node version, package manager, env setup
│   └── tests/
│       └── hooks.test.js                   # Tests for pre-commit and post-build hooks
│
└── embedded/                               # Bare-metal C/Rust, RTOS, and hardware interfaces
    ├── CLAUDE.md                           # Target hardware context, RTOS choice,
    │                                       # toolchain, safety standard (MISRA/CERT/etc.)
    ├── agents/
    │   ├── memory-safety-reviewer.md       # Buffer overflows, pointer safety, stack usage
    │   ├── rtos-designer.md                # Task design, priority, synchronization review
    │   └── hardware-interface-reviewer.md  # Register access, timing, interrupt safety
    ├── skills/
    │   ├── safe-c-patterns/
    │   │   └── SKILL.md                    # MISRA/CERT C rules, safe stdlib alternatives,
    │   │                                   # bounds checking, defensive coding
    │   ├── rtos-patterns/
    │   │   └── SKILL.md                    # Task structure, IPC, priority inversion avoidance
    │   └── hardware-abstractions/
    │       └── SKILL.md                    # HAL patterns, register access, peripheral drivers
    ├── commands/
    │   ├── new-driver.md                   # /new-driver — scaffold a hardware driver with tests
    │   ├── memory-check.md                 # /memory-check — audit stack and heap usage
    │   └── safety-review.md                # /safety-review — MISRA/CERT compliance sweep
    ├── hooks/
    │   ├── pre-build.sh                    # Static analysis (cppcheck/clippy) before build
    │   └── pre-tool-use.sh                 # Overrides base hook with stricter banned function
    │                                       # list: no malloc in ISR, no printf, no dynamic alloc
    ├── rules/
    │   ├── memory-safety.md                # No unbounded buffers, explicit size checks,
    │   │                                   # banned: gets, strcpy, sprintf, scanf
    │   ├── isr-constraints.md              # No blocking calls, no dynamic alloc in interrupts
    │   └── coding-standard.md              # MISRA C / CERT C rules in effect for this project
    ├── mcp-configs/
    │   └── openocd.json                    # On-chip debugging and flash programming access
    ├── scripts/
    │   └── setup-env.js                    # Toolchain, cross-compiler, and debugger setup
    └── tests/
        └── hooks.test.js                   # Tests for static analysis and safety hooks
```
