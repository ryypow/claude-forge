# /standup

Summarize what changed this session.

## Usage

```
/standup
```

## Steps

1. **Check git log** — find all commits made during this session (since session start or today).

2. **Check working state** — run `git status` to identify uncommitted changes.

3. **Summarize changes** — group by area/scope:
   - What was added (new files, features, tests)
   - What was changed (modifications, refactors, fixes)
   - What was removed

4. **Note open items** — anything started but not finished, known issues encountered, or next steps.

## Output Format

```markdown
## Standup — [date]

### Done
- [What was completed — one bullet per logical change]

### In Progress
- [What was started but not finished]

### Blockers
- [Anything that prevented progress]

### Next
- [Suggested next steps]
```

## Notes

- Keep it concise — this is a summary, not a changelog.
- Focus on what matters to the user, not internal details.
- If nothing was committed, summarize the uncommitted changes instead.
