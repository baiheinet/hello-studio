import { useTranslation } from '@nocobase/i18n/client';
import { useState, type FormEvent, type ReactElement } from 'react';

import { Button } from '#components/ui/button';
import { Input } from '#components/ui/input';
import { Label } from '#components/ui/label';
import { buildInviteUrl } from '#lib/invite-code';

import { LanguageMenu } from '../layouts/components/language-switcher.js';
import { ThemeSettingsMenu } from '../theme/index.js';

/**
 * `/`: the application's public entry point, a standalone page that turns an invite code into a Studio invitation
 * link. It is `auth: 'optional'` so the tool is usable from the preview without signing in, and it stays outside the
 * shell: the centered card follows the user invitation page's layout. Because that leaves no account menu, the app's
 * native language and theme choices keep their own buttons in the page header.
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
      // Empty input: report the problem and open nothing.
      setError(t('invite.errorRequired'));
      return;
    }

    // Non-empty input: open the invitation link in this same window/tab.
    window.location.href = url;
    setOpenedUrl(url);
  }

  return (
    <div className='flex min-h-svh flex-col'>
      <header className='flex shrink-0 items-center justify-end gap-1 p-3'>
        <LanguageMenu />
        <ThemeSettingsMenu />
      </header>
      <main className='flex flex-1 items-center justify-center p-4'>
        <div className='w-full max-w-sm space-y-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm'>
          <header className='space-y-2'>
            <h1 className='text-xl font-semibold'>{t('invite.title')}</h1>
            <p className='text-sm text-muted-foreground'>
              {t('invite.description')}
            </p>
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
              <p
                className='text-sm text-muted-foreground'
                data-testid='success'
              >
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
            <Button
              className='w-full'
              data-testid='submit-button'
              type='submit'
            >
              {t('invite.action')}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
