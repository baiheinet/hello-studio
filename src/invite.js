/**
 * Core invite-code logic, shared by the browser UI, the CLI and the tests.
 *
 * The program is deliberately tiny: it has no network calls, no storage and
 * no persistence. It only validates the shape of an invite code, builds the
 * Studio invitation URL and reports what happened.
 */

export const INVITE_BASE_URL = 'https://studio.seg.plus/main/invite/';

/**
 * A Studio invite code starts with `G-` followed by 8-64 URL-safe characters
 * (letters, digits, `_` or `-`). This is the "invite code characteristic"
 * used to tell a real code apart from arbitrary text.
 */
export const INVITE_CODE_PATTERN = /^G-[A-Za-z0-9_-]{8,64}$/;

export const ERROR_MESSAGES = Object.freeze({
  INVITE_CODE_REQUIRED: '请输入邀请码。',
  INVITE_CODE_INVALID:
    '邀请码格式不正确：应以 G- 开头，后跟 8–64 位字母、数字、下划线或短横线。',
  OPEN_FAILED: '链接已生成，但无法自动打开浏览器，请手动访问该链接。',
});

/** Trim surrounding whitespace so a pasted code works as expected. */
export function normalizeInviteCode(input) {
  return typeof input === 'string' ? input.trim() : '';
}

/**
 * Validate a raw invite-code input.
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

  if (!INVITE_CODE_PATTERN.test(code)) {
    return {
      ok: false,
      code,
      error: 'INVITE_CODE_INVALID',
      message: ERROR_MESSAGES.INVITE_CODE_INVALID,
    };
  }

  return { ok: true, code };
}

/**
 * Build the full Studio invitation URL for a valid code.
 * Returns `null` for empty or malformed input; nothing is ever opened here.
 */
export function buildInviteUrl(input) {
  const result = validateInviteCode(input);
  if (!result.ok) return null;
  // Every allowed character is URL-safe, so encoding never changes a valid
  // code. Keeping encodeURIComponent here makes the contract explicit.
  return INVITE_BASE_URL + encodeURIComponent(result.code);
}
