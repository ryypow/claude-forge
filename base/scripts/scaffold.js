#!/usr/bin/env node

/**
 * scaffold.js — Merges base + domain into a project's .claude/ folder
 *
 * Usage:
 *   node scaffold.js --domain ml --output ~/projects/my-project
 *
 * What it does:
 *   1. Copies base/ contents into <output>/.claude/
 *   2. Copies <domain>/ contents on top (domain wins on conflicts)
 *   3. Copies <domain>/CLAUDE.md to <output>/CLAUDE.md
 *   4. Reports what was copied and any conflicts resolved
 *
 * The output directory must exist. The .claude/ subfolder is created if needed.
 */

const fs = require("fs");
const path = require("path");

// --- CLI Parsing ---

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--domain" && argv[i + 1]) {
      args.domain = argv[++i];
    } else if (argv[i] === "--output" && argv[i + 1]) {
      args.output = argv[++i];
    } else if (argv[i] === "--dry-run") {
      args.dryRun = true;
    } else if (argv[i] === "--help" || argv[i] === "-h") {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  console.log(`
Usage: node scaffold.js --domain <domain> --output <project-path>

Options:
  --domain <name>    Domain template to use (e.g., ml, devops, frontend)
  --output <path>    Target project directory (must exist)
  --dry-run          Show what would be copied without copying
  --help             Show this help message

Available domains:
  ml | devops | data-engineering | solutions-architecture
  api-backend | frontend | embedded | deep-research

Example:
  node scaffold.js --domain ml --output ~/projects/my-ml-project
`);
}

// --- File Operations ---

/**
 * Recursively copy a directory, returning a list of copied files.
 * Skips CLAUDE.md at the domain root (handled separately).
 */
function copyDir(src, dest, options = {}) {
  const { dryRun = false, layer = "base" } = options;
  const copied = [];
  const conflicts = [];

  if (!fs.existsSync(src)) {
    return { copied, conflicts };
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!dryRun && !fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      const sub = copyDir(srcPath, destPath, options);
      copied.push(...sub.copied);
      conflicts.push(...sub.conflicts);
    } else {
      const relativePath = path.relative(dest, destPath);

      if (fs.existsSync(destPath)) {
        conflicts.push({ file: relativePath, resolvedBy: layer });
      }

      if (!dryRun) {
        fs.copyFileSync(srcPath, destPath);
      }

      copied.push({ file: relativePath, layer });
    }
  }

  return { copied, conflicts };
}

// --- Main ---

function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  if (!args.domain || !args.output) {
    console.error("Error: --domain and --output are required.\n");
    printUsage();
    process.exit(1);
  }

  // Resolve paths relative to the repo root (one level up from scripts/)
  const repoRoot = path.resolve(__dirname, "..");
  const basePath = path.join(repoRoot, "base");
  const domainPath = path.join(repoRoot, args.domain);
  const outputPath = path.resolve(args.output);
  const claudeDir = path.join(outputPath, ".claude");

  // Validate inputs
  if (!fs.existsSync(basePath)) {
    console.error(`Error: Base layer not found at ${basePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(domainPath)) {
    console.error(`Error: Domain '${args.domain}' not found at ${domainPath}`);
    console.error("Available domains:");
    fs.readdirSync(repoRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith(".") && !d.name.startsWith("_") && d.name !== "base" && d.name !== "node_modules")
      .forEach((d) => console.error(`  ${d.name}`));
    process.exit(1);
  }

  if (!fs.existsSync(outputPath)) {
    console.error(`Error: Output directory does not exist: ${outputPath}`);
    console.error("Create the directory first, then run scaffold.");
    process.exit(1);
  }

  console.log(`Scaffolding: base + ${args.domain} → ${outputPath}`);
  if (args.dryRun) {
    console.log("(dry run — no files will be copied)\n");
  }

  // Create .claude/ if needed
  if (!args.dryRun && !fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Step 1: Copy base into .claude/
  console.log("Copying base layer...");
  const baseResult = copyDir(basePath, claudeDir, {
    dryRun: args.dryRun,
    layer: "base",
  });

  // Step 2: Copy domain on top (overwrites base on conflict)
  console.log(`Copying ${args.domain} domain layer...`);
  const domainResult = copyDir(domainPath, claudeDir, {
    dryRun: args.dryRun,
    layer: args.domain,
  });

  // Step 3: Copy domain CLAUDE.md to project root
  const domainClaudeMd = path.join(domainPath, "CLAUDE.md");
  if (fs.existsSync(domainClaudeMd)) {
    const destClaudeMd = path.join(outputPath, "CLAUDE.md");
    if (!args.dryRun) {
      fs.copyFileSync(domainClaudeMd, destClaudeMd);
    }
    console.log(`Copied ${args.domain}/CLAUDE.md → CLAUDE.md`);
  }

  // Report
  const allCopied = [...baseResult.copied, ...domainResult.copied];
  const allConflicts = domainResult.conflicts;

  console.log(`\nDone.`);
  console.log(`  Files copied: ${allCopied.length}`);
  console.log(`  Conflicts resolved: ${allConflicts.length} (domain wins)`);

  if (allConflicts.length > 0) {
    console.log("\nConflicts (domain took precedence):");
    allConflicts.forEach((c) => {
      console.log(`  ${c.file} — resolved by ${c.resolvedBy}`);
    });
  }

  console.log(`\nNext steps:`);
  console.log(`  1. Open ${outputPath}/CLAUDE.md`);
  console.log(`  2. Fill in the placeholders (project name, languages, frameworks)`);
  console.log(`  3. Start a Claude Code session in your project`);
}

main();
