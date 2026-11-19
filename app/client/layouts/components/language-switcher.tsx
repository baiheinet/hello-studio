import { useToaster } from '@nocobase/app-client';
import { useAppLocale } from '@nocobase/app-plugin-i18n/client';
import { useTranslation } from '@nocobase/i18n/client';
import { Languages } from 'lucide-react';
import type { ReactElement } from 'react';

import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { cn } from 'cn';

export interface LanguageSwitcherProps {
  readonly className?: string;
}

/**
 * The language choices themselves. Pages outside the account menu (the
 * public invite page) show them in their own menu button.
 */
function LanguageChoices(): ReactElement {
  const { locale, locales, setLocale, switching } = useAppLocale();
  const { t } = useTranslation();
  const toaster = useToaster();

  async function applyLocaleChange(value: string): Promise<void> {
    const result = await setLocale(value);
    if (result.fallback) {
      toaster.show({
        type: 'info',
        title: t('notices.serverLocaleFallback', {
          lng: value,
          defaultValue:
            'The server does not support this language, so server messages will use English.',
        }),
      });
    }
  }

  function handleLocaleChange(value: unknown): void {
    if (typeof value !== 'string' || value === locale) return;

    const localeChange = applyLocaleChange(value);
    localeChange.catch(() => {
      toaster.show({
        type: 'error',
        title: t('notices.languageChangeFailed', {
          lng: value,
          defaultValue:
            'Unable to complete the language change. Please try again.',
        }),
      });
    });
  }

  return (
    <DropdownMenuRadioGroup value={locale} onValueChange={handleLocaleChange}>
      {locales.map((definition) => (
        <DropdownMenuRadioItem
          closeOnClick
          key={definition.locale}
          value={definition.locale}
          disabled={switching}
        >
          {definition.label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}

function currentLocaleLabel(
  locales: readonly { locale: string; label: string }[],
  locale: string,
): string {
  return (
    locales.find((definition) => definition.locale === locale)?.label ?? locale
  );
}

/** Account-menu language choices; the plugin owns persistence and resource loading. */
export function LanguageSwitcher({
  className,
}: LanguageSwitcherProps): ReactElement | null {
  const { locale, locales, switching } = useAppLocale();
  const { t } = useTranslation();

  // With one language there is nothing to choose.
  if (locales.length < 2) return null;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        className={cn('gap-2', className)}
        disabled={switching}
      >
        <Languages aria-hidden='true' className='size-4' />
        <span className='flex-1'>
          {t('actions.language', { defaultValue: 'Language' })}
        </span>
        <span className='text-muted-foreground'>
          {currentLocaleLabel(locales, locale)}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <LanguageChoices />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/**
 * The same choices as a top-level button. The invite page renders outside the
 * application shell, so the account menu is not available there; showing the
 * native choices keeps the language control reachable on that page too.
 */
export function LanguageMenu(): ReactElement | null {
  const { locale, locales, switching } = useAppLocale();
  const { t } = useTranslation();

  if (locales.length < 2) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className='gap-2'
            disabled={switching}
            size='sm'
            variant='ghost'
          />
        }
      >
        <Languages aria-hidden='true' className='size-4' />
        <span>{t('actions.language', { defaultValue: 'Language' })}</span>
        <span className='text-muted-foreground'>
          {currentLocaleLabel(locales, locale)}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <LanguageChoices />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
