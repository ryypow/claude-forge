---
name: knowledge-graph-patterns
description: Neo4j schema conventions, Cypher query patterns, and pgvector similarity queries for the deep-research knowledge store
domain: deep-research
triggers:
  - query the knowledge graph
  - cypher query
  - neo4j
  - pgvector
  - find related papers in the graph
  - semantic similarity search
  - knowledge graph schema
  - how do I query
  - vector search
  - graph traversal
---

## Overview

This skill covers the data model and query patterns for the two knowledge stores used in deep-research: Neo4j for structural relationships and pgvector for semantic similarity. Use it when writing or debugging queries, or when designing how to store a new type of knowledge.

Does not cover how to store papers (that is `knowledge-graph-builder`) or how to search for papers externally (that is `search-strategy`).

---

## Neo4j Schema

### Node labels and required properties

**Paper**
```
id: String          — arXiv ID (preferred) or DOI; unique, used for MERGE
title: String       — exact title
source: String      — "arxiv" | "semantic-scholar" | "local" | "web"
source_url: String  — URL that was fetched
abstract: String    — full abstract
date: String        — YYYY-MM or YYYY-MM-DD
citation_count: Integer
methodology_type: String   — empirical | theoretical | survey | benchmark | system | proof-of-concept
overall_assessment: String — Strong | Adequate | Weak
code_available: Boolean
analyzed_at: String — ISO 8601 datetime
```

**Author**
```
name: String            — display name
normalized_name: String — lowercase, deduplication key; unique
```

**Topic**
```
name: String   — topic label; unique
type: String   — "arxiv-category" | "theme" | "concept"
```

### Relationship types

```
(Paper)-[:AUTHORED_BY]->(Author)
(Paper)-[:TAGGED_WITH]->(Topic)
(Paper)-[:CITES]->(Paper)       — directional; source cites target
(Paper)-[:RELATED_TO]-(Paper)   — bidirectional; created by shared themes or explicit relationships
```

### Naming conventions

- Node labels: PascalCase (`Paper`, `Author`, `Topic`)
- Relationship types: SCREAMING_SNAKE_CASE (`AUTHORED_BY`, `TAGGED_WITH`)
- Property names: snake_case (`source_url`, `citation_count`)
- IDs: use arXiv ID format when available (`2401.12345`); fall back to DOI

---

## Cypher Query Patterns

### Find papers by theme

```cypher
MATCH (p:Paper)-[:TAGGED_WITH]->(t:Topic {type: "theme"})
WHERE toLower(t.name) CONTAINS toLower($keyword)
RETURN p.title, p.source_url, p.date, p.citation_count, t.name AS theme
ORDER BY p.citation_count DESC, p.date DESC
LIMIT 20
```

### Find papers related to a given paper

```cypher
MATCH (seed:Paper {id: $paper_id})-[:RELATED_TO]-(related:Paper)
RETURN related.title, related.source_url, related.date, related.citation_count
ORDER BY related.citation_count DESC
LIMIT 20
```

### Find papers that cite a given paper

```cypher
MATCH (citing:Paper)-[:CITES]->(cited:Paper {id: $paper_id})
RETURN citing.title, citing.source_url, citing.date
ORDER BY citing.date DESC
LIMIT 20
```

### Find papers by author

```cypher
MATCH (p:Paper)-[:AUTHORED_BY]->(a:Author)
WHERE toLower(a.normalized_name) CONTAINS toLower($author_name)
RETURN p.title, p.source_url, p.date, a.name AS author
ORDER BY p.date DESC
LIMIT 20
```

### Get all themes with paper counts

```cypher
MATCH (p:Paper)-[:TAGGED_WITH]->(t:Topic {type: "theme"})
RETURN t.name AS theme, count(p) AS paper_count
ORDER BY paper_count DESC
```

### Find papers shared between two themes

```cypher
MATCH (p:Paper)-[:TAGGED_WITH]->(t1:Topic {name: $theme1})
MATCH (p)-[:TAGGED_WITH]->(t2:Topic {name: $theme2})
RETURN p.title, p.source_url, p.date, p.citation_count
ORDER BY p.citation_count DESC
```

### Find most connected papers (by RELATED_TO degree)

```cypher
MATCH (p:Paper)-[r:RELATED_TO]-()
RETURN p.title, p.source_url, count(r) AS connections
ORDER BY connections DESC
LIMIT 10
```

### Upsert pattern (used by knowledge-graph-builder)

```cypher
MERGE (p:Paper {id: $id})
SET p += $properties           -- += merges without overwriting unlisted fields
SET p.updated_at = datetime()
```

---

## pgvector Patterns

### Schema

```sql
CREATE TABLE paper_embeddings (
  id SERIAL PRIMARY KEY,
  paper_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  abstract_embedding VECTOR(1536),   -- adjust for your embedding model
  summary_embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX paper_embeddings_abstract_idx
  ON paper_embeddings USING ivfflat (abstract_embedding vector_cosine_ops)
  WITH (lists = 100);
```

### Semantic similarity search

```sql
SELECT
  paper_id,
  title,
  1 - (abstract_embedding <=> $query_embedding::vector) AS similarity
FROM paper_embeddings
ORDER BY abstract_embedding <=> $query_embedding::vector
LIMIT 20;
```

`<=>` is cosine distance; `1 - distance` gives cosine similarity (higher = more similar).

### Filtered similarity search (combine with Neo4j result set)

```sql
SELECT
  paper_id,
  title,
  1 - (abstract_embedding <=> $query_embedding::vector) AS similarity
FROM paper_embeddings
WHERE paper_id = ANY($allowed_ids)   -- pass Neo4j result IDs as array
ORDER BY abstract_embedding <=> $query_embedding::vector
LIMIT 10;
```

---

## Combining Neo4j and pgvector

The most powerful queries combine both:

1. Run a Cypher query to get a filtered set of paper IDs (e.g. papers with tag X and > 50 citations)
2. Pass those IDs to pgvector as `$allowed_ids`
3. Rank by semantic similarity to the user's question within that filtered set

This gives: "papers semantically similar to my question, but only within the subset that also match structural criteria."

---

## When NOT to apply this skill

If you are writing papers to the graph, use the patterns in `knowledge-graph-builder`. If you are designing the catalog output, use `catalog-formatting`. If you are searching for new papers from external sources, use `search-strategy`.
