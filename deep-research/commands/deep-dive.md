# /deep-dive

Run the full deep research pipeline on a topic: scope → search → analyze → store → catalog.

## Usage

```
/deep-dive <topic or research question>
```

Examples:
- `/deep-dive AI agent memory mechanisms`
- `/deep-dive retrieval augmented generation for LLMs`
- `/deep-dive multi-agent coordination protocols`

## Steps

1. **Scope the topic** — invoke `topic-scoper` with the topic. Present the search plan to the user. Wait for approval or adjustments before proceeding. Do not skip this confirmation step.

2. **Search sources** — invoke `source-searcher` with the approved search plan. Display the candidate count per source and total after deduplication.

3. **Confirm paper count** — present the candidate count to the user. If > 50 papers, suggest filtering (e.g. by date range, citation threshold, or sub-theme) before proceeding to analysis. Analysis of 50+ papers in one session is possible but slow — let the user decide.

4. **Analyze papers** — invoke `paper-analyzer` for each candidate. Process papers in order of search score (highest first). For each paper: display the paper title and arXiv ID as it begins analysis. After all papers, report: N analyzed, M failed (with reasons).

5. **Store knowledge** — invoke `knowledge-graph-builder` with all JSON output blocks from step 4. Report: N nodes created, M relationships created, K papers skipped.

6. **Generate catalog** — invoke `catalog-generator`. Report: N themes, M papers in catalog.

7. **Report completion** — print final summary:

```
/deep-dive complete

Topic: [topic]
Papers found:    N
Papers analyzed: M
Papers stored:   K

Knowledge graph: [Neo4j node count] papers, [relationship count] relationships
Catalog:         [theme count] themes, [paper count] papers

Output files:
  catalog.md
  catalog.json
```

## Flags

- `--no-confirm` — skip the search plan confirmation (for automated use)
- `--max-papers N` — cap analysis at N papers (default: unlimited)
- `--date-from YYYY` — filter to papers from this year onwards
- `--min-citations N` — filter to papers with at least N citations

## Notes

- If the knowledge graph already contains papers from a previous run on the same topic, `knowledge-graph-builder` will upsert rather than duplicate. Re-running `/deep-dive` on the same topic extends the existing graph.
- If any pipeline step fails, the command reports the failure and stops. Previously stored papers are not lost — fix the issue and resume from the failed step using individual commands.
