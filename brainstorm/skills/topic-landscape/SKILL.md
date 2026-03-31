---
name: topic-landscape
description: Methodology for rapidly mapping any ML/AI problem space — decomposing topics, identifying method taxonomies, spotting gaps, and finding cross-domain opportunities
domain: brainstorm
triggers:
  - map the landscape for
  - what methods exist for
  - overview of approaches to
  - taxonomy of
  - state of the art in
  - what's the current landscape
  - spot gaps in
  - what hasn't been tried for
  - cross-domain opportunities
  - decompose this topic
---

## Overview

This skill provides the methodology for mapping any ML/AI problem space from scratch. It's the knowledge behind how `architecture-scout` structures its search and how `combination-brainstormer` identifies gaps. Use it to turn a vague topic into a structured understanding of what exists, what's missing, and where opportunity lies.

---

## Step 1: Topic Decomposition

Break any ML topic into orthogonal dimensions:

### Dimension A: Problem formulation
How is the problem framed? Same underlying data can be approached differently:
- Supervised vs. unsupervised vs. self-supervised
- Classification vs. regression vs. generation vs. detection
- Online vs. offline
- Point prediction vs. sequence prediction

### Dimension B: Architecture family
What model architectures are used?
- Transformer-based (attention mechanisms)
- SSM-based (Mamba, S4, state space models)
- CNN-based (convolutions, residual networks)
- GNN-based (graph neural networks)
- RNN-based (LSTM, GRU — legacy but still used)
- Hybrid (combinations of the above)
- Classical ML (random forests, SVMs, etc.)

### Dimension C: Data modality
What kind of data does the method operate on?
- Time-series / sequential
- Images / video
- Text / language
- Tabular / structured
- Graph / relational
- Audio / speech
- Multimodal (combinations)

### Dimension D: Training paradigm
How is the model trained?
- Supervised (labeled examples)
- Self-supervised (pretext tasks, contrastive learning, masked prediction)
- Semi-supervised (few labels + many unlabeled)
- Unsupervised (no labels — clustering, reconstruction, density estimation)
- Few-shot / zero-shot / meta-learning
- Reinforcement learning

### Creating a topic map
Cross the dimensions to find your specific niche:
```
[Problem] × [Architecture] × [Data] × [Training] = your research position

Example: anomaly detection × Mamba × time-series × self-supervised
```

Each cell in this cross-product is either occupied (existing work) or empty (gap = opportunity).

---

## Step 2: Method Taxonomy

For any problem domain, identify the major families of approaches:

### Template
```
[Domain] methods:
├── Family A: [description]
│   ├── Sub-approach A1
│   └── Sub-approach A2
├── Family B: [description]
│   ├── Sub-approach B1
│   └── Sub-approach B2
└── Family C: [description]
```

### Example: Anomaly Detection
```
Anomaly detection methods:
├── Reconstruction-based: learn normal → flag high reconstruction error
│   ├── Autoencoders (vanilla, variational, masked)
│   └── Diffusion-based (denoise normal, anomalies resist denoising)
├── Contrastive / self-supervised: learn representations → anomalies map far from normal
│   ├── Contrastive learning (SimCLR-style)
│   └── Knowledge distillation (student-teacher disagreement = anomaly)
├── Density-based: model the normal distribution → low-density = anomaly
│   ├── Normalizing flows
│   └── Energy-based models
├── Classification-based: learn a boundary around normal
│   ├── One-class SVM / SVDD
│   └── Deep SVDD
└── Hybrid: combine multiple signals
    ├── Multi-head (reconstruction + classification)
    └── Ensemble (multiple diverse detectors)
```

---

## Step 3: Gap Identification

Gaps are where novelty lives. Look for:

### Unexplored cells
Cross architecture × problem. Which architectures haven't been tried for this task?
- "Has anyone used [new architecture] for [this task]?" → search arXiv
- If no results: that's a gap

### Underexplored combinations
Two techniques that have each been shown to work but haven't been combined:
- "Method A improves X. Method B improves Y. Has anyone combined A + B?"
- If no: potential idea

### Missing modalities
A technique works for modality A. Has it been adapted for modality B?
- "Vision Mamba exists. Does Audio Mamba? Does Graph Mamba?"

### Scale gaps
An approach works at small scale. Has it been made efficient / scaled up?
- "Method X works but requires 8 A100s. Can it work on a single consumer GPU?"

### Evaluation gaps
A method was evaluated on dataset A only. Does it generalize?
- "All papers in this area use benchmark X. What about benchmark Y?"

---

## Step 4: State of the Art Tracking

### How to determine current SOTA
1. Check Papers With Code for the relevant benchmark
2. Check the most recent survey paper (last 12 months)
3. Check the most-cited recent paper — its baselines show the competitive landscape
4. Cross-reference: if a method is SOTA on PwC but no one cites it, it might be overfitting to the benchmark

### What to track
- **Current best:** method, result, paper, year
- **Trajectory:** is improvement slowing down? (diminishing returns = mature area, harder to beat)
- **Recent jumps:** any method that significantly beat SOTA recently (new paradigm)
- **Open challenges:** what does the survey paper say is still unsolved?

---

## Step 5: Cross-Domain Transfer Opportunities

The highest-novelty ideas often come from applying technique X from domain A to domain B.

### Pattern
```
Technique from [Source Domain] → applied to [Target Domain]
```

### How to find these
1. Identify what's working well in adjacent domains (e.g., language modeling techniques for time-series)
2. Ask: "Why hasn't this been tried?" — if the answer is "no one thought of it" (vs. "it fundamentally doesn't apply"), that's an opportunity
3. Look for analogies: "This problem in domain B is structurally similar to a solved problem in domain A"

### Recent successful transfers
- Transformers: NLP → Vision → Audio → Time-series → Graphs
- Diffusion models: Image generation → Audio → Video → Anomaly detection
- Contrastive learning: Vision → NLP → Time-series → Tabular
- State space models (Mamba): Language → Vision → Audio → (what's next?)

### Signals that transfer will work
- The data has similar structure (sequential, spatial, hierarchical)
- The task has a similar objective (reconstruction, classification, generation)
- The challenge is similar (long-range dependencies, efficiency, few labels)

---

## Quick Reference: Mapping a New Topic

```
1. Define the topic in one sentence
2. Decompose: problem × architecture × data × training
3. Build the method taxonomy (what families of approaches exist?)
4. Check SOTA (Papers With Code + recent survey)
5. Cross the dimensions → find empty cells = gaps
6. Check adjacent domains for transferable techniques
7. Output: topic map with gaps highlighted
```
