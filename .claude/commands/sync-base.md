# /sync-base

Scan all domain templates for files that are duplicated across 3 or more domains and should
be promoted to base instead.

## Steps

1. **Collect all domain files** — glob every file across all 8 domain folders, grouped by
   relative path (e.g., all files named `rules/security-baseline.md`, all files at
   `hooks/pre-tool-use.sh`).

2. **Identify exact duplicates** — for each file that exists in 3 or more domains, compare
   content. If two files at the same relative path have identical or near-identical content
   (differences are only domain-specific names/labels), flag as a promotion candidate.

3. **Identify near-duplicates** — for files at different paths, compare content semantically.
   If two or more domain files encode the same rule, pattern, or convention using different
   wording, flag as a potential consolidation candidate (lower confidence — present to user
   for a judgement call).

4. **Report findings** in this format:

```
/sync-base — <date>

EXACT DUPLICATES (promote to base)
  rules/git-conventions.md — identical in: devops, api-backend, frontend, ml
    → Promote to base/rules/git-conventions.md
    → Remove from each domain after base promotion

  hooks/pre-commit.sh — identical in: api-backend, frontend
    → Only 2 domains — does not meet 3-domain threshold
    → Monitor; promote if a third domain adopts it

NEAR-DUPLICATES (judgement call)
  rules/security-baseline.md — similar across: ml, devops, data-engineering
    → Core rules identical; domain-specific additions differ
    → Recommendation: promote core to base, keep domain-specific additions in each domain

NOTHING TO PROMOTE
  (if no candidates found)

SUMMARY
  Exact promotion candidates: <n>
  Near-duplicate candidates: <n>
  Below threshold (< 3 domains): <n>
```

5. **Do not promote anything automatically.** Base changes are high-impact — they affect every
   downstream domain. Present findings and wait for explicit user instruction.

6. **If the user approves a promotion:**
   - The change requires a dedicated `base/<description>` branch (not `dev` or a feature branch)
   - Copy the file to `base/<folder>/<filename>`
   - Remove from each domain that had the duplicate
   - Update each domain's `versions.json` with a patch bump (base promotion = patch for domains)
   - Update base `versions.json` with a minor bump (adding a file to base is a minor change)
   - Update `CHANGELOG.md` for base and each affected domain
   - Run `/verify` before committing

## When to run

- Before starting work on a new domain (check if its common files already exist in other domains)
- After adding similar files to 2+ domains (check if you are heading toward a promotion case)
- Periodically as part of repo maintenance
