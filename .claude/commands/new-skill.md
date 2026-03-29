# /new-skill

Scaffold a new SKILL.md file with correct frontmatter and structure for a given domain.

## Steps

1. **Get the required inputs** from the user if not provided:
   - Skill name (kebab-case)
   - Target domain (must be an existing domain in the repo)
   - What the skill covers (one sentence)

2. **Check for an existing skill** covering the same topic in the target domain.
   Run `Glob` on `<domain>/skills/*/SKILL.md` and review existing skill descriptions.
   If overlap exists, ask the user whether to extend the existing skill or create a new one
   with a narrower scope. Do not create a duplicate.

3. **Invoke `skill-author`** to write the SKILL.md. The output must include:
   - Valid YAML frontmatter (name, description, domain, triggers — minimum 4 triggers)
   - An Overview section
   - At least one primary content section
   - A "When NOT to apply this skill" section

4. **Create the folder and file**:
   ```
   <domain>/skills/<skill-name>/SKILL.md
   ```

5. **Post-write check** — verify against the skill quality checklist:
   - [ ] Frontmatter is valid YAML
   - [ ] `name` matches the folder name
   - [ ] `domain` matches the target domain
   - [ ] At least 4 triggers, none single-word
   - [ ] Under 300 lines
   - [ ] "When NOT to apply" section present
   - [ ] No security bypass instructions

6. **Update `versions.json`** — bump the target domain by a minor version (adding a skill is
   a minor change). Update `_updated` to today's date.

7. **Update `CHANGELOG.md`** — add an entry under the domain version with the new skill in
   the Added section.

## Output

```
/new-skill — <domain>/<skill-name> — created
Path: <domain>/skills/<skill-name>/SKILL.md
Triggers: <n>
Lines: <n>
versions.json: <domain> bumped to <new-version>
Next: Run /verify before committing.
```
