## Catalog Standards

**Why:** The catalog is the primary human-readable output of deep research. If descriptions are too vague to help a reader decide whether to read a paper, or if the structure is inconsistent, the catalog is not useful. These rules enforce a minimum quality bar.

**How to apply:** Apply when `catalog-generator` is producing output, when reviewing a generated catalog, or when manually editing catalog entries.

---

### Description length and content

**Minimum:** 2 sentences. **Target:** 3 sentences. **Maximum:** 3 sentences.

Every description must cover, in this order:
1. The problem or gap the paper addresses
2. The approach or method proposed
3. The key result or finding — include quantitative results when the paper reports them

A description that does not allow a reader to decide whether to read the paper fails this standard.

**Prohibited patterns:**
- Opening with "This paper presents..." or "The authors propose..." — start with the problem
- "novel", "state-of-the-art", "significant" without evidence from the paper
- Relative improvements without the baseline: "improves by 15%" without stating what it improves over
- Vague methodology: "uses a deep learning approach" — name the architecture or technique

### Theme section minimums

Themed sections must contain at least 2 papers. A section with 1 paper is folded into "Other." "Other" is always the last section.

Theme names must be noun phrases of 2–4 words describing the intellectual focus. Avoid generic names ("Related Work", "Miscellaneous").

Each themed section must open with a 1–2 sentence synthesis paragraph summarizing what the papers in that section collectively address. The synthesis is written for a reader who has not read any of the papers.

### catalog.json completeness

Every paper in `catalog.md` must have a corresponding entry in `catalog.json` with all required fields populated. Missing or null required fields (`title`, `source_url`, `description`, `themes`) are not acceptable. Optional fields (`doi`, `arxiv_id`) may be null.

The `generated_at` field must be an ISO 8601 datetime string (UTC). The `total_papers` field must match the actual count of papers in the file.

### Paper ordering

Within each themed section, papers are ordered by citation count descending. Papers with zero citations (new preprints) are ordered by date descending within that group, placed after all cited papers.

### Badge format

arXiv papers must use the standard arXiv badge format (see `skills/catalog-formatting/SKILL.md`). Non-arXiv papers use their source name as plain text linked to the paper's URL. Do not leave the Source column empty.
