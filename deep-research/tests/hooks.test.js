'use strict';

/**
 * hooks.test.js — deep-research domain
 *
 * Tests for pre-store.sh and post-search.sh hooks.
 * Run with: node --test tests/hooks.test.js
 * (Node.js built-in test runner, v18+)
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('child_process');
const path = require('path');

const PRE_STORE = path.join(__dirname, '..', 'hooks', 'pre-store.sh');
const POST_SEARCH = path.join(__dirname, '..', 'hooks', 'post-search.sh');

function runHook(hookPath, env = {}) {
  const result = spawnSync('bash', [hookPath], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
    input: '',
  });
  return {
    exitCode: result.status,
    stderr: result.stderr || '',
    stdout: result.stdout || '',
  };
}

// ── pre-store.sh tests ────────────────────────────────────────────────────────

test('pre-store: allows non-graph bash commands', () => {
  const r = runHook(PRE_STORE, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command: 'ls -la' }),
  });
  assert.equal(r.exitCode, 0, 'should exit 0 for non-graph command');
});

test('pre-store: allows complete Paper node with all required fields', () => {
  const command = `
    npx neo4j-driver cypher "MERGE (p:Paper {id: '2401.99999'})
    SET p.title = 'Test Paper',
        p.source_url = 'https://arxiv.org/abs/2401.99999',
        p.abstract = 'Test abstract text'"
  `;
  const r = runHook(PRE_STORE, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.equal(r.exitCode, 0, 'should allow Paper node with all required fields');
});

test('pre-store: blocks Paper MERGE missing title', () => {
  const command = `
    npx neo4j-driver cypher "MERGE (p:Paper {id: '2401.99999'})
    SET p.source_url = 'https://arxiv.org/abs/2401.99999',
        p.abstract = 'Test abstract'"
  `;
  const r = runHook(PRE_STORE, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.equal(r.exitCode, 1, 'should block MERGE without title');
  assert.match(r.stderr, /title/, 'stderr should mention missing field');
});

test('pre-store: blocks Paper MERGE missing source_url', () => {
  const command = `
    npx neo4j-driver cypher "MERGE (p:Paper {id: '2401.99999'})
    SET p.title = 'Test Paper',
        p.abstract = 'Test abstract'"
  `;
  const r = runHook(PRE_STORE, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.equal(r.exitCode, 1, 'should block MERGE without source_url');
  assert.match(r.stderr, /source_url/, 'stderr should mention missing field');
});

test('pre-store: blocks Paper MERGE missing abstract', () => {
  const command = `
    npx neo4j-driver cypher "MERGE (p:Paper {id: '2401.99999'})
    SET p.title = 'Test Paper',
        p.source_url = 'https://arxiv.org/abs/2401.99999'"
  `;
  const r = runHook(PRE_STORE, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.equal(r.exitCode, 1, 'should block MERGE without abstract');
  assert.match(r.stderr, /abstract/, 'stderr should mention missing field');
});

test('pre-store: blocks pgvector insert missing paper_id', () => {
  const command = `psql $PGVECTOR_URL -c "INSERT INTO paper_embeddings (title) VALUES ('test')"`;
  const r = runHook(PRE_STORE, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.equal(r.exitCode, 1, 'should block pgvector insert without paper_id');
});

test('pre-store: allows pgvector insert with paper_id', () => {
  const command = `psql $PGVECTOR_URL -c "INSERT INTO paper_embeddings (paper_id, title) VALUES ('2401.99999', 'test')"`;
  const r = runHook(PRE_STORE, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.equal(r.exitCode, 0, 'should allow pgvector insert with paper_id');
});

// ── post-search.sh tests ──────────────────────────────────────────────────────

test('post-search: always exits 0 for arXiv search commands', () => {
  const command = 'curl "https://export.arxiv.org/api/query?search_query=all:agent"';
  const r = runHook(POST_SEARCH, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.equal(r.exitCode, 0, 'should always exit 0');
});

test('post-search: always exits 0 for non-search commands', () => {
  const r = runHook(POST_SEARCH, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command: 'ls -la' }),
  });
  assert.equal(r.exitCode, 0, 'should exit 0 for any input');
});

test('post-search: logs source name for arXiv searches', () => {
  const command = 'curl "https://export.arxiv.org/api/query?search_query=all:agent"';
  const r = runHook(POST_SEARCH, {
    CLAUDE_TOOL_NAME: 'Bash',
    CLAUDE_TOOL_INPUT: JSON.stringify({ command }),
  });
  assert.match(r.stderr, /arxiv/, 'stderr should identify the source');
});
