#!/usr/bin/env node
/**
 * setup-env.js — deep-research domain
 *
 * Configures the knowledge store (Neo4j + pgvector) for this project.
 * Run once before your first /deep-dive session.
 *
 * Three modes:
 *   1. Docker (default/easy)  — generates docker-compose.yml and optionally starts containers
 *   2. Existing instances     — tests connection to your own Neo4j and pgvector
 *   3. Check only             — reports which env vars are set/missing, no changes
 *
 * Usage:
 *   node scripts/setup-env.js
 *   node scripts/setup-env.js --mode docker
 *   node scripts/setup-env.js --mode existing
 *   node scripts/setup-env.js --mode check
 */

'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ── Argument parsing ─────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const modeArg = args.find(a => a.startsWith('--mode=') || args[args.indexOf('--mode') + 1]);
let mode = null;
if (args.includes('--mode')) {
  mode = args[args.indexOf('--mode') + 1];
} else {
  const modeFlag = args.find(a => a.startsWith('--mode='));
  if (modeFlag) mode = modeFlag.split('=')[1];
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer.trim()); }));
}

function checkCommand(cmd) {
  const result = spawnSync('which', [cmd], { encoding: 'utf8' });
  return result.status === 0;
}

function envStatus(varName) {
  const val = process.env[varName];
  if (!val) return { set: false, label: `${varName}: ✗ not set` };
  return { set: true, label: `${varName}: ✓ set` };
}

// ── Mode: check ──────────────────────────────────────────────────────────────

function runCheck() {
  console.log('\n── Environment check ──────────────────────────────────────────');

  const vars = [
    'NEO4J_URI', 'NEO4J_USER', 'NEO4J_PASSWORD',
    'PGVECTOR_URL',
    'SEMANTIC_SCHOLAR_API_KEY',  // optional
    'BRAVE_API_KEY',             // optional
  ];

  let allRequired = true;
  const required = ['NEO4J_URI', 'NEO4J_USER', 'NEO4J_PASSWORD', 'PGVECTOR_URL'];

  for (const v of vars) {
    const s = envStatus(v);
    const req = required.includes(v) ? '' : ' (optional)';
    console.log(`  ${s.label}${req}`);
    if (required.includes(v) && !s.set) allRequired = false;
  }

  console.log('');
  if (allRequired) {
    console.log('  ✓ All required env vars are set.');
  } else {
    console.log('  ✗ Some required env vars are missing.');
    console.log('    Run without --mode check to configure.');
  }

  // Check sources.yml for any enabled sources that need env vars
  const sourcesPath = path.join(__dirname, '..', 'sources.yml');
  if (fs.existsSync(sourcesPath)) {
    const content = fs.readFileSync(sourcesPath, 'utf8');
    if (content.includes('${SEMANTIC_SCHOLAR_API_KEY}') && content.match(/enabled:\s*true.*semantic-scholar/s)) {
      const k = envStatus('SEMANTIC_SCHOLAR_API_KEY');
      if (!k.set) console.log('  ⚠  semantic-scholar is enabled in sources.yml but SEMANTIC_SCHOLAR_API_KEY is not set.');
    }
    if (content.includes('${BRAVE_API_KEY}') && content.match(/enabled:\s*true.*brave/s)) {
      const k = envStatus('BRAVE_API_KEY');
      if (!k.set) console.log('  ⚠  brave-search is enabled in sources.yml but BRAVE_API_KEY is not set.');
    }
  }

  console.log('');
}

// ── Mode: docker ─────────────────────────────────────────────────────────────

const DOCKER_COMPOSE = `version: '3.9'

services:
  neo4j:
    image: neo4j:5
    container_name: deep-research-neo4j
    ports:
      - "7474:7474"   # Browser UI
      - "7687:7687"   # Bolt protocol
    environment:
      NEO4J_AUTH: neo4j/\${NEO4J_PASSWORD}
      NEO4J_PLUGINS: '["apoc"]'
    volumes:
      - neo4j_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:7474"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgvector:
    image: pgvector/pgvector:pg16
    container_name: deep-research-pgvector
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: deep_research
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \${PGPASSWORD}
    volumes:
      - pgvector_data:/var/lib/postgresql/data
      - ./scripts/init-pgvector.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  neo4j_data:
  pgvector_data:
`;

const INIT_SQL = `-- Initialize pgvector extension and paper_embeddings table
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS paper_embeddings (
  id SERIAL PRIMARY KEY,
  paper_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  abstract_embedding VECTOR(1536),
  summary_embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS paper_embeddings_abstract_idx
  ON paper_embeddings USING ivfflat (abstract_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS paper_embeddings_summary_idx
  ON paper_embeddings USING ivfflat (summary_embedding vector_cosine_ops)
  WITH (lists = 100);
`;

const ENV_EXAMPLE = `# deep-research environment variables
# Copy to .env and fill in values. Never commit .env to git.

# Neo4j (Docker default — change if using your own instance)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-neo4j-password-here

# pgvector (Docker default — change if using your own instance)
PGVECTOR_URL=postgresql://postgres:your-pgpassword-here@localhost:5432/deep_research
PGPASSWORD=your-pgpassword-here

# Optional — increases Semantic Scholar API rate limits
# SEMANTIC_SCHOLAR_API_KEY=

# Optional — required if brave-search source is enabled in sources.yml
# BRAVE_API_KEY=
`;

async function runDocker() {
  console.log('\n── Docker setup ────────────────────────────────────────────────');

  // Check Docker is installed
  if (!checkCommand('docker')) {
    console.error('  ✗ Docker is not installed. Install Docker Desktop from https://docker.com');
    process.exit(1);
  }
  if (!checkCommand('docker-compose') && !spawnSync('docker', ['compose', 'version'], { encoding: 'utf8' }).status === 0) {
    console.error('  ✗ Docker Compose is not available. Install Docker Desktop (includes Compose).');
    process.exit(1);
  }
  console.log('  ✓ Docker is installed.');

  // Generate password prompts
  const neo4jPass = await prompt('  Neo4j password (leave blank for "changeme"): ') || 'changeme';
  const pgPass = await prompt('  pgvector password (leave blank for "changeme"): ') || 'changeme';

  // Write files
  const projectRoot = path.join(__dirname, '..', '..'); // deep-research/../ = repo root
  const composeTarget = path.join(projectRoot, 'docker-compose.yml');
  const initSqlTarget = path.join(__dirname, 'init-pgvector.sql');
  const envExampleTarget = path.join(projectRoot, '.env.example');

  fs.writeFileSync(composeTarget, DOCKER_COMPOSE);
  fs.writeFileSync(initSqlTarget, INIT_SQL);
  fs.writeFileSync(envExampleTarget, ENV_EXAMPLE);

  console.log(`\n  Files written:`);
  console.log(`    docker-compose.yml`);
  console.log(`    deep-research/scripts/init-pgvector.sql`);
  console.log(`    .env.example`);

  // Write .env if it doesn't exist
  const envTarget = path.join(projectRoot, '.env');
  if (!fs.existsSync(envTarget)) {
    const envContent = ENV_EXAMPLE
      .replace('your-neo4j-password-here', neo4jPass)
      .replace(/your-pgpassword-here/g, pgPass);
    fs.writeFileSync(envTarget, envContent);
    console.log(`    .env (created with your passwords)`);
  } else {
    console.log(`    .env (already exists — not overwritten)`);
  }

  const start = await prompt('\n  Start containers now? (y/n): ');
  if (start.toLowerCase() === 'y') {
    console.log('\n  Starting containers...');
    try {
      execSync('docker compose up -d', { cwd: projectRoot, stdio: 'inherit' });
      console.log('\n  Waiting for containers to be healthy...');

      // Poll health
      let neo4jReady = false, pgReady = false;
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const neo4j = spawnSync('docker', ['inspect', '--format', '{{.State.Health.Status}}', 'deep-research-neo4j'], { encoding: 'utf8' });
        const pg = spawnSync('docker', ['inspect', '--format', '{{.State.Health.Status}}', 'deep-research-pgvector'], { encoding: 'utf8' });
        if (neo4j.stdout.trim() === 'healthy') neo4jReady = true;
        if (pg.stdout.trim() === 'healthy') pgReady = true;
        if (neo4jReady && pgReady) break;
        process.stdout.write('.');
      }
      console.log('');

      if (neo4jReady && pgReady) {
        console.log('  ✓ Neo4j is ready  — browser: http://localhost:7474');
        console.log('  ✓ pgvector is ready — postgresql://localhost:5432/deep_research');
      } else {
        if (!neo4jReady) console.log('  ⚠  Neo4j may still be starting. Check: docker logs deep-research-neo4j');
        if (!pgReady) console.log('  ⚠  pgvector may still be starting. Check: docker logs deep-research-pgvector');
      }
    } catch (e) {
      console.error('  ✗ docker compose failed:', e.message);
    }
  }

  console.log('\n  Next steps:');
  console.log('  1. Copy .env.example to .env if you haven\'t already');
  console.log('  2. Run /deep-dive <your topic> to start researching');
  console.log('');
}

// ── Mode: existing ───────────────────────────────────────────────────────────

async function runExisting() {
  console.log('\n── Existing instance setup ─────────────────────────────────────');
  console.log('  Provide connection details for your Neo4j and pgvector instances.');
  console.log('  These will be written to .env.example — copy to .env to use.\n');

  const neo4jUri = await prompt('  Neo4j URI (e.g. bolt://localhost:7687): ');
  const neo4jUser = await prompt('  Neo4j username (default: neo4j): ') || 'neo4j';
  const neo4jPass = await prompt('  Neo4j password: ');
  const pgUrl = await prompt('  pgvector connection string (e.g. postgresql://user:pass@host:5432/db): ');

  const envContent = [
    '# deep-research environment variables',
    `NEO4J_URI=${neo4jUri}`,
    `NEO4J_USER=${neo4jUser}`,
    `NEO4J_PASSWORD=${neo4jPass}`,
    `PGVECTOR_URL=${pgUrl}`,
    '',
    '# Optional',
    '# SEMANTIC_SCHOLAR_API_KEY=',
    '# BRAVE_API_KEY=',
  ].join('\n');

  const projectRoot = path.join(__dirname, '..', '..');
  const envExampleTarget = path.join(projectRoot, '.env.example');
  fs.writeFileSync(envExampleTarget, envContent);
  console.log('\n  Written: .env.example');
  console.log('  Run: cp .env.example .env');
  console.log('  Then: /deep-dive <your topic>');
  console.log('');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('deep-research — environment setup');
  console.log('==================================');

  let selectedMode = mode;

  if (!selectedMode) {
    console.log('\nHow would you like to set up the knowledge store?\n');
    console.log('  1. Docker (recommended) — spin up Neo4j + pgvector locally');
    console.log('  2. Existing instances   — connect to your own Neo4j and pgvector');
    console.log('  3. Check only           — show current env var status\n');
    const choice = await prompt('Choice [1/2/3]: ');
    selectedMode = { '1': 'docker', '2': 'existing', '3': 'check' }[choice] || 'check';
  }

  switch (selectedMode) {
    case 'docker':    await runDocker(); break;
    case 'existing':  await runExisting(); break;
    case 'check':     runCheck(); break;
    default:
      console.error(`Unknown mode: ${selectedMode}. Use docker, existing, or check.`);
      process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
