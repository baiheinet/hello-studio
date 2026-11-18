import { spawn } from 'node:child_process';
import { buildInviteUrl, validateInviteCode, ERROR_MESSAGES } from './invite.js';

/**
 * Open a URL with the platform's default browser. Missing browsers or spawn
 * failures are ignored instead of crashing the program: the URL is still
 * reported to the caller, who can open it manually.
 */
export function defaultOpener(url) {
  const platform = process.platform;
  let command;
  let args;

  if (platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  } else if (platform === 'darwin') {
    command = 'open';
    args = [url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.on('error', () => {
    // No browser available: do not crash, the caller reports the URL.
  });
  child.unref();
  return child;
}

/**
 * Validate the input and, only when it is a valid invite code, open the
 * invitation URL. The opener is injectable so tests can assert that invalid
 * input never opens anything.
 *
 * @returns {{ok: boolean, opened: boolean, url: string|null,
 *            error?: string, message: string}}
 */
export function openInvite(input, opener = defaultOpener) {
  const url = buildInviteUrl(input);

  if (url === null) {
    const { error, message } = validateInviteCode(input);
    return { ok: false, opened: false, url: null, error, message };
  }

  try {
    opener(url);
  } catch {
    return {
      ok: false,
      opened: false,
      url,
      error: 'OPEN_FAILED',
      message: ERROR_MESSAGES.OPEN_FAILED,
    };
  }

  return { ok: true, opened: true, url, message: url };
}
