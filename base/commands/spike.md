# /spike

Run a structured, time-boxed investigation of a technical decision before implementing.

## Usage

```
/spike <decision question>
```

Examples:
- `/spike which message queue should I use for this service`
- `/spike should I use PostgreSQL or MongoDB for user profiles`
- `/spike what's the best way to handle authentication in this API`

## Steps

1. **Sharpen the question** — if the question is vague, rewrite it as a precise one-sentence decision question before proceeding. State: what is being chosen, for what use case, under what constraints.

2. **Enumerate candidates** — list 3–5 options. If fewer than 3 exist, note why the decision space is small and proceed. If more than 5 exist, narrow to the most plausible before evaluating.

3. **Evaluate each candidate** across 6 dimensions:
   - **Fit** — does it meet the stated requirements?
   - **Maturity** — production-proven or experimental?
   - **Maintenance** — active and supported?
   - **Footprint** — dependency burden and operational overhead?
   - **Migration cost** — reversibility if the choice proves wrong?
   - **License** — compatible with the project?

4. **Build options matrix** — present results as a markdown table (rows = options, columns = dimensions).

5. **Recommend** — state one recommendation with 2–3 sentence rationale grounded in the matrix. Name a runner-up and state when to prefer it. Flag any options that are disqualified.

6. **Confirm before implementing** — end with: "Proceed with [option]?" Do not write implementation code until the user confirms.

## Output format

```markdown
## Spike: [decision question]

**Refined question:** [one sentence]

### Options considered
[bulleted list of 3-5 candidates]

### Evaluation

| Option | Fit | Maturity | Maintenance | Footprint | Migration | License |
|--------|-----|----------|-------------|-----------|-----------|---------|
| ... | | | | | | |

### Recommendation

**Use [option].**
[2-3 sentences: why this option, referencing specific matrix cells]

**Runner-up: [option]** — [when to prefer instead]
**Avoid: [option]** — [disqualifying reason]

---
Proceed with [option]?
```

## Notes

- Do not write any implementation code during a spike — the output is a decision, not a prototype.
- If the user provides a context file or existing code, read it before evaluating options for fit.
- If you cannot find reliable information on a candidate (no documentation, no known production use), note this as a risk rather than fabricating an assessment.
