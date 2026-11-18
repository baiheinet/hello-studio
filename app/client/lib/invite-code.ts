/** Base URL of Studio invitation links. */
export const INVITE_BASE_URL = 'https://studio.seg.plus/main/invite/';

export type InviteValidationError = 'INVITE_CODE_REQUIRED';

export interface InviteValidationResult {
  readonly ok: boolean;
  readonly code: string;
  readonly error?: InviteValidationError;
}

/** Trim surrounding whitespace so a pasted code works as expected. */
export function normalizeInviteCode(input: string | null | undefined): string {
  return typeof input === 'string' ? input.trim() : '';
}

/** Check that an invite code was supplied; no format check is applied. */
export function validateInviteCode(input: string | null | undefined): InviteValidationResult {
  const code = normalizeInviteCode(input);
  if (!code) return { ok: false, code, error: 'INVITE_CODE_REQUIRED' };
  return { ok: true, code };
}

/** Build the full invitation URL, or `null` for empty input. */
export function buildInviteUrl(input: string | null | undefined): string | null {
  const result = validateInviteCode(input);
  if (!result.ok) return null;
  // Percent-encode arbitrary characters into a single, safe URL path segment.
  return INVITE_BASE_URL + encodeURIComponent(result.code);
}
