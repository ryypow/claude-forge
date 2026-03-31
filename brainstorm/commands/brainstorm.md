---
name: brainstorm
description: Full brainstorming pipeline — scout sources, generate novel ideas, check feasibility, design experiments
activation: /brainstorm <topic>
---

## Pipeline

When the user invokes `/brainstorm <topic>`, run the following pipeline:

### Step 1: Architecture Scout
Invoke the `architecture-scout` agent with the topic. It searches across arXiv, Semantic Scholar, GitHub, HuggingFace, and Papers With Code to produce a landscape report.

Present the scout report to the user. Ask if they want to refine the search or proceed.

### Step 2: Combination Brainstormer
Invoke the `combination-brainstormer` agent with the scout report as context. It generates 5-10 ranked idea cards with novelty and feasibility assessments.

Present the ideas to the user. Ask them to select 1-3 ideas to evaluate further.

### Step 3: Feasibility Checker
Invoke the `feasibility-checker` agent for each selected idea. It checks datasets, compute, baselines, novelty, and timeline.

Present feasibility cards. Ask the user to pick one idea to commit to.

### Step 4: Experiment Designer
Invoke the `experiment-designer` agent for the chosen idea. It produces a full experiment plan with baselines, ablations, metrics, and datasets.

Present the experiment plan. The brainstorming pipeline is complete.

---

## Usage

```
/brainstorm Mamba-based anomaly detection
/brainstorm efficient video understanding with state space models
/brainstorm few-shot learning for medical image classification
/brainstorm graph neural networks for drug discovery
```

Each agent in the pipeline can also be invoked independently:
- `architecture-scout` — just search, no ideas
- `combination-brainstormer` — just ideate from known context
- `feasibility-checker` — just evaluate a specific idea
- `experiment-designer` — just plan experiments for a committed idea
