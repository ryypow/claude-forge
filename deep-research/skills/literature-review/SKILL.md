# Skill: Systematic Literature Review

## Purpose

Conduct a literature review that is reproducible, comprehensive within its defined scope, and structured to support academic writing. This skill covers the complete process from defining a search protocol through writing a synthesis section with a gap analysis. It is the backbone of any research project that requires understanding what has already been done.

A literature review is not a list of summaries. It is a structured argument about the state of a field: what has been established, where there is disagreement, and what remains unanswered. Every design decision in this skill serves that goal.

---

## When to Use This Skill

- Starting a new research project and needing to understand the existing landscape
- Writing the Related Work or Literature Review section of a paper
- Evaluating whether a proposed approach is novel
- Identifying the best baseline methods to compare against
- Understanding a field you are not already expert in
- Producing a standalone survey or review paper

---

## Step 1 — Scope Definition

Before any searching, define the review scope in writing. A scope that exists only in your head will drift as you search.

**Research question:** one sentence, specific enough to use as a filter. If you cannot use the research question to decide whether a paper is in scope, it is too vague.

```
Too vague: "deep learning for healthcare"
Usable: "application of transformer architectures to clinical note classification in electronic health records, 2019–present"
```

**Date range:** specify both start and end. Typical choices:
- "All time" — for a foundational survey; be aware this can be unmanageable in active fields
- "Last 5 years" — for a recent-advances review
- "YYYY to present" — anchored to a methodological shift or seminal paper

**Source types to include:**
- [ ] Peer-reviewed journal articles
- [ ] Conference papers (specify tiers if relevant, e.g., NeurIPS/ICML/ICLR for ML)
- [ ] arXiv preprints
- [ ] Technical reports (IEEE, ACM, NIST, etc.)
- [ ] Workshop papers
- [ ] Theses and dissertations
- [ ] GitHub repositories (for software/dataset papers)

**Languages:** English only by default. Note if other languages are required.

**Minimum quality bar:** will you include papers from any venue, or exclude low-quality venues? For a quick survey, any source is fine. For a paper you are publishing, specify minimum venue quality.

---

## Step 2 — Keyword Strategy

Build the search strategy systematically. This is not optional — undocumented searches cannot be reproduced.

### Primary concept identification
Break the research question into 2–4 core concepts. Each concept becomes a search axis.

Example: "transformer architectures for clinical note classification in EHR"
- Concept A: the model family → "transformer"
- Concept B: the task → "text classification"
- Concept C: the domain → "clinical notes" / "electronic health records"

### Synonym expansion
For each concept, list all accepted synonyms and related terms. These vary by subfield; use the vocabulary of the papers you already know.

```
Concept A: transformer, attention mechanism, BERT, self-attention, encoder-decoder
Concept B: text classification, document classification, sentence classification, NLU, NLP
Concept C: clinical notes, EHR, electronic medical records, EMR, clinical text, discharge summaries, radiology reports
```

### Boolean search strings

**Full string (most precise):**
```
("transformer" OR "BERT" OR "self-attention")
AND ("clinical notes" OR "electronic health records" OR "EHR" OR "clinical text")
AND ("classification" OR "categorization")
```

**Relaxed string (broader, more recall):**
```
("transformer" OR "BERT") AND ("clinical" OR "EHR")
```

**Negative filters (reduce noise):**
```
NOT ("image" OR "radiology image" OR "pathology slide")  // if excluding imaging
```

Document: string used, database, date of search, number of raw results. This goes in the Methods section if this is a systematic review.

---

## Step 3 — Database Querying

Query in this order. Each database has different strengths.

### Semantic Scholar (primary)
Endpoint: `https://api.semanticscholar.org/graph/v1/paper/search`
Parameters: `query`, `fields=paperId,title,authors,year,venue,citationCount,abstract,externalIds,openAccessPdf`
Strengths: broad coverage, citation counts, citation graph traversal, open-access PDF links
Weakness: some niche venues have incomplete coverage

Run the full boolean string. Sort by relevance first. Note the total result count before filtering.

### arXiv (preprints)
Use the arXiv API or search interface. Apply subject category filters:
- `cs.LG` — machine learning
- `cs.CL` — computation and language
- `cs.CV` — computer vision
- `stat.ML` — statistics / machine learning
- `q-bio.*` — computational biology
- `physics.*` — physics subfields as appropriate

arXiv is essential for fast-moving fields where the most important recent work may not be published yet.

### Backward citation chasing
Once you have 2–3 clearly central papers, pull their reference lists. High-quality papers in your target area cite the other high-quality papers in your target area. This catches papers that do not show up in keyword searches because they use different terminology.

### Forward citation chasing
Use Semantic Scholar's `/paper/{id}/citations` endpoint to find papers that cite your central papers. This catches recent work that builds on the foundations.

### Specialist resources (domain-specific)
- **PubMed** — biomedical literature
- **IEEE Xplore** — electrical engineering, signal processing, systems
- **ACM Digital Library** — computer science
- **SSRN** — economics, social science preprints
- **bioRxiv / medRxiv** — life sciences preprints

Use these for fields where Semantic Scholar coverage is incomplete.

---

## Step 4 — Screening

Screening happens in two passes to manage volume.

### Pass 1 — Title and Abstract Screen
For each result, read the title and abstract. Classify:
- **Include:** clearly within scope, passes the research question filter
- **Exclude:** clearly outside scope. Note the reason (wrong topic, wrong date, wrong method type)
- **Uncertain:** abstract is ambiguous; needs full text

Maintain running counts. A healthy ratio for a well-constructed search: 70–80% of results excluded at this stage is normal; you are not missing papers, you built a broad search intentionally.

### Pass 2 — Full Text Screen
For papers marked uncertain, fetch the full text. Examine the methodology and results sections — the abstract sometimes misrepresents both. Accept or reject with a brief note.

### Deduplication
Before finalizing, deduplicate:
- Same DOI → same paper
- Same arXiv ID → same paper
- Same title with minor variation → likely same paper; check authors and year
- Same authors, same year, very similar title → check if one is a preprint of the other; keep the published version

Record final counts: raw → after dedup → after pass 1 → after pass 2 → included. These go in the Methods section.

### Screening criteria — examples

**Include if:**
- Directly addresses the research question
- Within the specified date range
- Source type matches inclusion criteria
- Full text is accessible

**Exclude if:**
- Only tangentially related (mentions the topic but does not study it)
- Outside date range
- Not in an accepted language
- Retracted (check Retraction Watch for suspicious papers)
- Duplicate of another included paper

---

## Step 5 — Data Extraction

Use the paper-analyzer agent for each included paper. At minimum, record for every paper:

| Field | Required |
|---|---|
| Full APA citation | Yes |
| DOI or arXiv ID | Yes |
| Core contribution (1 sentence) | Yes |
| Methodology type | Yes |
| Key findings (2–3 bullets) | Yes |
| Limitations | Yes |
| Relevance tag (which theme) | Yes |
| Citation count | Recommended |
| Code available? | Recommended |
| BibTeX | Required if writing in LaTeX |

Store extraction notes in `research-notes/` for the session. Do not rely on memory to carry information from the extraction phase to the synthesis phase.

---

## Step 6 — Thematic Grouping

Organize papers into themes before writing. Do not write first and group later — premature writing locks you into a structure that may not reflect the intellectual shape of the field.

### Grouping procedure
1. Write each paper's title and one-sentence contribution on a separate line
2. Look for clusters: papers that address the same sub-problem, use the same method class, or answer the same question
3. Name each cluster with a descriptive label
4. Move papers that bridge clusters into the most relevant cluster; note the bridge in the synthesis
5. Papers that do not fit any cluster: consider whether you missed a theme, or whether they are genuinely peripheral

### Common theme types
- By problem formulation (how the task is defined)
- By method family (what approach is used)
- By application domain (where it is applied)
- By data modality (text, image, tabular, etc.)
- By evaluation paradigm (how performance is measured)
- By theoretical contribution (analysis papers vs. empirical papers)

### Landmark paper identification
In each cluster, identify the seminal work: the paper with the highest citation count that most other papers in the cluster cite. This is the work that defined the approach. Treat it as the anchor of that cluster's synthesis paragraph.

---

## Step 7 — Write the Synthesis

Each cluster becomes a synthesis paragraph. Structure:

```
[Theme statement] — name the theme and its role in the broader question.
[Seminal work] — introduce the foundational paper with its contribution.
[Development] — 2–4 sentences on how subsequent work built on, refined, or challenged it.
[Current state] — what does the most recent work show?
[Relation to research question] — how does this theme connect to what you are investigating?
```

All claims about paper findings must be attributed. No claim stands without a citation. Avoid:
- "Researchers have shown..." (who? cite them)
- "It is generally accepted..." (say by whom and provide at least one citation)
- "Recent work suggests..." (which work? cite it)

### Synthesis paragraph template

> [Theme] is approached through two main strategies in the literature: [A] and [B]. The foundational work on [A] was [Seminal Paper] ([Authors, Year]), which [one-sentence contribution]. Building on this, [Paper 2] ([Authors, Year]) [how it extended the foundational work], while [Paper 3] ([Authors, Year]) challenged [specific assumption] and found [finding]. More recently, [Paper 4] ([Authors, Year]) demonstrated [latest advance]. [A] methods consistently show [strength], though [Limitation] remains a common concern ([Paper X, Year]; [Paper Y, Year]). [B] approaches, by contrast, offer [trade-off], as demonstrated by [Paper Z] ([Authors, Year]).

This is a template, not a formula. Adjust sentence count and structure to fit the papers.

---

## Step 8 — Gap Analysis

The gap analysis is the payoff. Every consumer of a literature review wants to know: what has not been done yet?

**Format for each gap:**

```
**Gap:** [Precise description of what has not been studied]
**Evidence of absence:** [Why you believe this gap exists — which papers approached it and stopped short, or which papers explicitly call it out as future work]
**Significance:** [Why would filling this gap matter?]
**Difficulty:** [What makes this gap hard to fill — data, compute, methodology?]
```

### Types of gaps to look for

- **Domain gaps:** method X has been applied to domain A but not domain B
- **Scale gaps:** methods tested on small datasets, large-scale behavior unknown
- **Comparison gaps:** approaches A and B exist but have never been compared under matched conditions
- **Replication gaps:** key results from one paper have not been reproduced by independent groups
- **Mechanism gaps:** a phenomenon has been observed but its cause has not been studied
- **Application gaps:** theoretical results that have not been translated into practical systems
- **Negative result gaps:** it is not clear what conditions make a method fail

---

## Search String Templates

### Machine learning / AI
```
("[method family]" OR "[specific model]" OR "[variant name]")
AND ("[task name]" OR "[task synonym]")
AND ("[domain]" OR "[domain synonym]")
```

### Biomedical / clinical
```
("[condition/disease]" OR "[clinical term]")
AND ("[intervention/method]" OR "[treatment type]")
AND ("outcome" OR "efficacy" OR "accuracy" OR "performance")
```

### Social science / behavioral
```
("[phenomenon]" OR "[related concept]")
AND ("[population]" OR "[context]")
AND ("study" OR "experiment" OR "survey" OR "analysis")
```

---

## Screening Criteria Template

Copy this into your review notes and fill in before searching:

```
INCLUSION CRITERIA
- Date range: YYYY–YYYY
- Source types: [list]
- Must address: [specific aspect of research question]
- Language: English

EXCLUSION CRITERIA
- Exclude if: outside date range
- Exclude if: only mentions topic without studying it
- Exclude if: duplicate of another included paper
- Exclude if: no methodology section (opinion piece / editorial)
- Exclude if: [domain-specific exclusion]
```

---

## Synthesis Paragraph Structure

```
[1 sentence] Theme statement
[1–2 sentences] Seminal work introduction
[2–4 sentences] Development of the theme (how papers built on each other)
[1–2 sentences] Current state of this thread
[1 sentence] Relation to your research question or how this theme differs from your approach
```

Length: 150–300 words per theme paragraph. Shorter means you are summarizing, not synthesizing. Longer risks losing the reader.

---

## Gap Analysis Format

```
## Gaps and Open Questions

### [Gap 1]: [Short name]
[2–3 sentences describing the gap precisely]
*Evidence of absence:* [Author, Year] called for this work but did not pursue it; no paper in this review addresses [specific condition].
*Significance:* [Why it matters]

### [Gap 2]: [Short name]
...

### Contradictions

**[Contradiction 1]:** [Author A, Year] found [result X]; [Author B, Year] found [conflicting result Y] under apparently similar conditions. The methodological difference is [specific difference]. Resolving this would require [matched experiment description].
```
