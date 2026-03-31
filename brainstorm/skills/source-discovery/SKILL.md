---
name: source-discovery
description: Platform-specific search patterns and strategies for discovering ML/AI resources across arXiv, Semantic Scholar, GitHub, HuggingFace, and Papers With Code
domain: brainstorm
triggers:
  - search for papers on
  - find repos related to
  - search huggingface for
  - what's on papers with code for
  - discover models for
  - find datasets for
  - search across platforms
  - source discovery
  - find implementations of
  - what repos exist for
---

## Overview

This skill provides the search patterns, API syntax, and strategies for discovering ML/AI resources across five major platforms. Used by the `architecture-scout` agent and useful for manual searches.

---

## arXiv

### Search syntax
- **API endpoint:** `http://export.arxiv.org/api/query?search_query=`
- **Field prefixes:** `ti:` (title), `abs:` (abstract), `au:` (author), `cat:` (category), `all:` (full text)
- **Boolean:** `AND`, `OR`, `ANDNOT`
- **Date filter:** `submittedDate:[YYYYMMDD0000+TO+YYYYMMDD2359]`

### Example queries
```
ti:"state space model" AND abs:anomaly
cat:cs.LG AND ti:mamba AND submittedDate:[202401010000+TO+202612310000]
all:"selective scan" AND all:"time series"
```

### Category taxonomy (ML-relevant)
| Category | Scope |
|----------|-------|
| `cs.LG` | Machine learning, deep learning, optimization |
| `cs.AI` | General AI, knowledge representation, reasoning |
| `cs.CL` | NLP, language models |
| `cs.CV` | Computer vision |
| `cs.NE` | Neural/evolutionary computing |
| `cs.IR` | Information retrieval, search, RAG |
| `cs.CR` | Security, adversarial ML |
| `cs.RO` | Robotics, embodied AI |
| `stat.ML` | Statistical machine learning |
| `eess.SP` | Signal processing (time-series, audio) |

### Web search alternative
When the API is limited, use: `site:arxiv.org "<topic>" "<technique>" 2025 OR 2026`

---

## Semantic Scholar

### API endpoints
- **Search:** `https://api.semanticscholar.org/graph/v1/paper/search?query=`
- **Paper details:** `https://api.semanticscholar.org/graph/v1/paper/{paper_id}`
- **Citations:** `https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations`
- **References:** `https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references`

### Useful fields parameter
`fields=title,abstract,year,citationCount,openAccessPdf,authors,venue,externalIds`

### Search tips
- Natural language queries work better than Boolean
- Use `year` filter: `&year=2024-2026`
- Use `fieldsOfStudy` filter: `&fieldsOfStudy=Computer Science`
- Citation graph traversal: find one key paper, then pull its citations and references

### Web search alternative
`site:semanticscholar.org "<topic>" "<technique>"`

---

## GitHub

### Search syntax
- **Repos:** `https://github.com/search?type=repositories&q=`
- **Code:** `https://github.com/search?type=code&q=`

### Useful filters
```
<topic> stars:>50 pushed:>2025-01-01 language:python
<topic> stars:>100 language:python topic:machine-learning
<architecture>+<task> in:readme stars:>20
```

### Sorting
- `sort:stars` — most popular
- `sort:updated` — most recently active
- Default (no sort) — best match

### What to look for in repos
- Star count + trajectory (growing fast?)
- Last commit date (is it maintained?)
- README quality (documentation = usability)
- Issues/PRs (active community?)
- License (can you use it?)
- Dependencies (PyTorch? JAX? compatible with your stack?)

### Web search alternative
`site:github.com "<topic>" "<technique>" readme`

---

## HuggingFace

### Hub search
- **Models:** `https://huggingface.co/models?search=<query>&sort=downloads`
- **Datasets:** `https://huggingface.co/datasets?search=<query>&sort=downloads`
- **Spaces:** `https://huggingface.co/spaces?search=<query>&sort=likes`

### Useful filters
- **Models:** filter by task (text-classification, image-classification, etc.), library (pytorch, jax), language
- **Datasets:** filter by task, size, language, modality
- **Spaces:** filter by SDK (gradio, streamlit)

### What to look for
- Download count (adoption signal)
- Model card quality (documentation)
- Task tags (correct categorization)
- Linked paper (academic backing)
- Community discussions (known issues)

### API access
```python
from huggingface_hub import HfApi
api = HfApi()
models = api.list_models(search="mamba", sort="downloads", direction=-1)
datasets = api.list_datasets(search="anomaly detection", sort="downloads")
```

### Web search alternative
`site:huggingface.co "<topic>" model OR dataset`

---

## Papers With Code

### Key pages
- **Tasks:** `https://paperswithcode.com/task/<task-slug>`
- **Methods:** `https://paperswithcode.com/method/<method-slug>`
- **SOTA:** `https://paperswithcode.com/sota/<benchmark-slug>`
- **Search:** `https://paperswithcode.com/search?q=<query>`

### What to look for
- SOTA tables — who's on top, by how much, with what method
- Method pages — linked papers + code repos
- Task taxonomy — find adjacent tasks you might not have considered
- Benchmark pages — standard evaluation protocols

### Web search alternative
`site:paperswithcode.com "<topic>" "<technique>"`

---

## General Search Strategies

### Snowball search
1. Start with 1-2 key papers
2. Pull their references (what did they build on?)
3. Pull their citations (who built on them?)
4. Repeat for the most relevant results

### Author tracking
When you find a relevant paper, check the first/last author's recent publications — they likely have follow-up work.

### Trending detection
- GitHub: sort by "recently created" + "most stars this week"
- HuggingFace: sort by "trending"
- arXiv: check cs.LG/cs.AI daily listings for keyword matches
- Twitter/X: search for paper titles or arXiv IDs for community discussion

### Cross-platform verification
```
Paper found on arXiv → check GitHub for code → check HuggingFace for models → check Papers With Code for benchmarks
```

### Query expansion
Start with the exact topic, then expand:
1. Exact: "Mamba anomaly detection"
2. Component: "state space model" + "anomaly detection" separately
3. Adjacent: "selective scan" + "time series" or "out-of-distribution detection"
4. Competitor: "transformer anomaly detection" (to find what you'll compare against)
