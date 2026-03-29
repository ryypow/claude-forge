---
name: code-review
description: Balanced code review methodology — what to flag, what to let go, and how to give feedback that improves code without demoralizing authors
domain: base
triggers:
  - review this code
  - code review
  - give me feedback
  - what do you think of this code
  - review my changes
  - is this code okay
  - check this implementation
  - review the diff
---

## Overview

This skill teaches how to perform code reviews that catch real issues while respecting the author's judgment. A good review makes the code better. A bad review produces arguments about semicolons. This skill focuses on the former.

---

## What to Flag

### Always flag (these cause real problems)

**Bugs and logic errors:**
- Off-by-one errors in loops or array indexing
- Null/undefined access without checks
- Race conditions in concurrent code
- Resource leaks (unclosed files, connections, streams)
- Incorrect error handling (swallowing exceptions, wrong catch scope)

**Security issues:**
- SQL injection, command injection, XSS
- Hardcoded secrets or credentials
- Missing input validation at system boundaries
- Disabled security controls (SSL verification, CORS, auth)
- Unsafe memory operations in C/Rust

**Correctness:**
- Function doesn't do what its name says
- Edge cases not handled (empty input, zero, negative, overflow)
- API contract violations (wrong return type, missing fields)
- State mutations that callers don't expect

**Maintainability (only when severe):**
- Function doing 5 unrelated things
- Deeply nested logic that could be simplified
- Copy-pasted code that will diverge and cause bugs

### Never flag (these waste everyone's time)

- Style preferences that don't affect readability (brace placement, trailing commas)
- Naming choices that are clear enough, even if you'd pick a different name
- Approaches that are "different from how I'd do it" but are correct and readable
- Missing documentation on self-explanatory code
- Not using a specific design pattern when the current approach works

---

## How to Give Feedback

### Severity categories

| Category | Meaning | Action required |
|---|---|---|
| **Critical** | Will cause a bug, crash, or security issue | Must fix before merge |
| **Warning** | Likely to cause problems or tech debt | Should fix, discuss if disagreed |
| **Suggestion** | Could be better, but fine as-is | Author decides |

### Feedback format

**Good feedback:**
> **Warning** — `auth.ts:42`: `user` can be `null` here when the session expires. The null check on line 38 only covers `user.name`, not `user` itself. This will throw a TypeError for expired sessions.

**Bad feedback:**
> This could be null.

**Rules:**
- Be specific: name the file, the line, and the exact issue
- Explain *why* it matters, not just *what* is wrong
- Suggest a fix when the solution isn't obvious
- One finding per comment — don't bundle
- Always include at least one positive observation

### Tone

- Assume the author is competent and made deliberate choices
- Ask questions before making assumptions: "Is there a reason this doesn't handle the empty case?" vs. "You forgot to handle the empty case"
- Use "we" language: "We should check for null here" vs. "You should check for null here"
- Praise good patterns when you see them — it reinforces what works

---

## Review Checklist

Use this as a mental checklist, not a formal gate:

1. Does the code do what the PR description says?
2. Are there obvious bugs or logic errors?
3. Are security boundaries respected? (input validation, auth checks, no secrets)
4. Are error cases handled? (not silently swallowed, not overly broad catches)
5. Is the code readable to someone who didn't write it?
6. Are there tests for the critical paths?
7. Does it break any existing tests?

---

## When NOT to apply this skill

- If the user asks for a quick glance, not a full review — scale your effort accordingly
- If the code is a prototype or spike — flag only critical/security issues
- If the project has its own review checklist, use that instead of this one
