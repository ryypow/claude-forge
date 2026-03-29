# Code Quality

These rules are always in effect. They are not suggestions.

## Complexity

- **Functions over 50 lines** should be split unless the logic is inherently sequential and splitting would reduce clarity
- **Nesting over 4 levels deep** should be flattened — use early returns, guard clauses, or extract helper functions
- **Files over 500 lines** should be reviewed for splitting — not every large file is wrong, but most are

## Dead Code

- **No commented-out code** — delete it. Git has history if you need it back.
- **No unused imports** — remove them
- **No unreachable code** — if it can't execute, it shouldn't exist
- **No TODO comments without a linked issue** — `TODO` without context is dead code in disguise

## Naming

- **Names describe what, not how** — `getUserById` not `queryDatabaseForUser`
- **Boolean names are questions** — `isValid`, `hasPermission`, `canRetry`
- **No abbreviations** unless universally understood (`id`, `url`, `http` are fine; `usr`, `mgr`, `svc` are not)

## Error Handling

- **No empty catch blocks** — at minimum, log the error
- **No overly broad catches** — catch the specific error type, not `Exception` or `Error`
- **Errors must be handled or propagated** — never silently swallowed
- **Error messages must be actionable** — include what failed, why, and what to do about it

## Testing

- **New functionality needs tests** — not 100% coverage, but the critical paths
- **Bug fixes need a regression test** — prove the bug existed and is now fixed
- **Tests must be deterministic** — no flaky tests. If a test fails intermittently, fix it or delete it.
- **Test names describe the scenario** — `test_expired_token_returns_401` not `test_auth_3`

## Documentation

- **Don't document the obvious** — `// increment counter` above `counter++` is noise
- **Do document the non-obvious** — why a particular approach was chosen, what the trade-offs are, what constraints exist
- **Public APIs need documentation** — parameters, return values, error cases, examples
- **Keep documentation next to the code** — not in a separate wiki that will go stale
