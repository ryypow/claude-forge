---
name: git-workflow
description: Branch, PR, and merge conventions — how to manage code changes from branch creation through merge
domain: base
triggers:
  - create a branch
  - branch naming
  - pull request
  - PR description
  - merge strategy
  - conventional commit
  - commit message
  - git workflow
  - how to commit
  - rebase vs merge
  - squash commits
---

## Overview

This skill covers the full lifecycle of a code change through git: creating a branch, making commits, opening a PR, and merging. It applies to any project using git, regardless of language or domain.

---

## Branch Strategy

### Branch naming

```
feature/<scope>/<description>   — new functionality
fix/<scope>/<description>       — bug fixes
chore/<description>             — maintenance, dependencies, CI
```

- Lowercase, hyphen-separated: `feature/auth/add-oauth-flow`
- Keep it short but descriptive — someone should understand the branch purpose from the name
- `<scope>` is optional but recommended for larger repos

### When to branch

- Every change gets its own branch — no committing directly to `main` or `dev`
- Branch from the integration branch (`dev` or `main` depending on the project)
- Keep branches short-lived — merge within days, not weeks

---

## Commit Conventions

### Conventional Commits format

```
type(scope): short description

[optional body]

[optional footer]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New functionality visible to users |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Maintenance — dependencies, tooling, CI config |
| `ci` | CI/CD pipeline changes |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace, semicolons — no logic change |

**Rules:**
- Subject line: imperative mood, under 72 characters, no trailing period
- Body: explain *what* and *why*, not *how*. Wrap at 80 characters.
- Footer: `Closes #123`, `Refs #456`, `BREAKING CHANGE: description`

### Good commit messages

```
feat(auth): add OAuth2 login flow

Adds Google and GitHub OAuth2 providers. Users can link multiple
providers to a single account. Sessions are stored in Redis with
a 24-hour TTL.

Closes #142
```

### Bad commit messages

```
fix stuff
updated code
WIP
changes
```

---

## Pull Request Workflow

### Before opening a PR

1. Rebase on the latest integration branch to avoid conflicts
2. Run tests locally — don't rely on CI to catch basic failures
3. Review your own diff — read it as if someone else wrote it
4. Check that no secrets, debug code, or unrelated changes are included

### PR description

Every PR needs:

```markdown
## What changed
[1-3 sentences]

## Why
[What problem this solves]

## Changes
- [Specific changes, bulleted]

## Testing
- [How it was tested]
```

### Review and merge

- Address all review comments before merging
- Prefer squash merge for feature branches (clean history)
- Prefer merge commit for long-running branches (preserve context)
- Delete the branch after merge

---

## When NOT to apply this skill

- If the project has its own documented git conventions, follow those instead
- If working in a monorepo with specific tooling (Nx, Turborepo), defer to that tooling's conventions
