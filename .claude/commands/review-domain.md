# /review-domain

Audit a domain template against repo conventions and produce a structured gap report.

## Usage

```
/review-domain <domain-name>
```

If no domain is specified, ask the user which domain to audit.

## Steps

1. **Confirm the domain exists** — check that `<domain>/` folder is present in the repo root.
   If not, stop and report: "Domain '<name>' not found. Available domains: <list>."

2. **Invoke `domain-reviewer`** to run the full audit checklist against the target domain.
   The reviewer runs all checks across five categories:
   - Structure (8 required folders)
   - Agent files (required sections, tool allowlists)
   - Skill files (frontmatter, triggers, line count)
   - Hook files (set -euo pipefail, test coverage)
   - MCP config files (no wildcards, no hardcoded credentials, comment present)

3. **Run the base promotion check** — compare domain files against base files to identify
   near-identical duplicates. Any file that is identical or near-identical to a base file,
   or that would be identical across 3+ domains, is a base promotion candidate.

4. **Output the structured gap report** in the domain-reviewer output format.

5. **Do not make any changes.** This command is read-only. If the user asks to fix gaps after
   seeing the report, invoke the appropriate authoring agent:
   - Agent gaps → `agent-author`
   - Skill gaps → `skill-author`
   - Missing command files → write directly
   - Hook gaps → write the hook file and its test
   - Base promotion → surface to user; base changes require a `base/` branch

## When to run

- Before adding new agents, skills, or commands to a domain (know the baseline first)
- Before cutting a release that includes changes to a domain
- When a domain has not been touched in a while and you want to confirm it is still compliant
- As part of PR review for any domain changes

## Output

See `domain-reviewer` output format. Paste the full output when requesting a PR review.
