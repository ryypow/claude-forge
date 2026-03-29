---
name: research-methodology
description: Structured investigation methodology for engineering decisions — evaluating libraries, comparing approaches, and producing a time-boxed recommendation before writing any code
domain: base
triggers:
  - research options for
  - which library should I use
  - evaluate alternatives
  - compare options
  - spike
  - investigate
  - proof of concept
  - assess trade-offs
  - should I use
  - what are the options for
  - how do I choose between
  - explore options
---

## Overview

This skill covers the engineering investigation workflow — the structured process of exploring options before committing to an implementation. It applies when the cost of choosing wrong is higher than the cost of a short investigation. It is distinct from academic research (see `deep-research` domain): this is about choosing a database, a library, an architecture pattern, or a protocol — not producing a literature review.

The output of applying this skill is a decision, not a prototype.

---

## When to spike

Spike before implementing when:
- You are choosing between two or more libraries or frameworks with non-trivial trade-offs
- The architecture decision will be expensive to reverse later
- You are unfamiliar with the domain and cannot estimate the risks without investigating
- The user asks "which should I use" or "what's the best way to"

Skip the spike when:
- The decision is already made — just implement it
- The options are trivially equivalent in your context
- You have recent firsthand experience with all options being considered

---

## Investigation steps

### Step 1 — Define the decision precisely

Write the decision question in one sentence before evaluating anything. A vague question produces a vague comparison. Examples:

**Too vague:** "What's a good database?"

**Precise:** "Which database should this service use for storing user session state that requires < 10ms read latency, horizontal scaling to 10M sessions, and TTL support?"

If the user gives a vague question, help refine it before proceeding.

### Step 2 — Enumerate options

List 3–5 candidate options. More than 5 is analysis paralysis — narrow the field before evaluating. If you cannot identify 3 candidates, the decision may already be made.

### Step 3 — Evaluate each option

For each candidate, assess the following dimensions. Be specific — "good performance" is not useful; "sub-millisecond p99 read latency in benchmarks" is.

| Dimension | What to assess |
|---|---|
| **Fit** | Does it do what is actually needed? What are the gaps? |
| **Maturity** | Version, release frequency, production adoption, known reliability issues |
| **Maintenance** | Active maintainers? Open issues? Last commit? Community size? |
| **Footprint** | Dependency count, bundle size, runtime overhead |
| **Migration cost** | How hard to replace if wrong? Lock-in risks? |
| **License** | Compatible with this project's license? Commercial use allowed? |

### Step 4 — Build the options matrix

Summarize evaluation in a markdown table. Rows are options; columns are dimensions. Use ✓, ✗, or a brief qualifier — not paragraphs.

```markdown
| Option | Fit | Maturity | Maintenance | Footprint | Migration | License |
|--------|-----|----------|-------------|-----------|-----------|---------|
| Redis  | ✓ TTL, pub/sub | Excellent | Very active | Low | Medium | BSD |
| Memcached | ✓ TTL, no pub/sub | Excellent | Maintained | Low | Low | BSD |
| DynamoDB | ✓ TTL, AWS only | Excellent | AWS-managed | None (client) | High | Proprietary |
```

### Step 5 — Recommend with rationale

State one recommendation. The recommendation should be defensible from the matrix — not a gut feeling.

Format:
> **Recommendation: [Option]**
> [2–3 sentences explaining why this option wins in the context of this decision. Reference specific cells from the matrix.]
>
> **Runner-up: [Option]** — [one sentence on when to prefer this instead]
>
> **Avoid: [Option]** — [one sentence on the disqualifying factor]

### Step 6 — Timebox

Spikes have a time limit. A spike that takes longer than implementing the simplest option is not a spike — it is a prototype. Typical spike budget: 30 minutes to 2 hours.

If you are writing code during a spike, you are prototyping, not spiking. The output of a spike is a decision document, not working code.

---

## When NOT to apply this skill

If the user is doing academic literature research (surveying papers, understanding a field, producing a reading list), use the `deep-research` domain commands instead. This skill is for engineering decisions, not knowledge production.

If the decision is already specified and you just need to implement it, skip the spike and implement.
