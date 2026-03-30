---
name: source-configuration
description: How to add, configure, and validate new sources in sources.yml for the deep-research domain
domain: deep-research
triggers:
  - add a source
  - configure a new source
  - how do I add a source
  - sources.yml
  - add my own source
  - connect to a new API
  - add local papers
  - new paper source
  - enable a source
  - custom source
---

## Overview

This skill covers how to extend the deep-research domain with new paper sources by editing `sources.yml`. The file lives at the domain root alongside `CLAUDE.md` and is read at runtime by the `source-searcher` agent — no code changes required to add a new source.

Does not cover executing searches (see `search-strategy`) or evaluating source quality (see `source-evaluation`).

---

## sources.yml structure

Each source is an entry in the `sources` list. The required fields are `name`, `type`, and `enabled`. Additional fields depend on the type.

```yaml
sources:
  - name: <unique identifier, kebab-case>
    type: <one of: arxiv-api | semantic-scholar-api | rest-api | local-folder | rss-feed>
    enabled: true | false
    # type-specific fields below
```

---

## Source types

### `arxiv-api`

Searches arXiv using the official API. No API key required.

```yaml
- name: arxiv
  type: arxiv-api
  base_url: https://export.arxiv.org/api/query
  default_categories: [cs.AI, cs.LG, cs.CL, cs.MA]
  max_results_per_query: 50
  enabled: true
```

**Fields:**
- `default_categories` — arXiv categories to filter by default (can be overridden per search)
- `max_results_per_query` — how many results to fetch per sub-theme query (default 50, max 2000)

---

### `semantic-scholar-api`

Searches Semantic Scholar. Works without an API key at low rate limits; add a key for higher throughput.

```yaml
- name: semantic-scholar
  type: semantic-scholar-api
  api_key: ${SEMANTIC_SCHOLAR_API_KEY}   # optional; omit line if not using
  max_results_per_query: 20
  enabled: false
```

**Fields:**
- `api_key` — use `${ENV_VAR_NAME}` syntax; never hardcode the value
- `max_results_per_query` — Semantic Scholar limits free tier to 100/request

---

### `rest-api`

A generic REST source. Use for any HTTP API that accepts a query parameter and returns JSON.

```yaml
- name: my-internal-api
  type: rest-api
  search_url: https://api.example.com/papers/search?q={query}&limit=20
  fetch_url: https://api.example.com/papers/{id}
  api_key: ${MY_API_KEY}
  response_mapping:
    title: data.title
    source_url: data.url
    abstract: data.abstract
    id: data.doi
    date: data.published_at
  enabled: false
```

**Fields:**
- `search_url` — URL template; `{query}` is replaced with the search string
- `fetch_url` — URL template for fetching a single paper; `{id}` is replaced with the paper ID
- `api_key` — use `${ENV_VAR_NAME}` syntax
- `response_mapping` — dot-notation paths mapping the API response fields to the standard schema

**response_mapping required fields:** `title`, `source_url`, `abstract`. If `id` is not mapped, the URL is used as the identifier.

---

### `local-folder`

Reads PDFs and Markdown files from a local directory. Useful for pre-downloaded papers, personal notes, or proprietary documents.

```yaml
- name: my-papers
  type: local-folder
  path: ~/papers/                   # absolute or ~ path; do not use relative paths
  file_types: [pdf, md, txt]
  recursive: true
  enabled: false
```

**Fields:**
- `path` — directory to scan
- `file_types` — extensions to include (default: pdf, md)
- `recursive` — whether to scan subdirectories (default: false)

Files are passed directly to `paper-analyzer` for analysis. Titles are derived from filenames (underscores/hyphens replaced with spaces, extension stripped). There is no search ranking for local sources — all files matching the query topic are returned.

---

### `rss-feed`

Monitors an RSS/Atom feed for new papers. Useful for conference proceedings feeds, journal table-of-contents feeds, or arXiv category new-submissions feeds.

```yaml
- name: arxiv-cs-ai-daily
  type: rss-feed
  url: https://rss.arxiv.org/rss/cs.AI
  max_items: 30
  enabled: false
```

**Fields:**
- `url` — RSS or Atom feed URL
- `max_items` — how many recent items to pull (default: 30)

---

## Validating a new source

After adding a source, test it before enabling:

1. Set `enabled: false` initially
2. Run `/add-source` — it will prompt for details and test the connection
3. Check that at least 1 result is returned for a test query
4. If the connection succeeds, set `enabled: true`

Manual test for a REST source:
```bash
curl -s "https://api.example.com/papers/search?q=test&limit=1" | jq .
```

---

## Credential conventions

- Always use `${ENV_VAR_NAME}` for API keys — never hardcode values in sources.yml
- Name environment variables with the source name as a prefix: `SEMANTIC_SCHOLAR_API_KEY`, `BRAVE_API_KEY`
- Document required env vars in the source comment so users know what to set

---

## When NOT to apply this skill

If you are executing a search (not configuring one), use `search-strategy` or invoke `source-searcher`. If you are evaluating whether a source is credible, use `source-evaluation`.
