## Knowledge Graph Schema

**Why:** A consistent schema ensures that queries written by `knowledge-query` and catalog queries written by `catalog-generator` always work without per-paper customization. Inconsistent property names, missing required fields, or orphan nodes produce silent query failures that are hard to debug.

**How to apply:** Apply these rules when `knowledge-graph-builder` is writing to Neo4j, when `knowledge-query` is constructing Cypher queries, and when reviewing stored data for integrity.

---

### Node naming

- Node labels: PascalCase — `Paper`, `Author`, `Topic`
- Relationship types: SCREAMING_SNAKE_CASE — `AUTHORED_BY`, `TAGGED_WITH`, `RELATED_TO`, `CITES`
- Property names: snake_case — `source_url`, `citation_count`, `analyzed_at`

### Required Paper node properties

The following properties must be present on every Paper node. Writing a Paper node without these is blocked by `hooks/pre-store.sh`:

| Property | Type | Description |
|---|---|---|
| `id` | String | arXiv ID (preferred) or DOI; used for MERGE uniqueness |
| `title` | String | Exact title from the fetched paper |
| `source` | String | `arxiv` \| `semantic-scholar` \| `local` \| `web` |
| `source_url` | String | URL that was actually fetched |
| `abstract` | String | Full abstract text |

### Optional but strongly recommended Paper properties

| Property | Type | Description |
|---|---|---|
| `date` | String | YYYY-MM or YYYY-MM-DD |
| `citation_count` | Integer | From Semantic Scholar or arXiv metadata |
| `methodology_type` | String | `empirical` \| `theoretical` \| `survey` \| `benchmark` \| `system` \| `proof-of-concept` |
| `overall_assessment` | String | `Strong` \| `Adequate` \| `Weak` |
| `code_available` | Boolean | Whether code was released |
| `analyzed_at` | String | ISO 8601 datetime of analysis |

### No orphan nodes

Every Paper node must have at least one `TAGGED_WITH` edge to a Topic node. A paper with no topic tags will not appear in any themed catalog section. If the topic cannot be determined from arXiv categories alone, assign a catch-all `"Uncategorized"` topic and flag for manual review.

### Embedding consistency

If a Paper node's `abstract` property is updated after an embedding was stored in pgvector, the embedding must be regenerated. Stale embeddings produce misleading similarity results. The `knowledge-graph-builder` sets `updated_at` on the pgvector row whenever it upserts a paper whose abstract has changed.

### Relationship directionality

- `(Paper)-[:CITES]->(Paper)` — source paper cites the target paper
- `(Paper)-[:AUTHORED_BY]->(Author)` — paper was written by author
- `(Paper)-[:TAGGED_WITH]->(Topic)` — paper belongs to this topic
- `(Paper)-[:RELATED_TO]-(Paper)` — no direction required; query without arrow
