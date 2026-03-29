# /new-domain

Scaffold a complete new domain template with all 8 required folders and placeholder files.

## Steps

1. **Get the domain name** from the user if not provided. Confirm it is kebab-case and does
   not conflict with an existing domain in the repo.

2. **Invoke `domain-planner`** to discover what the user needs. The planner asks about
   their workflows, pain points, repetitive tasks, conventions, and external tools, then
   maps those answers to agents, skills, commands, hooks, rules, and MCP configs. Present
   the domain plan to the user and wait for approval before proceeding.

3. **Invoke `template-architect`** to turn the approved plan into a domain spec: the proposed
   agent list, skill list, command list, hook list, rules list, and MCP configs, with base
   vs. domain placement rationale for each. Present the spec to the user and wait for
   approval before writing files.

4. **Create the folder structure** at `<domain-name>/`:
   ```
   <domain-name>/
   ├── agents/
   ├── skills/
   ├── commands/
   ├── hooks/
   ├── rules/
   ├── mcp-configs/
   ├── scripts/
   └── tests/
   ```

5. **Create placeholder files** for each item in the approved spec:
   - Each agent: `agents/<name>.md` — use the agent file format from `agent-author`
   - Each skill: `skills/<name>/SKILL.md` — use the SKILL.md format from `skill-authoring`
   - Each command: `commands/<name>.md` — brief placeholder with `# /<name>` header and TODO
   - Each hook: `hooks/<name>.sh` — shell stub with `set -euo pipefail` and a TODO comment
   - `scripts/setup-env.js` — stub with a TODO comment for environment setup steps
   - `tests/<hook-name>.test.js` — stub with a TODO comment per hook
   - Each rules file: `rules/<name>.md` — brief placeholder with the rule name as H1

6. **Create `<domain-name>/CLAUDE.md`** with domain-specific context. Use this template:
   ```markdown
   # <Domain Name> — Claude Code Template

   <!-- Project-specific: fill in before using this template -->
   **Project:** <project-name>
   **Primary language(s):** <languages>
   **Key frameworks/tools:** <tools>
   **Team conventions:** <any team-specific notes>

   ---

   ## Domain context

   [One paragraph describing what this domain covers and what makes it distinct.]

   ## Key rules

   [Summary of the most important rules in the rules/ folder.]

   ## Agents

   [Table of agents with one-line descriptions.]

   ## Skills

   [Table of skills with one-line descriptions.]

   ## Commands

   [Table of commands with one-line descriptions.]
   ```

7. **Update `versions.json`** — add the new domain at `"1.0.0"` and update `_updated` to
   today's date.

8. **Update `CHANGELOG.md`** — add an entry: `[<domain>@1.0.0] — <date>` with an Added
   section listing all created files.

9. **Update the root `CLAUDE.md`** — add the new domain to the Template Domains table and
   the Project Structure tree.

10. **Run `/verify`** before committing. No commit proceeds until it passes.

## Output

Confirm each created file with its path. At the end, print:
```
/new-domain <name> — complete
Files created: <n>
Next: Fill in placeholder TODOs, then run /verify before committing.
```
