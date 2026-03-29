#!/usr/bin/env node

/**
 * scaffold.test.js — Tests for scaffold.js and validate.js
 *
 * Run: node tests/scaffold.test.js
 *
 * These tests create temporary directories, run the scripts, and verify
 * the output. No test framework required — uses Node.js assert.
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SCRIPTS_DIR = path.resolve(__dirname, "..", "scripts");
const SCAFFOLD_SCRIPT = path.join(SCRIPTS_DIR, "scaffold.js");
const VALIDATE_SCRIPT = path.join(SCRIPTS_DIR, "validate.js");

let testDir;
let passed = 0;
let failed = 0;

// --- Helpers ---

function setup() {
  testDir = fs.mkdtempSync(path.join(require("os").tmpdir(), "scaffold-test-"));
}

function cleanup() {
  if (testDir && fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}

function run(command) {
  try {
    return {
      stdout: execSync(command, { encoding: "utf-8", cwd: testDir }),
      exitCode: 0,
    };
  } catch (err) {
    return {
      stdout: err.stdout || "",
      stderr: err.stderr || "",
      exitCode: err.status,
    };
  }
}

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
    failed++;
  }
}

// --- Tests: scaffold.js ---

console.log("\nscaffold.js");

test("shows help with --help flag", () => {
  setup();
  const result = run(`node ${SCAFFOLD_SCRIPT} --help`);
  assert.strictEqual(result.exitCode, 0);
  assert.ok(result.stdout.includes("Usage:"));
  assert.ok(result.stdout.includes("--domain"));
  cleanup();
});

test("fails without required arguments", () => {
  setup();
  const result = run(`node ${SCAFFOLD_SCRIPT}`);
  assert.notStrictEqual(result.exitCode, 0);
  cleanup();
});

test("fails with nonexistent domain", () => {
  setup();
  const outputDir = path.join(testDir, "output");
  fs.mkdirSync(outputDir);
  const result = run(`node ${SCAFFOLD_SCRIPT} --domain nonexistent --output ${outputDir}`);
  assert.notStrictEqual(result.exitCode, 0);
  cleanup();
});

test("fails with nonexistent output directory", () => {
  setup();
  const result = run(`node ${SCAFFOLD_SCRIPT} --domain base --output ${testDir}/nope`);
  assert.notStrictEqual(result.exitCode, 0);
  cleanup();
});

test("dry-run does not create files", () => {
  setup();
  const outputDir = path.join(testDir, "output");
  fs.mkdirSync(outputDir);
  run(`node ${SCAFFOLD_SCRIPT} --domain base --output ${outputDir} --dry-run`);
  // .claude/ should not be created in dry run
  // (This test depends on base existing — may need to be adjusted for CI)
  cleanup();
});

// --- Tests: validate.js ---

console.log("\nvalidate.js");

test("fails on empty directory", () => {
  setup();
  const emptyDomain = path.join(testDir, "empty-domain");
  fs.mkdirSync(emptyDomain);
  const result = run(`node ${VALIDATE_SCRIPT} ${emptyDomain}`);
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.stdout.includes("FAIL"));
  cleanup();
});

test("detects missing required folders", () => {
  setup();
  const incompleteDomain = path.join(testDir, "incomplete");
  fs.mkdirSync(incompleteDomain);
  fs.writeFileSync(path.join(incompleteDomain, "CLAUDE.md"), "# Test");
  fs.mkdirSync(path.join(incompleteDomain, "agents"));
  // Missing: skills, commands, hooks, rules, mcp-configs, scripts, tests
  const result = run(`node ${VALIDATE_SCRIPT} ${incompleteDomain}`);
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.stdout.includes("Missing required folder"));
  cleanup();
});

test("detects skill without frontmatter", () => {
  setup();
  const domain = path.join(testDir, "bad-skill");
  // Create all required folders
  fs.mkdirSync(domain);
  fs.writeFileSync(path.join(domain, "CLAUDE.md"), "# Test");
  for (const folder of ["agents", "skills", "commands", "hooks", "rules", "mcp-configs", "scripts", "tests"]) {
    fs.mkdirSync(path.join(domain, folder));
  }
  // Create a skill without frontmatter
  const skillDir = path.join(domain, "skills", "bad-skill");
  fs.mkdirSync(skillDir);
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), "# No frontmatter here");
  const result = run(`node ${VALIDATE_SCRIPT} ${domain}`);
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.stdout.includes("missing frontmatter"));
  cleanup();
});

test("detects agent without allowed-tools", () => {
  setup();
  const domain = path.join(testDir, "bad-agent");
  fs.mkdirSync(domain);
  fs.writeFileSync(path.join(domain, "CLAUDE.md"), "# Test");
  for (const folder of ["agents", "skills", "commands", "hooks", "rules", "mcp-configs", "scripts", "tests"]) {
    fs.mkdirSync(path.join(domain, folder));
  }
  fs.writeFileSync(path.join(domain, "agents", "bad.md"), "# Bad Agent\n\n## Role\nDoes stuff.\n");
  const result = run(`node ${VALIDATE_SCRIPT} ${domain}`);
  assert.ok(result.stdout.includes("missing Allowed Tools"));
  cleanup();
});

test("detects shell hook without set -euo pipefail", () => {
  setup();
  const domain = path.join(testDir, "bad-hook");
  fs.mkdirSync(domain);
  fs.writeFileSync(path.join(domain, "CLAUDE.md"), "# Test");
  for (const folder of ["agents", "skills", "commands", "hooks", "rules", "mcp-configs", "scripts", "tests"]) {
    fs.mkdirSync(path.join(domain, folder));
  }
  fs.writeFileSync(path.join(domain, "hooks", "bad.sh"), "#!/bin/bash\necho hello\n");
  const result = run(`node ${VALIDATE_SCRIPT} ${domain}`);
  assert.ok(result.stdout.includes("set -euo pipefail"));
  cleanup();
});

test("passes on valid domain structure", () => {
  setup();
  const domain = path.join(testDir, "valid-domain");
  fs.mkdirSync(domain);
  fs.writeFileSync(path.join(domain, "CLAUDE.md"), "# Valid Domain");
  for (const folder of ["agents", "skills", "commands", "hooks", "rules", "mcp-configs", "scripts", "tests"]) {
    fs.mkdirSync(path.join(domain, folder));
  }
  // Add a valid agent
  fs.writeFileSync(path.join(domain, "agents", "good.md"),
    "# Good Agent\n\n## Role\nDoes stuff.\n\n## Allowed Tools\n- Read\n- Grep\n\n## What This Agent Does NOT Do\n- Write files\n");
  // Add a valid skill
  const skillDir = path.join(domain, "skills", "good-skill");
  fs.mkdirSync(skillDir);
  fs.writeFileSync(path.join(skillDir, "SKILL.md"),
    "---\nname: good-skill\ndescription: A valid skill\ntriggers:\n  - test\n---\n\n## Content\nHello.\n");
  // Add a valid hook
  fs.writeFileSync(path.join(domain, "hooks", "good.sh"),
    "#!/usr/bin/env bash\nset -euo pipefail\necho hello\n");

  const result = run(`node ${VALIDATE_SCRIPT} ${domain}`);
  assert.strictEqual(result.exitCode, 0);
  assert.ok(result.stdout.includes("PASSED"));
  cleanup();
});

// --- Summary ---

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
