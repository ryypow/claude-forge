# Deep Research

A Claude Code domain template for conducting structured, in-depth research into any topic. Feed it a question, and it searches arXiv (and any other sources you configure), analyzes each paper in depth, stores the extracted knowledge in a graph database, and produces a clean catalog you can share or publish.

---

## What you get

- **Search across sources** — arXiv by default, extensible to Semantic Scholar, Brave Search, local PDF folders, RSS feeds, or any REST API
- **Deep paper analysis** — each paper is broken down into 10 structured sections: research question, methodology, key findings, limitations, quotable passages, and more
- **Persistent knowledge graph** — papers, authors, topics, and their relationships stored in Neo4j; semantic embeddings in pgvector for similarity search
- **Publishable catalog** — themed markdown catalog with detailed descriptions, arXiv badges, and a machine-readable JSON sidecar
- **Queryable knowledge** — ask questions in plain English and get answers from your stored research graph

---

## Quick start

### 1. Prerequisites

- [Claude Code](https://claude.ai/code) installed and configured
- [Docker Desktop](https://docker.com) (for the knowledge store — Neo4j + pgvector)
- Node.js 18+

### 2. Set up a project

```bash
# Create a new project
mkdir my-research && cd my-research

# Copy the deep-research template into your project
# (or use the scaffold script once base/ is complete)
cp -r /path/to/claude-templates/deep-research/.  .claude/
cp /path/to/claude-templates/deep-research/CLAUDE.md ./CLAUDE.md
cp /path/to/claude-templates/deep-research/sources.yml ./sources.yml
```

### 3. Start the knowledge store

```bash
node .claude/scripts/setup-env.js
```

Choose **Docker** when prompted. This generates a `docker-compose.yml` and starts Neo4j + pgvector containers locally. You'll get:

- Neo4j browser at http://localhost:7474
- pgvector (PostgreSQL) at localhost:5432

### 4. Fill in CLAUDE.md

Open `CLAUDE.md` and fill in the placeholders at the top:

```markdown
**Project:** my-ai-agents-research
**Research focus:** AI agent architectures and capabilities
**Primary sources:** arXiv (default)
**Knowledge store:** Neo4j + pgvector (Docker)
```

### 5. Run your first deep dive

Open Claude Code in your project directory and type:

```
/deep-dive AI agent memory mechanisms
```

Claude will:
1. Break your topic into sub-themes and build a search plan
2. Ask you to approve the plan before searching
3. Search arXiv for relevant papers
4. Analyze each paper in depth
5. Store everything in the knowledge graph
6. Generate `catalog.md` and `catalog.json`

---

## Commands

| Command | What it does |
|---------|-------------|
| `/deep-dive <topic>` | Full pipeline: scope, search, analyze, store, generate catalog |
| `/add-source` | Add a new paper source (Semantic Scholar, local folder, RSS feed, etc.) |
| `/find-related <paper>` | Find papers related to a specific arXiv ID or title in your graph |
| `/export-catalog` | Regenerate the catalog from your stored knowledge (no re-fetching) |

---

## Adding sources

By default, only arXiv is enabled. To add more sources, either:

**Option A — Edit `sources.yml` directly:**

Uncomment one of the example blocks and fill in your details. For example, to enable Semantic Scholar:

```yaml
  - name: semantic-scholar
    type: semantic-scholar-api
    api_key: ${SEMANTIC_SCHOLAR_API_KEY}
    max_results_per_query: 20
    enabled: true
```

Then set the environment variable:
```bash
export SEMANTIC_SCHOLAR_API_KEY=your-key-here
```

**Option B — Use the interactive command:**

```
/add-source
```

Claude will walk you through the setup, test the connection, and write the config for you.

### Supported source types

| Type | Description | Auth required? |
|------|-------------|---------------|
| `arxiv-api` | arXiv official API | No |
| `semantic-scholar-api` | Semantic Scholar paper database | Optional (higher rate limits) |
| `brave-search` | Web search filtered to academic sites | Yes (API key) |
| `rest-api` | Any HTTP API that returns JSON | Depends on API |
| `local-folder` | Local directory of PDFs or markdown | No |
| `rss-feed` | RSS/Atom feed (journal alerts, arXiv daily) | No |

---

## Knowledge store

### Why two databases?

| Store | What it answers | Example |
|-------|----------------|---------|
| **Neo4j** (graph) | How are things connected? | "Papers that cite X", "Co-authors of Y", "All papers tagged with topic Z" |
| **pgvector** (vectors) | What things are similar? | "Papers similar to this abstract", "Cluster papers by topic" |

Together they enable hybrid queries: "Find papers semantically similar to X that are also highly cited" (vector similarity + graph filter).

### Managing the store

```bash
# Start containers
docker compose up -d

# Stop containers (data is preserved in Docker volumes)
docker compose stop

# View Neo4j browser
open http://localhost:7474

# Reset everything (destroys all data)
docker compose down -v
```

---

## Project structure

After setup, your project looks like:

```
my-research/
├── CLAUDE.md              # Domain config (edit the placeholders)
├── sources.yml            # Which sources to search
├── docker-compose.yml     # Generated by setup-env.js
├── .env                   # Connection credentials (never commit this)
├── .env.example           # Template for .env
├── catalog.md             # Generated — your research catalog
├── catalog.json           # Generated — machine-readable catalog
└── .claude/
    ├── agents/            # 6 specialized research agents
    ├── skills/            # 6 research methodology skills
    ├── commands/          # 4 research commands
    ├── hooks/             # 2 quality guard hooks
    ├── rules/             # 3 integrity and quality rules
    ├── mcp-configs/       # 4 MCP tool integrations
    ├── scripts/           # Setup and infrastructure
    └── tests/             # Hook tests
```

---

## Tips

- **Start narrow.** `/deep-dive transformer attention mechanisms` will produce better results than `/deep-dive AI`. The topic-scoper helps, but garbage in = garbage out.
- **Review the search plan.** Claude shows you the plan before searching. Adjust sub-themes and categories if they don't match what you're looking for.
- **Cap paper count for demos.** Use `/deep-dive --max-papers 10 <topic>` to limit analysis to 10 papers. Full runs can take a while.
- **Build incrementally.** Run `/deep-dive` on sub-topics across multiple sessions. The knowledge graph accumulates — each run adds to the existing data.
- **Query your graph.** After storing papers, use `/find-related` or just ask: "What papers in my graph discuss X?"
- **Add your own papers.** Point a `local-folder` source at a directory of PDFs you've already downloaded.

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Docker containers won't start | Run `docker compose logs` to see errors. Common: port 7474 or 5432 already in use. |
| arXiv API rate limited | The API allows 3 requests/second. Source-searcher adds delays, but large searches may hit limits. Wait 30 seconds and retry. |
| Neo4j connection refused | Check that containers are running: `docker compose ps`. Verify `.env` has the correct `NEO4J_URI`. |
| No results for a topic | Try broadening the search: remove date filters, add more arXiv categories, or enable Semantic Scholar as a second source. |
| Catalog has too many "Other" papers | Your topic may need more specific sub-themes. Re-run `/deep-dive` with a narrower focus. |
