import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  INVITE_BASE_URL,
  buildInviteUrl,
  normalizeInviteCode,
  validateInviteCode,
} from '../src/invite.js';
import { openInvite } from '../src/open-browser.js';

const VALID = 'G-AG8p4FpnpAu83F_vJ1ND0aJ';
const VALID_URL = `${INVITE_BASE_URL}${VALID}`;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function recordingOpener() {
  const calls = [];
  return { calls, opener: (url) => calls.push(url) };
}

test('a valid code builds the exact Studio invitation URL', () => {
  assert.equal(buildInviteUrl(VALID), VALID_URL);
  assert.equal(
    VALID_URL,
    'https://studio.seg.plus/main/invite/G-AG8p4FpnpAu83F_vJ1ND0aJ',
  );
});

test('surrounding whitespace is trimmed before validation', () => {
  assert.equal(normalizeInviteCode(`  ${VALID}\n`), VALID);
  assert.equal(buildInviteUrl(`\t${VALID}  `), VALID_URL);
});

test('empty or whitespace-only input is rejected', () => {
  for (const input of ['', '   ', '\n\t', null, undefined, 42]) {
    const result = validateInviteCode(input);
    assert.equal(result.ok, false);
    assert.equal(result.error, 'INVITE_CODE_REQUIRED');
    assert.equal(buildInviteUrl(input), null);
  }
});

test('any non-empty input builds a URL without a format check', () => {
  const inputs = [
    'hello',
    'G-',
    'https://evil.example/invite',
    'hello world',
    'G-AG8p4FpnpAu83F_vJ1ND0aJ!',
    'g-AG8p4FpnpAu83F_vJ1ND0aJ',
  ];
  for (const input of inputs) {
    const result = validateInviteCode(input);
    assert.equal(result.ok, true, `expected accepted: ${input}`);
    assert.equal(result.error, undefined);
    assert.equal(buildInviteUrl(input), INVITE_BASE_URL + encodeURIComponent(input));
  }
});

test('a valid code opens exactly the built URL', () => {
  const { calls, opener } = recordingOpener();
  const result = openInvite(VALID, opener);

  assert.equal(result.ok, true);
  assert.equal(result.opened, true);
  assert.equal(result.url, VALID_URL);
  assert.deepEqual(calls, [VALID_URL]);
});

test('empty input never opens a link', () => {
  for (const input of ['', '  ', '\n\t']) {
    const { calls, opener } = recordingOpener();
    const result = openInvite(input, opener);

    assert.equal(result.ok, false);
    assert.equal(result.opened, false);
    assert.equal(result.url, null);
    assert.ok(result.message.length > 0);
    assert.deepEqual(calls, [], `nothing should open for: ${JSON.stringify(input)}`);
  }
});

test('a broken opener does not crash the program', () => {
  const result = openInvite(VALID, () => {
    throw new Error('no browser');
  });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'OPEN_FAILED');
  assert.equal(result.url, VALID_URL);
  assert.ok(result.message.length > 0);
});

function runCli(...args) {
  const result = spawnSync(process.execPath, [join(root, 'bin/cli.mjs'), ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    status: result.status,
    output: `${result.stdout || ''}${result.stderr || ''}`,
    signal: result.signal,
  };
}

test('the CLI reports an error and opens nothing for empty input', () => {
  const result = runCli('');
  assert.equal(result.signal, null);
  assert.equal(result.status, 1);
  assert.match(result.output, /请输入邀请码/);
});

test('the CLI accepts a valid code without crashing', () => {
  const result = runCli(VALID);
  assert.equal(result.signal, null);
  assert.equal(result.status, 0);
  assert.ok(result.output.includes(VALID_URL));
});
