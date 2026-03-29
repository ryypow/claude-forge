#!/usr/bin/env node

/**
 * validate.js — Validates a domain template's structure and content
 *
 * Usage:
 *   node validate.js <domain-path>
 *   node validate.js ../ml
 *   node validate.js .   (validate current directory as a domain)
 *
 * Checks:
 *   - All 8 required folders exist
 *   - CLAUDE.md exists at domain root
 *   - All SKILL.md files have valid frontmatter (name, description, triggers)
 *   - All agent files have required sections (Role, Allowed Tools, activation)
 *   - All shell hooks start with set -euo pipefail
 *   - No secrets patterns in any file
 *   - No wildcard allowed-tools in agent files
 */

const fs = require("fs");
const path = require("path");

// --- Configuration ---

const REQUIRED_FOLDERS = [
  "agents",
  "skills",
  "commands",
  "hooks",
  "rules",
  "mcp-configs",
  "scripts",
  "tests",
];

const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
  /gh[ps]_[A-Za-z0-9_]{36,}/,
  /xox[bpsar]-[A-Za-z0-9-]{10,}/,
];

// --- Validators ---

function checkStructure(domainPath) {
  const findings = [];

  // Check CLAUDE.md
  if (!fs.existsSync(path.join(domainPath, "CLAUDE.md"))) {
    findings.push({
      severity: "FAIL",
      category: "structure",
      message: "Missing CLAUDE.md at domain root",
    });
  }

  // Check required folders
  for (const folder of REQUIRED_FOLDERS) {
    const folderPath = path.join(domainPath, folder);
    if (!fs.existsSync(folderPath)) {
      findings.push({
        severity: "FAIL",
        category: "structure",
        message: `Missing required folder: ${folder}/`,
      });
    } else if (fs.readdirSync(folderPath).length === 0) {
      findings.push({
        severity: "WARN",
        category: "structure",
        message: `Empty folder: ${folder}/ — consider adding a placeholder or removing if intentional`,
      });
    }
  }

  return findings;
}

function checkSkills(domainPath) {
  const findings = [];
  const skillsDir = path.join(domainPath, "skills");

  if (!fs.existsSync(skillsDir)) return findings;

  const skillFolders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const folder of skillFolders) {
    const skillFile = path.join(skillsDir, folder.name, "SKILL.md");

    if (!fs.existsSync(skillFile)) {
      findings.push({
        severity: "FAIL",
        category: "content",
        message: `skills/${folder.name}/ exists but has no SKILL.md`,
      });
      continue;
    }

    const content = fs.readFileSync(skillFile, "utf-8");

    // Check frontmatter
    if (!content.startsWith("---")) {
      findings.push({
        severity: "FAIL",
        category: "content",
        message: `skills/${folder.name}/SKILL.md missing frontmatter`,
      });
      continue;
    }

    const frontmatter = content.split("---")[1] || "";

    if (!frontmatter.includes("name:")) {
      findings.push({
        severity: "FAIL",
        category: "content",
        message: `skills/${folder.name}/SKILL.md frontmatter missing 'name'`,
      });
    }

    if (!frontmatter.includes("description:")) {
      findings.push({
        severity: "FAIL",
        category: "content",
        message: `skills/${folder.name}/SKILL.md frontmatter missing 'description'`,
      });
    }

    if (!frontmatter.includes("triggers:")) {
      findings.push({
        severity: "FAIL",
        category: "content",
        message: `skills/${folder.name}/SKILL.md frontmatter missing 'triggers'`,
      });
    }

    // Check length
    const lines = content.split("\n").length;
    if (lines > 300) {
      findings.push({
        severity: "WARN",
        category: "content",
        message: `skills/${folder.name}/SKILL.md is ${lines} lines (max recommended: 300)`,
      });
    }
  }

  return findings;
}

function checkAgents(domainPath) {
  const findings = [];
  const agentsDir = path.join(domainPath, "agents");

  if (!fs.existsSync(agentsDir)) return findings;

  const agentFiles = fs.readdirSync(agentsDir)
    .filter((f) => f.endsWith(".md"));

  for (const file of agentFiles) {
    const content = fs.readFileSync(path.join(agentsDir, file), "utf-8");
    const lower = content.toLowerCase();

    if (!lower.includes("## role") && !lower.includes("# role")) {
      findings.push({
        severity: "WARN",
        category: "content",
        message: `agents/${file} missing Role section`,
      });
    }

    if (!lower.includes("allowed tools")) {
      findings.push({
        severity: "FAIL",
        category: "content",
        message: `agents/${file} missing Allowed Tools section`,
      });
    }

    if (lower.includes("allowed-tools: *") || lower.includes("allowed tools: *")) {
      findings.push({
        severity: "FAIL",
        category: "security",
        message: `agents/${file} has wildcard allowed-tools — must list specific tools`,
      });
    }

    if (!lower.includes("## what this agent does not do") && !lower.includes("does not")) {
      findings.push({
        severity: "WARN",
        category: "content",
        message: `agents/${file} missing scope boundaries (what the agent does NOT do)`,
      });
    }
  }

  return findings;
}

function checkHooks(domainPath) {
  const findings = [];
  const hooksDir = path.join(domainPath, "hooks");

  if (!fs.existsSync(hooksDir)) return findings;

  const hookFiles = fs.readdirSync(hooksDir)
    .filter((f) => f.endsWith(".sh"));

  for (const file of hookFiles) {
    const content = fs.readFileSync(path.join(hooksDir, file), "utf-8");

    if (!content.includes("set -euo pipefail")) {
      findings.push({
        severity: "FAIL",
        category: "content",
        message: `hooks/${file} missing 'set -euo pipefail'`,
      });
    }

    if (/\beval\b/.test(content)) {
      findings.push({
        severity: "FAIL",
        category: "security",
        message: `hooks/${file} uses eval — banned in shell hooks`,
      });
    }
  }

  return findings;
}

function checkSecrets(domainPath) {
  const findings = [];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        walkDir(fullPath);
      } else {
        // Skip binary files
        if (/\.(png|jpg|gif|ico|woff|ttf|pdf)$/.test(entry.name)) continue;

        const content = fs.readFileSync(fullPath, "utf-8");
        const relativePath = path.relative(domainPath, fullPath);

        for (const pattern of SECRET_PATTERNS) {
          if (pattern.test(content)) {
            findings.push({
              severity: "FAIL",
              category: "security",
              message: `${relativePath} matches secret pattern: ${pattern.source.substring(0, 30)}...`,
            });
            break;
          }
        }
      }
    }
  }

  walkDir(domainPath);
  return findings;
}

// --- Main ---

function main() {
  const domainPath = path.resolve(process.argv[2] || ".");

  if (!fs.existsSync(domainPath)) {
    console.error(`Error: Path does not exist: ${domainPath}`);
    process.exit(1);
  }

  console.log(`Validating: ${domainPath}\n`);

  const allFindings = [
    ...checkStructure(domainPath),
    ...checkSkills(domainPath),
    ...checkAgents(domainPath),
    ...checkHooks(domainPath),
    ...checkSecrets(domainPath),
  ];

  // Group by category
  const categories = {
    structure: allFindings.filter((f) => f.category === "structure"),
    content: allFindings.filter((f) => f.category === "content"),
    security: allFindings.filter((f) => f.category === "security"),
  };

  let hasFailures = false;

  for (const [category, findings] of Object.entries(categories)) {
    const fails = findings.filter((f) => f.severity === "FAIL");
    const warns = findings.filter((f) => f.severity === "WARN");
    const total = fails.length + warns.length;

    if (total === 0) {
      console.log(`PASS  ${category} (all clear)`);
    } else {
      if (fails.length > 0) {
        hasFailures = true;
        console.log(`FAIL  ${category} (${fails.length} failures)`);
      } else {
        console.log(`WARN  ${category} (${warns.length} warnings)`);
      }

      findings.forEach((f) => {
        const icon = f.severity === "FAIL" ? "  \u2717" : "  \u26A0";
        console.log(`${icon} ${f.message}`);
      });
    }
    console.log();
  }

  if (hasFailures) {
    console.log("Validation FAILED. Resolve failures before committing.");
    process.exit(1);
  } else {
    console.log("Validation PASSED.");
    process.exit(0);
  }
}

main();
