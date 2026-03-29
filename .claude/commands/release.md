# /release

Run the release workflow for one or more domains. Cuts from `dev` → `main`.

## Usage

```
/release [<domain> ...]
```

If no domain is specified, ask the user which domains are being released.

## Pre-flight checks

Before starting, verify:

1. Current branch is `dev` (or a release branch off `dev`). If not, stop:
   "Release must be run from the dev branch. Current branch: <branch>."

2. `/verify` has been run and passed for all domains in scope. If not, run it now.
   Do not proceed if verify fails.

3. `versions.json` has been updated for all domains in scope. If any domain being released
   shows the same version as the last git tag for that domain, stop:
   "versions.json has not been updated for <domain>. Bump the version before releasing."

4. `CHANGELOG.md` has an entry for every domain being released. If any are missing, stop
   and ask the user to add the changelog entry before continuing.

## Release steps

Run these steps only after all pre-flight checks pass:

1. **Confirm versions** — read `versions.json` and display the version being tagged for
   each domain in scope. Ask for explicit confirmation before tagging:
   ```
   About to tag:
     ml@1.2.0
     base@1.1.0
   Confirm? (yes/no)
   ```

2. **Generate CHANGELOG entry** (if not already present) — produce a dated entry for each
   domain using the conventional format:
   ```markdown
   ## [<domain>@<version>] — <date>
   ### Added / Changed / Removed / Security
   - ...
   ```

3. **Create domain tags** — for each domain being released:
   ```bash
   git tag <domain>@<version>
   ```
   Example: `git tag ml@1.2.0`

4. **Create a repo-level release tag**:
   ```bash
   git tag release/<YYYY-MM-DD>
   ```

5. **Push tags to origin**:
   ```bash
   git push origin --tags
   ```

6. **Prepare the PR description** for `dev` → `main`. Use this format:
   ```
   ## Release — <date>

   ### Domains
   | Domain | Version |
   |---|---|
   | <domain> | <version> |

   ### Changes
   <paste relevant CHANGELOG entries>

   ### Verification
   <paste /verify output>

   ### Checklist
   - [ ] versions.json updated for all released domains
   - [ ] CHANGELOG.md entries complete
   - [ ] All tags pushed
   - [ ] /verify passed
   ```

7. **Open the PR manually** — do not auto-merge to main. Print the PR description and instruct
   the user to open the PR themselves:
   "PR description ready. Open a PR from dev → main with the above description. Never auto-merge."

## Important constraints

- Never auto-merge to main
- Never tag a domain that has not passed `/verify`
- Never tag a version already present in git tags (check with `git tag -l "<domain>@*"`)
- Base version bumps propagate: if base is being released, every domain gets at minimum a
  patch bump — add them to the release scope and update their versions.json entries
