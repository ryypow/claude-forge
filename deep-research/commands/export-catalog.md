# /export-catalog

Regenerate `catalog.md` and `catalog.json` from the stored knowledge graph without re-fetching or re-analyzing papers.

## Usage

```
/export-catalog [--theme <theme-name>] [--min-citations N]
```

Use this command after:
- Adding papers via `/find-related` and wanting to update the catalog
- Running `/deep-dive` on a new sub-topic that adds to an existing graph
- Changing catalog formatting standards and wanting to regenerate all descriptions

## Steps

1. **Check the graph is populated** — query Neo4j for total paper count. If 0, report: "Knowledge graph is empty. Run `/deep-dive` to populate it first." and stop.

2. **Apply filters (if flags provided)**:
   - `--theme <name>` → only include papers tagged with this theme
   - `--min-citations N` → exclude papers with fewer than N citations

3. **Invoke `catalog-generator`** — pass the filtered paper set. The generator reads from Neo4j, generates descriptions, and writes both output files.

4. **Report completion**:

```
/export-catalog complete

Themes: N
Papers: M (K excluded by filters, if any)

Files written:
  catalog.md   (updated)
  catalog.json (updated)
```

## Notes

- This command overwrites the existing `catalog.md` and `catalog.json`. If you want to preserve a previous version, rename it first.
- Descriptions are regenerated from stored analysis data each time. If the stored data has been updated (e.g. a paper's citation count changed), the new catalog reflects that.
- The `--theme` flag accepts partial matches: `--theme agent` will match "Agent Memory Mechanisms" and "Multi-Agent Coordination".
