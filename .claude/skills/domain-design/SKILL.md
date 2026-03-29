---
name: domain-design
description: Guides the process of scoping, qualifying, and structuring a new domain template — from deciding whether a domain earns its own template to producing a complete folder spec before any files are written.
domain: meta
triggers:
  - design a new domain
  - does this domain qualify
  - should this be its own template
  - what belongs in base vs domain
  - new domain scope
  - domain qualification criteria
  - scaffold a domain
---

## Overview

This skill covers the methodology for deciding whether a new domain earns its own template,
what should live in that domain vs. the base layer, and how to produce a domain spec before
authoring begins. It does not cover writing the actual files — that is skill-authoring,
agent-author, and the relevant authoring agents.

---

## Phase 1: Qualification

Before designing anything, verify the domain qualifies. A domain earns its own template only
if ALL THREE criteria are met:

**1. Distinct MCPs**
The domain requires tool integrations that would be noise or irrelevant in other domains.
Examples that qualify: wandb (ML), PagerDuty (DevOps), OpenOCD (embedded).
Examples that do not: GitHub (universal — lives in base), a generic REST client.

**2. Domain-specific rules**
The domain has hard rules that would create false positives if applied to other domains.
Examples that qualify: embedded's memory safety rules (would flag valid heap usage in backend),
ML's reproducibility rules (irrelevant in a frontend project).
Examples that do not: "prefer early returns" — this is a style preference, not a domain rule.

**3. Fundamentally different development loop**
The workflow cycle is meaningfully different from adjacent domains.
Examples that qualify:
- Embedded: write → cross-compile → flash → debug via JTAG
- ML: data prep → train → evaluate → iterate on hyperparameters
- DevOps: design → plan → apply → validate → rollback path
Examples that do not: "we deploy to AWS" — most domains deploy somewhere.

**Verdict logic:**
- 3/3 → proceed to Phase 2
- 2/3 → likely belongs as an extension of an existing domain; identify which one
- 1/3 or 0/3 → does not qualify; add to base or an existing domain

---

## Phase 2: Scope definition

Once qualified, define the domain's scope with sharp edges.

### What to include

Ask: "What does a professional in this domain do that other domains don't?"
- Specific workflows unique to this discipline
- Failure modes specific to this domain (e.g., gradient explosion in ML, ISR deadlocks in embedded)
- Tools and platforms that practitioners in this domain use daily

### What to exclude

Ask: "What does this domain share with adjacent domains?"
- Security hygiene → base
- Git workflow → base
- General debugging → base
- Generic code review → base

### Common scope errors

- **Too broad**: "AI" as a domain — covers ML, LLM apps, data engineering, and embedded inference. Split it.
- **Too narrow**: "TensorFlow projects" — this is a framework preference, not a domain. It belongs as a note in the ML domain's CLAUDE.md.
- **Premature**: Defining a domain for one project you're working on right now. Wait until you can identify a recurring pattern across multiple projects.

---

## Phase 3: Folder spec

Every domain must have exactly these 8 folders. Produce this spec before writing any files:

```
agents/
  - <name>: <one-line purpose>      (minimum 2, maximum 5)

skills/
  - <name>/SKILL.md: <one-line>     (minimum 2, maximum 5)

commands/
  - <name>.md: <one-line>           (minimum 3, maximum 8)

hooks/
  - <name>.sh: <what it guards>     (at least 1; must have test counterpart)

rules/
  - <name>.md: <what rule it encodes>  (minimum 2)

mcp-configs/
  - <name>.json: <which service, why this domain needs it>

scripts/
  - setup-env.js: <what setup it performs>

tests/
  - <name>.test.js: <what it tests>  (one per hook, minimum)
```

### Sizing guidance

- **Agents**: 2–5. More than 5 suggests the domain scope is too broad.
- **Skills**: 2–5. Each skill should be independently activatable.
- **Commands**: 3–8. Cover the most common recurring workflows; don't scaffold every possible operation.
- **Hooks**: At minimum a pre-action validation hook. Add post-action hooks only when there is a meaningful check to perform (e.g., row counts after a pipeline run).

---

## Phase 4: Base vs. domain placement for each file

For every file in the spec, explicitly decide: base or domain?

Use this decision rule:
1. Would this file be identical in 3+ other domains? → base
2. Does this file reference domain-specific tools, frameworks, or workflows? → domain
3. Would this file create noise or false positives in other domains? → domain
4. Does this file override a base default? → domain, with a comment explaining why

Document base vs. domain calls in the spec output. Ambiguous calls should be surfaced to the
user before authoring begins.

---

## When NOT to apply this skill

If the domain is already qualified and you are writing individual files (agents, skills,
commands, hooks), switch to the `skill-authoring` or `template-conventions` skill instead.
This skill covers the decision phase, not the authoring phase.
