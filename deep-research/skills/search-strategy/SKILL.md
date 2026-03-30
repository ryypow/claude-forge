---
name: search-strategy
description: arXiv category taxonomy, keyword expansion patterns, and Boolean search construction for academic paper searches
domain: deep-research
triggers:
  - search arXiv for papers on
  - what categories should I search
  - keyword strategy for
  - boolean search string
  - how do I find papers about
  - which arXiv categories cover
  - search strategy for
  - expand keywords for
  - find papers on
  - academic search terms
---

## Overview

This skill covers how to build effective search strategies for academic paper discovery, with a focus on arXiv but applicable across all source types in `sources.yml`. The output of applying this skill is a set of search strings that a human or the `source-searcher` agent can execute to find the most relevant papers on a topic.

Does not cover source quality evaluation (see `source-evaluation`) or configuring sources (see `source-configuration`).

---

## arXiv Category Taxonomy

arXiv organizes papers into categories. Searching within the right categories dramatically improves precision. Use the `cat:` prefix in arXiv queries.

### AI / ML / NLP

| Category | Full name | What it covers |
|---|---|---|
| `cs.AI` | Artificial Intelligence | General AI, knowledge representation, planning, reasoning agents |
| `cs.LG` | Machine Learning | Learning algorithms, optimization, generalization, deep learning |
| `cs.CL` | Computation and Language | NLP, language models, text understanding, generation |
| `cs.MA` | Multiagent Systems | Multi-agent coordination, game theory, distributed AI |
| `cs.NE` | Neural and Evolutionary Computing | Neural architectures, evolutionary algorithms |
| `stat.ML` | Machine Learning (Statistics) | Statistical learning, Bayesian methods — overlaps with cs.LG |

### Systems / Applications

| Category | Full name | What it covers |
|---|---|---|
| `cs.IR` | Information Retrieval | Search, RAG, recommendation, retrieval systems |
| `cs.CV` | Computer Vision | Image/video understanding, visual agents |
| `cs.RO` | Robotics | Embodied agents, robot learning, manipulation |
| `cs.SE` | Software Engineering | Code generation, program synthesis, automated testing |
| `cs.PL` | Programming Languages | Type systems, program analysis |
| `cs.DB` | Databases | Structured data, query systems |

### Safety / Security / Theory

| Category | Full name | What it covers |
|---|---|---|
| `cs.CR` | Cryptography and Security | AI safety, adversarial robustness, privacy |
| `cs.LO` | Logic in Computer Science | Formal verification, theorem proving |
| `cs.GT` | Computer Science and Game Theory | Strategic agents, mechanism design |

---

## Keyword Expansion Patterns

Strong searches use multiple keyword forms. For each core concept, expand to:

1. **Full term**: `retrieval augmented generation`
2. **Abbreviation**: `RAG`
3. **Verb form**: `augmenting`, `retrieval-augmented`
4. **Related terms**: `knowledge retrieval`, `in-context retrieval`, `external memory`
5. **Negative scope** (what to exclude): `medical RAG`, `image retrieval` (if not relevant)

### Expansion examples

| Core concept | Expansions |
|---|---|
| AI agents | LLM agent, autonomous agent, AI agent, agentic system, agent framework |
| Memory | working memory, episodic memory, long-term memory, external memory, memory-augmented |
| Reasoning | chain-of-thought, CoT, reasoning chain, step-by-step reasoning, multi-step reasoning |
| Tool use | function calling, tool-augmented, external tools, API calling, tool-integrated |
| Multi-agent | multi-agent system, agent coordination, agent communication, agent collaboration |

---

## Boolean Search Construction

### arXiv API syntax

arXiv API supports field-specific searching:
- `ti:` — title
- `abs:` — abstract
- `all:` — all fields (title + abstract + comments)
- `cat:` — category
- `au:` — author

Combine with `AND`, `OR`, `ANDNOT`. Group with parentheses.

```
# Find papers on agent memory in cs.AI or cs.CL:
(ti:"agent memory" OR abs:"memory-augmented agent") AND (cat:cs.AI OR cat:cs.CL)

# Find papers on RAG, excluding medical applications:
(ti:RAG OR abs:"retrieval augmented generation") ANDNOT abs:medical

# Narrow to recent papers (use date_range separately, not in query string):
abs:"multi-agent" AND cat:cs.MA
```

### Semantic Scholar syntax

Semantic Scholar uses natural language queries — no Boolean operators. Write as a descriptive phrase:
```
LLM agent memory retrieval augmented generation
multi-agent coordination language models
```

Use the `fields` parameter to request: `title,abstract,year,citationCount,openAccessPdf,externalIds`

### Brave Search syntax

Standard web search with site: filters:
```
"retrieval augmented generation" agent site:arxiv.org OR site:aclanthology.org
```

---

## Balancing Precision vs. Recall

| Goal | Strategy |
|---|---|
| High precision (fewer, better results) | Use `ti:` prefix; require both terms with `AND`; add `cat:` filter |
| High recall (more results, more noise) | Use `abs:` or `all:`; connect alternatives with `OR`; drop `cat:` filter |
| Baseline (default) | Mix `ti:` for core terms, `abs:` for expansions, one `cat:` filter |

Start with a precision query to assess paper density. If < 10 results, widen to recall. If > 200, narrow.

---

## When NOT to apply this skill

If the topic is already decomposed into sub-themes and search strings (by `topic-scoper`), switch to `source-configuration` for adding sources or hand the strings directly to `source-searcher` for execution.
