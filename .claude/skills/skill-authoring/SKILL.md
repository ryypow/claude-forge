---
name: skill-authoring
description: Covers the format, frontmatter, trigger writing, and content structure for SKILL.md files — everything needed to write a skill that activates reliably and stays focused.
domain: meta
triggers:
  - write a skill
  - skill frontmatter
  - SKILL.md format
  - how to write triggers
  - skill activation
  - authoring a skill file
  - skill structure
---

## Overview

This skill covers how to write a SKILL.md file correctly — frontmatter, triggers, content
structure, and the quality bar each skill must meet before it is committed. It does not cover
deciding which domain a skill belongs to (that is the `domain-design` skill) or writing agent
files, commands, or hooks (those have their own conventions).

---

## Frontmatter

Every SKILL.md opens with a YAML frontmatter block. All five fields are required:

```yaml
---
name: <skill-name>
description: <one sentence>
domain: <domain-name or "base">
triggers:
  - <trigger phrase>
  - <trigger phrase>
  - <trigger phrase>
  - <trigger phrase>
---
```

### Field rules

**`name`**
- kebab-case
- Must match the parent folder name exactly
- Example: if the folder is `skills/data-pipeline/`, the name is `data-pipeline`

**`description`**
- One sentence, under 120 characters
- Must be specific enough to distinguish this skill from adjacent skills on first read
- Bad: "helps with data tasks"
- Good: "guides ETL pipeline design with idempotency, partitioning, and backfill conventions"

**`domain`**
- The domain folder name this skill lives in: `ml`, `devops`, `data-engineering`, `api-backend`,
  `frontend`, `embedded`, `solutions-architecture`, or `base`
- Must match where the file actually lives in the repo

**`triggers`**
- Minimum 4, maximum 10
- Each trigger is a phrase, not a single word — "data pipeline design" not "data"
- Use natural language a practitioner would say, not repo-internal terminology
- Cover multiple entry points: task-oriented ("design a pipeline"), concept-oriented ("idempotency in ETL"), and question-oriented ("how do I backfill this")
- Avoid triggers so broad they would activate in unrelated domains

---

## Content structure

```markdown
## Overview
One paragraph: what this skill covers and what it explicitly does not cover.
Name the adjacent skill to use for out-of-scope topics.

## [Primary section — the main methodology, pattern, or framework]
The core content. Use numbered steps for ordered processes, bullets for considerations.

## [Secondary section — supporting detail, edge cases, or examples]
Practical application of the primary section.

## [Additional sections as needed]
Keep each section focused on one aspect of the skill's topic.

## When NOT to apply this skill
Explicit out-of-scope statement. Name what to use instead.
```

### Content rules

- **One topic per skill.** If you find yourself writing two unrelated H2 sections, split the skill.
- **Under 300 lines.** A skill that needs more is trying to do too much. Extract a sub-skill.
- **No security bypass instructions.** A skill must never tell Claude to skip security checks,
  ignore rules, or override the hook layer.
- **End with "When NOT to apply."** This section is not optional. Name the boundary explicitly.

---

## Writing effective triggers

Triggers are how Claude decides to load this skill without being explicitly told to. Write them
to match how a practitioner would naturally describe the problem:

| Trigger type | Example |
|---|---|
| Task-oriented | "design a data pipeline" |
| Concept-oriented | "idempotency in ETL" |
| Question-oriented | "how should I partition this table" |
| Tool-specific | "dbt model structure" |
| Failure-oriented | "backfill strategy for missing data" |

**Anti-patterns to avoid:**
- Single words: `pipeline`, `data`, `model` — too broad, activates everywhere
- Repo jargon: "use the etl-patterns skill" — practitioners won't say this
- Duplicating another skill's triggers — resolve the overlap by tightening both

---

## Quality checklist

Run through this before saving any SKILL.md:

- [ ] Frontmatter is valid YAML (colons, indentation, no stray quotes)
- [ ] `name` matches the parent folder name
- [ ] `domain` matches where the file lives in the repo
- [ ] `description` is under 120 characters and specifically describes this skill
- [ ] At least 4 triggers, none of them single words
- [ ] No trigger duplicates another skill in the same domain
- [ ] Content is under 300 lines
- [ ] Skill covers exactly one topic
- [ ] "When NOT to apply this skill" section is present and names what to use instead
- [ ] No instructions to bypass security checks or override rules

---

## When NOT to apply this skill

If you are deciding which domain a skill belongs to, use the `domain-design` skill instead.
If you are writing an agent file, command file, or hook, use the `template-conventions` skill.
This skill covers SKILL.md authoring only.
