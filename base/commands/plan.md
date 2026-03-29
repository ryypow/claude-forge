# /plan

Decompose a task into concrete steps before writing any code.

## Usage

```
/plan <task description>
```

Examples:
- `/plan add OAuth2 login to the API`
- `/plan migrate the database from MySQL to PostgreSQL`
- `/plan refactor the payment module to support multiple providers`

## Steps

1. **Restate the goal** — write the task as a single clear sentence. If the request is ambiguous, ask for clarification before continuing.

2. **Read the relevant code** — find the files, functions, and tests that will be affected. Do not plan changes to code you haven't read.

3. **Identify constraints** — what must not break? What APIs, contracts, or dependencies are involved? Are there existing tests?

4. **Break into steps** — produce an ordered list of concrete actions. Each step should:
   - Reference a specific file path
   - Describe a single change
   - Be small enough to verify independently

5. **Flag risks** — anything that could go wrong, requires migration, affects other systems, or has performance implications.

6. **Identify tests** — what tests need to be written or updated to verify the implementation.

7. **Wait for approval** — present the plan and ask "Proceed with this plan?" Do not start implementing until the user confirms.

## Output Format

```markdown
## Plan: [task summary]

**Goal:** [one sentence]

**Files involved:**
- `path/to/file.py` — [what changes here]
- `path/to/other.ts` — [what changes here]

**Steps:**
1. [Concrete action — what to do and where]
2. [Next action]
3. ...

**Risks:**
- [What could go wrong and how to mitigate]

**Tests:**
- [What to test after implementation]

---
Proceed with this plan?
```

## Notes

- Do not write code during planning. The output is a plan, not a prototype.
- If a step is too large to verify independently ("refactor the module"), break it down further.
- If you don't know enough to plan confidently, say what you need to investigate first.
- Reference the `planner` agent for the full methodology.
