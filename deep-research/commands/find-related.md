# /find-related

Query the knowledge graph for papers related to a given paper, concept, or abstract snippet.

## Usage

```
/find-related <arXiv ID | paper title | abstract text>
```

Examples:
- `/find-related 2401.12345`
- `/find-related "Attention Is All You Need"`
- `/find-related [paste abstract text]`

## Steps

1. **Identify the seed** — determine what the user provided:
   - arXiv ID (e.g. `2401.12345`) → look up by `Paper.id` in Neo4j
   - Paper title → fuzzy match against `Paper.title` in Neo4j; if no match, suggest running `/deep-dive` first
   - Abstract text / concept description → use pgvector semantic similarity only

2. **Run structural query (if seed is in graph)** — invoke `knowledge-query` to find:
   - Direct RELATED_TO edges (papers linked by shared themes)
   - Papers sharing the same author(s)
   - Papers in the same arXiv categories

3. **Run semantic query** — invoke `knowledge-query` for pgvector similarity search using the seed's abstract embedding (if in graph) or the provided text.

4. **Merge and rank** — combine structural and semantic results. Papers appearing in both lists get a boosted rank. Deduplicate by paper ID.

5. **Display results** — show top 20 ranked papers with: title, source link, date, citation count, and how they were found (structural match, semantic match, or both).

6. **Offer next steps** — ask: "Would you like to analyze any of these papers and add them to the knowledge graph?"

## Output

```
## Related papers: [seed title or ID]

Found via graph traversal: N papers
Found via semantic similarity: M papers
After merging: K unique results

| # | Title | Date | Citations | Match type |
|---|-------|------|-----------|------------|
| 1 | [Title](url) | 2024-03 | 142 | structural + semantic |
| 2 | [Title](url) | 2024-01 | 89 | semantic |
...

Analyze and store any of these? (yes/no — specify paper numbers)
```

## Notes

- If the knowledge graph is empty, reports: "No papers in the knowledge graph yet. Run `/deep-dive` to populate it first."
- This command reads from the graph only — it does not fetch new papers from external sources.
