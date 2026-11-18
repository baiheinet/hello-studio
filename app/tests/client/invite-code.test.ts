import { describe, expect, it } from 'vitest';

import {
  INVITE_BASE_URL,
  buildInviteUrl,
  normalizeInviteCode,
  validateInviteCode,
} from '../../client/lib/invite-code.js';

const VALID = 'G-AG8p4FpnpAu83F_vJ1ND0aJ';
const VALID_URL = `${INVITE_BASE_URL}${VALID}`;

describe('invite codes', () => {
  it('builds the exact invitation URL for a valid code', () => {
    expect(buildInviteUrl(VALID)).toBe(VALID_URL);
    expect(VALID_URL).toBe(
      'https://studio.seg.plus/main/invite/G-AG8p4FpnpAu83F_vJ1ND0aJ',
    );
  });

  it('trims pasted whitespace before validating', () => {
    expect(normalizeInviteCode(`  ${VALID}\n`)).toBe(VALID);
    expect(buildInviteUrl(`\t${VALID}  `)).toBe(VALID_URL);
  });

  it('rejects empty input', () => {
    for (const input of ['', '  ', '\n\t', null, undefined]) {
      expect(validateInviteCode(input).error).toBe('INVITE_CODE_REQUIRED');
      expect(buildInviteUrl(input)).toBeNull();
    }
  });

  it('builds a URL for any non-empty input without a format check', () => {
    const inputs = ['hello', 'G-', 'https://evil.example/invite', `${VALID}!`, `g-${VALID.slice(2)}`];
    for (const input of inputs) {
      expect(validateInviteCode(input).ok).toBe(true);
      expect(buildInviteUrl(input)).toBe(INVITE_BASE_URL + encodeURIComponent(input));
    }
  });
});
