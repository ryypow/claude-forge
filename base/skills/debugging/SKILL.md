---
name: debugging
description: Systematic debugging methodology — reproduce, isolate, hypothesize, verify, fix — across Python, TypeScript, Rust, and C
domain: base
triggers:
  - debug
  - bug
  - error
  - exception
  - crash
  - doesn't work
  - not working
  - broken
  - failing test
  - stack trace
  - traceback
  - segfault
  - panic
  - undefined is not a function
  - TypeError
  - NullPointerException
  - root cause
---

## Overview

This skill covers a systematic approach to debugging that works across all languages. It replaces "try random things until it works" with a structured process that finds root causes efficiently.

---

## The Debugging Process

### Step 1 — Read the error

Before doing anything else, read the error message carefully. The answer is in the error 80% of the time.

**What to extract from an error:**
- The error type (TypeError, SegmentationFault, PanicException)
- The file and line number where it occurred
- The call stack — which function called which
- The failing assertion or condition
- Any relevant values printed in the message

**Common mistake:** Skipping the error message and going straight to the code. The error is your best clue. Read it twice.

### Step 2 — Reproduce the issue

A bug you can't reproduce is a bug you can't fix. Before investigating:

1. Get exact reproduction steps from the user or the failing test
2. Run the reproduction and confirm you see the same error
3. If you can't reproduce it, figure out what's different (environment, data, timing)

**Minimal reproduction:** Reduce the reproduction to the smallest possible case. If the bug happens with 1000 records, does it happen with 1? With 10? Finding the minimal case often reveals the root cause.

### Step 3 — Isolate the location

Narrow down where the bug lives:

**From the error (best case):**
- Stack trace points to the exact line
- Read that function and its callers
- Check the values going in and coming out

**Binary search (when the location is unknown):**
- Comment out half the code / disable half the pipeline
- Does the bug persist? You've narrowed it to the active half.
- Repeat until you've isolated the failing code.

**Print/log debugging:**
- Add targeted log statements at key points
- Print the actual values, not just "reached here"
- Compare expected vs. actual at each step

### Step 4 — Form a hypothesis

State what you think is wrong, specifically:

**Good hypothesis:**
> "Line 47 of `parser.ts` calls `input.split('/')` but `input` is `null` when the config file doesn't have a `path` field. The config schema allows `path` to be optional but this function assumes it's always present."

**Bad hypothesis:**
> "Something is wrong with the parser."

A hypothesis must be testable — you should be able to describe what evidence would prove or disprove it.

### Step 5 — Verify the hypothesis

Find evidence. Don't just look at the code and nod — prove it:

- Add a log statement that prints the value you suspect is wrong
- Write a test case that triggers the specific condition
- Check git blame — was this code recently changed?
- Check if there's a related test that should have caught this but didn't

If the evidence disproves your hypothesis, that's progress. Go back to Step 4 with what you learned.

### Step 6 — Fix and verify

1. Make the minimum change that fixes the root cause
2. Run the original reproduction to confirm the fix
3. Run the existing test suite to confirm nothing else broke
4. Consider: should there be a test for this? (Usually yes — the bug existed because the case wasn't tested)

---

## Language-Specific Debugging

### Python
- `traceback` module for formatted stack traces
- `pdb` / `breakpoint()` for interactive debugging
- `python -m pytest --pdb` drops into debugger on failure
- Check for: mutable default arguments, late binding closures, import order issues

### TypeScript / JavaScript
- Browser DevTools / Node.js `--inspect` for interactive debugging
- `console.trace()` for call stacks
- Check for: `this` binding issues, async/await missing `await`, strict equality (`===` vs `==`)

### Rust
- `RUST_BACKTRACE=1` for full backtraces
- `dbg!()` macro for quick value printing
- `cargo test -- --nocapture` to see println output in tests
- Check for: lifetime issues, borrow checker complaints, integer overflow in release mode

### C
- `gdb` / `lldb` for interactive debugging
- `valgrind` for memory issues (leaks, invalid access, use after free)
- `AddressSanitizer` (`-fsanitize=address`) for memory bugs at runtime
- Check for: buffer overflows, null pointer dereference, use after free, uninitialized variables

---

## Common Bug Patterns

| Pattern | What it looks like | Where to look |
|---|---|---|
| Off-by-one | Loop runs one too many/few times | Loop bounds, array indexing |
| Null access | "Cannot read property of null/undefined" | Missing null checks, optional fields |
| Race condition | Works sometimes, fails sometimes | Concurrent access to shared state |
| Stale cache | Old data persists after update | Caching layers, memoization |
| Wrong scope | Variable has unexpected value | Closures, hoisting, shadowing |
| Silent failure | No error, but wrong result | Swallowed exceptions, empty catch blocks |
| Type coercion | `"5" + 3 = "53"` in JS | Implicit conversions, loose equality |
| Resource leak | Memory/connections grow over time | Missing close/free, error paths that skip cleanup |

---

## When NOT to apply this skill

- If the error message directly tells you the fix and it's obvious — just fix it
- If the "bug" is actually a missing feature — plan and implement, don't debug
