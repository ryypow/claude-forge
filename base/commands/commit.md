# /commit

Stage and commit changes with a conventional commit message.

## Usage

```
/commit
/commit <optional message hint>
```

Examples:
- `/commit` — auto-generate message from the diff
- `/commit adds rate limiting to the API` — use the hint to guide the message

## Steps

1. **Check status** — run `git status` to see staged, modified, and untracked files.

2. **Review the diff** — run `git diff` (unstaged) and `git diff --staged` (staged) to understand what changed.

3. **Check for problems** — before committing, verify:
   - No secrets, credentials, or `.env` files are staged
   - No debug code (`console.log`, `print`, `dbg!`) left in
   - No unrelated changes mixed in (suggest splitting if found)
   - No large binary files accidentally staged

4. **Stage files** — if nothing is staged, stage the relevant modified files. Use specific file paths, not `git add .`. Ask the user if unsure which files to include.

5. **Generate commit message** — write a conventional commit message based on the actual diff:
   - Type: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `perf`
   - Scope: the module or area affected
   - Subject: imperative, under 72 characters, no period
   - Body (if needed): what changed and why

6. **Show the message** — present the commit message for approval. Do not commit until the user confirms.

7. **Commit** — create the commit and show the resulting hash.

## Output Format

```markdown
**Staged files:**
- `path/to/file.ts` (modified)
- `path/to/new-file.ts` (new)

**Commit message:**
```
feat(auth): add OAuth2 login with Google and GitHub

Adds OAuth2 providers for Google and GitHub. Users can link multiple
providers to one account. Sessions stored in Redis with 24h TTL.

Closes #142
```

Commit with this message?
```

## Notes

- Reference the `git-agent` for the full commit workflow.
- Reference the `git-workflow` skill for naming and message conventions.
- Never force-push, amend published commits, or commit secrets.
- If changes span multiple unrelated areas, suggest separate commits.
