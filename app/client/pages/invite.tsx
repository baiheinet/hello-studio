import { useTranslation } from '@nocobase/i18n/client';
import { useState, type FormEvent, type ReactElement } from 'react';

import { Button } from '#components/ui/button';
import { Input } from '#components/ui/input';
import { Label } from '#components/ui/label';
import { buildInviteUrl, validateInviteCode } from '#lib/invite-code';

import { AuthPage } from './auth/shared.js';

/**
 * `/invite`: a standalone page that turns an invite code into a Studio
 * invitation link. It is `auth: 'optional'` so the tool is usable from the
 * preview without signing in.
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

    // Valid input: open the invitation link in a new browser tab.
    window.open(url, '_blank', 'noopener');
    setOpenedUrl(url);
  }

  return (
    <AuthPage title={t('invite.title')} description={t('invite.description')}>
      <form className='space-y-4' noValidate onSubmit={handleSubmit}>
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
        <Button className='w-full' data-testid='submit-button' type='submit'>
          {t('invite.action')}
        </Button>
        {error ? (
          <p className='text-sm text-destructive' data-testid='error' role='alert'>
            {error}
          </p>
        ) : null}
        {openedUrl ? (
          <p className='text-sm' data-testid='success'>
            {t('invite.success')}{' '}
            <a href={openedUrl} rel='noopener' target='_blank'>
              {openedUrl}
            </a>
          </p>
        ) : null}
      </form>
    </AuthPage>
  );
}
