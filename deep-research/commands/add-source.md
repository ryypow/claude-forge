# /add-source

Interactively configure a new paper source and add it to `sources.yml`.

## Steps

1. **Get source details** — ask the user for:
   - Source name (kebab-case identifier, e.g. `my-internal-api`)
   - Source type (`arxiv-api`, `semantic-scholar-api`, `rest-api`, `local-folder`, `rss-feed`)
   - Connection details (URL, API key env var name, path — varies by type)

2. **Validate the source type** — confirm all required fields for the type are provided. Refer to `skills/source-configuration/SKILL.md` for required fields per type. If any required fields are missing, ask for them before proceeding.

3. **Test the connection** — before writing to sources.yml, run a test query:
   - `rest-api` / `arxiv-api` / `semantic-scholar-api`: fetch one result for query "artificial intelligence"
   - `local-folder`: list files in the path; confirm at least one file is found
   - `rss-feed`: fetch the feed and confirm at least one item is returned

   If the test fails, report the error with the response or filesystem message. Do not write to sources.yml until the connection succeeds.

4. **Write to sources.yml** — append the new source block to the `sources` list. Set `enabled: true` if the test passed.

5. **Confirm** — display the block that was written and confirm it is correct.

## Output

```
Source added: <name>

Type:    <type>
Status:  enabled
Test:    1 result returned for "artificial intelligence"

Block written to sources.yml:
---
  - name: <name>
    type: <type>
    ...
    enabled: true
---

Run /deep-dive to include this source in the next research session.
```

## Notes

- API keys must be stored as environment variables, not in sources.yml. The command will warn if the user tries to enter a key value directly and prompt for the env var name instead.
- Adding a source does not trigger a new search. The source will be included in the next `/deep-dive` run.
