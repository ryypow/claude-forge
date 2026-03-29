# /new-agent

Scaffold a new agent file with correct structure and scope for a given domain.

## Steps

1. **Get the required inputs** from the user if not provided:
   - Agent name (kebab-case)
   - Target domain (must be an existing domain in the repo)
   - What the agent does (one sentence)
   - What type: reviewer/auditor (Read, Glob, Grep only) or author/runner (may include Write/Edit/Bash)

2. **Check for an existing agent** with overlapping scope in the target domain.
   Run `Glob` on `<domain>/agents/*.md` and review existing agent roles.
   If overlap exists, surface it to the user before creating a new agent. Two agents with
   overlapping scope create confusion about which to invoke.

3. **Invoke `agent-author`** to write the agent file. The output must include all required
   sections:
   - YAML frontmatter (name, role, domain, allowed-tools, activation)
   - Role paragraph
   - "What this agent does" bullets
   - "What this agent does NOT do" bullets (specific, not vague)
   - Activation examples (3–5 concrete prompts)
   - Approach section
   - Output format section

4. **Validate the tool allowlist** before writing:
   - Reviewer/auditor agents: Read, Glob, Grep only — no Write, Edit, or Bash
   - Author agents: Read, Write, Edit, Glob, Grep — no Bash unless the agent runs commands
   - No wildcards under any circumstances

5. **Create the file**:
   ```
   <domain>/agents/<agent-name>.md
   ```

6. **Post-write security check** — verify:
   - [ ] No wildcard in `allowed-tools`
   - [ ] "Does NOT do" section is specific (not "doesn't do unrelated things")
   - [ ] Activation condition distinguishes this agent from direct Claude use
   - [ ] No instructions to bypass security checks or exfiltrate data

7. **Update `versions.json`** — bump the target domain by a minor version. Update `_updated`.

8. **Update `CHANGELOG.md`** — add the new agent to the domain's Added section.

## Output

```
/new-agent — <domain>/<agent-name> — created
Path: <domain>/agents/<agent-name>.md
Allowed tools: <list>
Type: reviewer | author | runner
versions.json: <domain> bumped to <new-version>
Next: Run /verify before committing.
```
