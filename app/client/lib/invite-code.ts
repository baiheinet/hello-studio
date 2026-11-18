/** Base URL of Studio invitation links. */
export const INVITE_BASE_URL = 'https://studio.seg.plus/main/invite/';

/**
 * A Studio invite code starts with `G-` followed by 8-64 URL-safe characters
 * (letters, digits, `_` or `-`). Input without this shape is not an invite code.
 */
export const INVITE_CODE_PATTERN = /^G-[A-Za-z0-9_-]{8,64}$/;

export type InviteValidationError = 'INVITE_CODE_REQUIRED' | 'INVITE_CODE_INVALID';

export interface InviteValidationResult {
  readonly ok: boolean;
  readonly code: string;
  readonly error?: InviteValidationError;
}

/** Trim surrounding whitespace so a pasted code works as expected. */
export function normalizeInviteCode(input: string | null | undefined): string {
  return typeof input === 'string' ? input.trim() : '';
}

/** Validate a raw invite-code input without opening anything. */
export function validateInviteCode(input: string | null | undefined): InviteValidationResult {
  const code = normalizeInviteCode(input);
  if (!code) return { ok: false, code, error: 'INVITE_CODE_REQUIRED' };
  if (!INVITE_CODE_PATTERN.test(code)) return { ok: false, code, error: 'INVITE_CODE_INVALID' };
  return { ok: true, code };
}

/** Build the full invitation URL, or `null` for empty/malformed input. */
export function buildInviteUrl(input: string | null | undefined): string | null {
  const result = validateInviteCode(input);
  if (!result.ok) return null;
  // Allowed characters are all URL-safe, so encoding never changes a valid code.
  return INVITE_BASE_URL + encodeURIComponent(result.code);
}
