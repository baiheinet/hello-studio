/**
 * Core invite-code logic, shared by the browser UI, the CLI and the tests.
 *
 * The program is deliberately tiny: it has no network calls, no storage and
 * no persistence. It only normalizes the input, builds the Studio invitation
 * URL and reports what happened. Any non-empty input is accepted as a code.
 */

export const INVITE_BASE_URL = 'https://studio.seg.plus/main/invite/';

export const ERROR_MESSAGES = Object.freeze({
  INVITE_CODE_REQUIRED: '请输入邀请码。',
  OPEN_FAILED: '链接已生成，但无法自动打开浏览器，请手动访问该链接。',
});

/** Trim surrounding whitespace so a pasted code works as expected. */
export function normalizeInviteCode(input) {
  return typeof input === 'string' ? input.trim() : '';
}

/**
 * Check that an invite code was supplied. No format check is applied: every
 * non-empty input is accepted and opened as an invitation link.
 * @returns {{ok: boolean, code: string, error?: string, message?: string}}
 */
export function validateInviteCode(input) {
  const code = normalizeInviteCode(input);

  if (!code) {
    return {
      ok: false,
      code,
      error: 'INVITE_CODE_REQUIRED',
      message: ERROR_MESSAGES.INVITE_CODE_REQUIRED,
    };
  }

  return { ok: true, code };
}

/**
 * Build the full Studio invitation URL for any non-empty input.
 * Returns `null` only for empty input; nothing is ever opened here.
 */
export function buildInviteUrl(input) {
  const result = validateInviteCode(input);
  if (!result.ok) return null;
  // Percent-encode arbitrary characters into a single, safe URL path segment.
  // URL-safe codes such as the example are left unchanged.
  return INVITE_BASE_URL + encodeURIComponent(result.code);
}
