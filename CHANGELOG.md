# Changelog

All notable changes to claude-kit are recorded here.
Format: `[domain@version] — YYYY-MM-DD`, with Added / Changed / Removed / Security sections.

---

## [deep-research@1.0.0] — 2026-03-26

### Added
- `deep-research/CLAUDE.md` — domain context: 5-phase workflow, source config, knowledge store, catalog format
- `agents/topic-scoper.md` — maps topic to structured search plan with arXiv categories + Boolean strings
- `agents/paper-analyzer.md` — deep 10-section paper analysis + JSON output block for knowledge-graph-builder
- `agents/source-searcher.md` — multi-source search execution, deduplication, ranking
- `agents/knowledge-graph-builder.md` — writes to Neo4j (Paper/Author/Topic nodes + relationships) and pgvector
- `agents/catalog-generator.md` — produces catalog.md (themed, collapsible) + catalog.json sidecar
- `agents/knowledge-query.md` — translates NL questions to Cypher + pgvector queries
- `skills/search-strategy/SKILL.md` — arXiv category taxonomy, keyword expansion, Boolean search patterns
- `skills/source-configuration/SKILL.md` — adding and validating new sources in sources.yml
- `skills/knowledge-graph-patterns/SKILL.md` — Neo4j schema, Cypher patterns, pgvector similarity queries
- `skills/catalog-formatting/SKILL.md` — description writing standards, catalog.md format, catalog.json schema
- `commands/deep-dive.md` — `/deep-dive` full pipeline command
- `commands/add-source.md` — `/add-source` interactive source configuration
- `commands/find-related.md` — `/find-related` knowledge graph + semantic similarity lookup
- `commands/export-catalog.md` — `/export-catalog` regenerate catalog from stored knowledge
- `hooks/pre-store.sh` — validates required fields before writing to Neo4j or pgvector
- `hooks/post-search.sh` — logs search stats after source-searcher runs
- `rules/source-integrity.md` — no papers stored from title alone; all sources must be fetchable
- `rules/knowledge-graph-schema.md` — required node/edge properties, naming conventions, no orphan nodes
- `rules/catalog-standards.md` — description length/content rules, theme section minimums, badge format
- `mcp-configs/arxiv.json` — arXiv API (primary paper source)
- `mcp-configs/neo4j.json` — Neo4j structural knowledge graph
- `mcp-configs/pgvector.json` — pgvector semantic similarity store
- `mcp-configs/brave-search.json` — Brave Search for non-arXiv sources
- `scripts/setup-env.js` — interactive setup: Docker Compose generation or existing-instance config
- `sources.yml` — extensible source config with arXiv enabled, others commented as examples
- `tests/hooks.test.js` — test suite for pre-store.sh and post-search.sh

## [base@1.1.0] — 2026-03-26

### Added
- `base/skills/research-methodology/SKILL.md` — engineering investigation skill: spike methodology for technical decisions
- `base/commands/spike.md` — `/spike` command: structured options evaluation before implementation

---

## [base@1.0.0] — 2026-03-25

### Added
- Initial `.claude/` tooling layer for the claude-templates repo itself
- Five meta-agents: `template-architect`, `skill-author`, `agent-author`, `domain-reviewer`, `template-verifier`
- Three repo skills: `domain-design`, `skill-authoring`, `template-conventions`
- Seven commands: `/new-domain`, `/new-skill`, `/new-agent`, `/review-domain`, `/sync-base`, `/release`, `/verify`
- `hooks/pre-tool-use.sh` — pattern-matching guard for secrets, banned shell patterns, and unsafe writes
- `versions.json` — initial version state for all 8 user-facing domains at 1.0.0
