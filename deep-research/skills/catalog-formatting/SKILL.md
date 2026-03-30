---
name: catalog-formatting
description: Output format standards for the deep-research catalog — description writing style, themed section conventions, arXiv badge format, and catalog.json schema
domain: deep-research
triggers:
  - write a catalog description
  - catalog output format
  - format paper entry
  - catalog section
  - how should descriptions look
  - generate catalog
  - catalog.json schema
  - arXiv badge
  - themed sections
  - catalog standards
---

## Overview

This skill covers the format and quality standards for the two catalog output files: `catalog.md` (human-readable) and `catalog.json` (machine-readable). The central quality concern is description writing — what a 2–3 sentence description must contain and what makes one good vs. bad.

Does not cover how to query the knowledge graph to retrieve papers (see `knowledge-graph-patterns`) or how to run catalog generation (invoke `catalog-generator`).

---

## Description Writing

Every paper entry must have a 2–3 sentence description. This is the most important element of the catalog — it is what makes the catalog useful rather than just a list of links.

### Required content per sentence

- **Sentence 1** — the problem: what challenge or gap does this paper address? Why does it matter?
- **Sentence 2** — the approach: what method, architecture, or technique does the paper propose?
- **Sentence 3** — the result: what was achieved? Include numbers where the paper reports them.

Three sentences is the target. Two is acceptable when the paper is narrow. More than three is too long — the description becomes a summary, not a catalog entry.

### Quality test

Read the description and ask: could someone decide whether to read the full paper based on this alone? If yes, it passes. If it is too vague to make that judgment, rewrite it.

### Good description

> Addresses the challenge of maintaining coherent long-horizon plans in LLM-based agents, where standard context windows fail beyond ~8K tokens. Proposes a hierarchical compression scheme that distills older context into semantic summaries while preserving recent tokens verbatim, implemented as a plug-in memory module. Achieves a 34% improvement on LongBench over standard RAG baselines while reducing KV cache size by 60%.

**Why it works:** specific problem, specific mechanism, specific numbers.

### Bad description (too vague)

> This paper presents a new approach to memory in language model agents. The proposed method shows strong performance on standard benchmarks.

**Why it fails:** does not say what approach, what benchmarks, what performance. Reader cannot decide whether to read the paper.

### Common mistakes

- Opening with "This paper presents..." — start with the problem instead
- Citing relative improvements without the absolute baseline ("improves by 5%" — compared to what?)
- Using words like "novel", "state-of-the-art", "significant" without evidence
- Describing what the paper does instead of what it found

---

## catalog.md Format

### File structure

```markdown
# Research Catalog: [Topic]

Generated: YYYY-MM-DD | Papers: N | Themes: M

## Table of Contents

- [Theme 1](#theme-1) (N papers)
- [Theme 2](#theme-2) (N papers)
- [Other](#other) (N papers)

---

<details>
<summary><strong>Theme 1</strong> (N papers)</summary>

[1-2 sentence synthesis: what this theme covers, what the papers in it collectively show]

| Paper | Description | Source |
|-------|-------------|--------|
| [**Title**](source_url) | [2-3 sentence description] | [![arXiv](https://img.shields.io/badge/arXiv-XXXX.XXXXX-b31b1b.svg)](https://arxiv.org/abs/XXXX.XXXXX) |
| [**Title**](source_url) | [2-3 sentence description] | [Semantic Scholar] |

</details>

---

<details>
<summary><strong>Theme 2</strong> (N papers)</summary>
...
</details>

---

<details>
<summary><strong>Other</strong> (N papers)</summary>

Papers that do not fit cleanly into any of the main themes.

| Paper | Description | Source |
|-------|-------------|--------|
...

</details>
```

### Section synthesis

The 1–2 sentence synthesis at the top of each themed section should:
- Describe what the cluster of papers collectively addresses
- Note any shared methodology or point of convergence across the papers
- Not list individual papers — that is what the table is for

### Theme naming

- Use noun phrases that describe the intellectual focus: "Agent Memory Mechanisms", "Multi-Agent Coordination Protocols", "Retrieval-Augmented Generation"
- Avoid generic labels: "Related Work", "Background", "Other Approaches"
- Maximum 4 words in the theme name

### Paper ordering within sections

Order by citation count descending. For papers with zero citations (new preprints), order by date descending within that group.

---

## arXiv Badge

For papers with an arXiv ID, use the standard badge format:

```markdown
[![arXiv](https://img.shields.io/badge/arXiv-XXXX.XXXXX-b31b1b.svg)](https://arxiv.org/abs/XXXX.XXXXX)
```

Replace `XXXX.XXXXX` with the arXiv ID (e.g. `2401.12345`).

For papers without arXiv IDs, use the source name as plain text in the Source column:
- `[Semantic Scholar]` — link to Semantic Scholar paper page
- `[PDF]` — link to the fetched PDF
- `[GitHub]` — for repos and code papers

---

## catalog.json Schema

```json
{
  "generated_at": "2026-03-26T14:00:00Z",
  "topic": "Research topic string",
  "total_papers": 47,
  "themes": [
    {
      "name": "Agent Memory Mechanisms",
      "paper_count": 12,
      "synthesis": "1-2 sentence synthesis text",
      "papers": [
        {
          "id": "2401.12345",
          "title": "Exact paper title",
          "source": "arxiv",
          "source_url": "https://arxiv.org/abs/2401.12345",
          "arxiv_id": "2401.12345",
          "doi": null,
          "authors": ["Author One", "Author Two"],
          "date": "2024-01",
          "venue": "arXiv preprint",
          "citation_count": 342,
          "methodology_type": "empirical",
          "overall_assessment": "Strong",
          "code_available": true,
          "description": "2-3 sentence catalog description",
          "themes": ["Agent Memory Mechanisms", "Retrieval-Augmented Generation"],
          "arxiv_categories": ["cs.AI", "cs.LG"]
        }
      ]
    }
  ]
}
```

All fields are required. Use `null` for optional fields that are not available (doi, arxiv_id). Never omit a field.

---

## When NOT to apply this skill

If you are querying the knowledge graph to retrieve papers for the catalog, use `knowledge-graph-patterns`. If you are running the full catalog generation pipeline, invoke the `catalog-generator` agent.
