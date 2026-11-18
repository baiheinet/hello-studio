import { useTranslation } from '@nocobase/i18n/client';
import { useState, type FormEvent, type ReactElement } from 'react';

import { Button } from '#components/ui/button';
import { Input } from '#components/ui/input';
import { Label } from '#components/ui/label';
import { buildInviteUrl, validateInviteCode } from '#lib/invite-code';

/**
 * `/invite`: a standalone page that turns an invite code into a Studio
 * invitation link. It is `auth: 'optional'` so the tool is usable from the
 * preview without signing in. The centered card follows the user invitation
 * page's layout: a compact form, no navigation chrome.
 */
export default function InvitePage(): ReactElement {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [openedUrl, setOpenedUrl] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError('');
    setOpenedUrl('');

    const url = buildInviteUrl(code);
    if (url === null) {
      // Empty or malformed input: report the problem and open nothing.
      const reason = validateInviteCode(code).error;
      setError(t(reason === 'INVITE_CODE_REQUIRED' ? 'invite.errorRequired' : 'invite.errorInvalid'));
      return;
    }

    // Valid input: open the invitation link in this same window/tab.
    window.location.href = url;
    setOpenedUrl(url);
  }

  return (
    <main className='flex min-h-svh items-center justify-center p-4'>
      <div className='w-full max-w-sm space-y-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm'>
        <header className='space-y-2'>
          <h1 className='text-xl font-semibold'>{t('invite.title')}</h1>
          <p className='text-sm text-muted-foreground'>{t('invite.description')}</p>
        </header>
        <form className='space-y-5' noValidate onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='invite-code'>{t('invite.label')}</Label>
            <Input
              autoComplete='off'
              data-testid='code-input'
              id='invite-code'
              onChange={(event) => setCode(event.target.value)}
              placeholder={t('invite.placeholder')}
              spellCheck={false}
              value={code}
            />
          </div>
          {error ? (
            <p
              className='rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'
              data-testid='error'
              role='alert'
            >
              {error}
            </p>
          ) : null}
          {openedUrl ? (
            <p className='text-sm text-muted-foreground' data-testid='success'>
              {t('invite.success')}{' '}
              <a
                className='text-primary underline-offset-4 hover:underline'
                href={openedUrl}
                rel='noopener'
                target='_blank'
              >
                {openedUrl}
              </a>
            </p>
          ) : null}
          <Button className='w-full' data-testid='submit-button' type='submit'>
            {t('invite.action')}
          </Button>
        </form>
      </div>
    </main>
  );
}
