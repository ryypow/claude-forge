# /review

Run a full code review on current changes.

## Usage

```
/review
/review <file or directory>
```

Examples:
- `/review` — review all uncommitted changes
- `/review src/auth/` — review only the auth module
- `/review src/api/handler.ts` — review a specific file

## Steps

1. **Identify scope** — if no path is given, run `git diff` to find all changed files. If a path is given, review only that path.

2. **Read every changed file** — read the full diff and the surrounding context. Do not review code you haven't read.

3. **Check for bugs** — logic errors, off-by-one, null access, race conditions, resource leaks, incorrect error handling.

4. **Check for security issues** — injection, secrets, missing validation, disabled security controls. Reference the `security-hygiene` skill.

5. **Check for correctness** — does the code do what it claims? Are edge cases handled?

6. **Check for maintainability** — only flag severe issues (function doing 5 things, deeply nested logic). Do not flag style preferences.

7. **Produce structured output** — categorize findings by severity. Always include at least one positive observation.

## Output Format

```markdown
## Code Review

**Scope:** [files reviewed]

### Critical (must fix)
- `file:line` — [issue and why it matters]

### Warning (should fix)
- `file:line` — [concern and risk]

### Suggestion (consider)
- `file:line` — [optional improvement with rationale]

### Looks Good
- [What was done well]
```

## Notes

- Reference the `code-review` skill for the full review methodology.
- Reference the `code-reviewer` agent for how findings are categorized.
- Assume the author is competent. Ask before flagging choices that might be intentional.
- One finding per bullet point. Be specific about file, line, and issue.
