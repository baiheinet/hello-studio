import { Check, Monitor, Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from '@nocobase/i18n/client';
import { useId, type ReactElement } from 'react';
import { cn } from 'cn';

import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '#components/ui/popover';
import { RadioGroup, RadioGroupItem } from '#components/ui/radio-group';
import { useThemePreset } from './theme-context';
import { themePresets } from './theme-presets';

const COLOR_MODES = [
  { id: 'light', icon: Sun },
  { id: 'dark', icon: Moon },
  { id: 'system', icon: Monitor },
] as const;

/**
 * The appearance choices themselves. Pages outside the account menu (the
 * public invite page) show them in their own menu button.
 */
function ThemeChoices(): ReactElement {
  const { theme, setTheme } = useTheme();
  const { preset, setPreset } = useThemePreset();
  const { t } = useTranslation();

  return (
    <>
      <DropdownMenuRadioGroup
        value={theme}
        onValueChange={(value) => setTheme(String(value))}
        aria-label={t('appearance.mode', { defaultValue: 'Color mode' })}
      >
        <DropdownMenuLabel>
          {t('appearance.mode', { defaultValue: 'Color mode' })}
        </DropdownMenuLabel>
        {COLOR_MODES.map(({ id: mode, icon: ModeIcon }) => (
          <DropdownMenuRadioItem key={mode} value={mode} closeOnClick={false}>
            <ModeIcon aria-hidden='true' className='size-4' />
            {t('appearance.' + mode, {
              defaultValue: mode[0].toUpperCase() + mode.slice(1),
            })}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
        value={preset}
        onValueChange={(value) => {
          const selected = themePresets.find((item) => item.id === value);
          if (selected) setPreset(selected.id);
        }}
        aria-label={t('appearance.preset', { defaultValue: 'Theme' })}
      >
        <DropdownMenuLabel>
          {t('appearance.preset', { defaultValue: 'Theme' })}
        </DropdownMenuLabel>
        {themePresets.map((item) => (
          <DropdownMenuRadioItem
            key={item.id}
            value={item.id}
            closeOnClick={false}
          >
            {t(item.labelKey, {
              defaultValue: item.id.charAt(0).toUpperCase() + item.id.slice(1),
            })}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  );
}

/** Account-menu appearance choices; the existing providers own persistence. */
export function ThemeSettings(): ReactElement {
  const { t } = useTranslation();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='gap-2'>
        <Palette aria-hidden='true' className='size-4' />
        {t('appearance.title', { defaultValue: 'Theme' })}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className='min-w-44'>
        <ThemeChoices />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/**
 * The same choices as a top-level button, so a page outside the application
 * shell keeps the native theme control without an account menu.
 */
export function ThemeMenu(): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const Current =
    COLOR_MODES.find((mode) => mode.id === theme)?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button className='gap-2' size='sm' variant='ghost' />}
      >
        <Current aria-hidden='true' className='size-4' />
        {t('appearance.title', { defaultValue: 'Theme' })}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <ThemeChoices />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * The standalone appearance menu from NocoReach's example: a popover with a
 * segmented color-mode control and a preview card for every theme preset.
 * The invite page sits outside the application shell and has no account menu,
 * so it uses this button instead of the compact in-menu dropdown.
 */
export function ThemeSettingsMenu(): ReactElement {
  const { theme, setTheme } = useTheme();
  const { preset, setPreset } = useThemePreset();
  const { t } = useTranslation();
  const id = useId();
  const title = t('appearance.title', { defaultValue: 'Theme' });

  return (
    <Popover>
      <PopoverTrigger
        aria-label={title}
        render={
          <Button
            className='gap-2 rounded-xl border-border bg-background/60 hover:bg-accent/50'
            size='sm'
            variant='outline'
          />
        }
      >
        <Palette aria-hidden='true' className='size-4' />
        {title}
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='w-xs max-w-[calc(100vw-2rem)] gap-4 p-4'
      >
        <PopoverTitle className='text-sm font-semibold text-foreground'>
          {title}
        </PopoverTitle>
        <fieldset className='space-y-2'>
          <legend className='text-xs font-medium text-muted-foreground'>
            {t('appearance.mode', { defaultValue: 'Color mode' })}
          </legend>
          <RadioGroup
            aria-label={t('appearance.mode', { defaultValue: 'Color mode' })}
            className='grid-cols-3 gap-1 rounded-lg bg-muted/70 p-1'
            name={id + '-mode'}
            onValueChange={(value) => setTheme(String(value))}
            value={theme}
          >
            {COLOR_MODES.map(({ id: mode, icon: ModeIcon }) => (
              <label
                className={cn(
                  'relative flex min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors select-none',
                  theme === mode
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-background/40 hover:text-foreground',
                )}
                key={mode}
              >
                <RadioGroupItem className='absolute sr-only' value={mode} />
                <ModeIcon aria-hidden='true' className='size-3.5 shrink-0' />
                <span className='whitespace-nowrap'>
                  {t('appearance.' + mode, {
                    defaultValue: mode[0].toUpperCase() + mode.slice(1),
                  })}
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
        <fieldset className='space-y-2'>
          <legend className='text-xs font-medium text-muted-foreground'>
            {t('appearance.preset', { defaultValue: 'Theme' })}
          </legend>
          <RadioGroup
            aria-label={t('appearance.preset', { defaultValue: 'Theme' })}
            className='grid-cols-2 gap-2.5'
            name={id + '-preset'}
            onValueChange={(value) => {
              const selected = themePresets.find((item) => item.id === value);
              if (selected) setPreset(selected.id);
            }}
            value={preset}
          >
            {themePresets.map((item) => {
              const isSelected = preset === item.id;
              return (
                <label
                  className={cn(
                    'group relative flex cursor-pointer flex-col rounded-xl border p-2 text-left transition-all select-none',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                      : 'border-border hover:bg-muted/30',
                  )}
                  key={item.id}
                >
                  <RadioGroupItem
                    className='absolute sr-only'
                    value={item.id}
                  />
                  <div className='mb-2 h-16 w-full'>
                    <div
                      aria-hidden='true'
                      className='theme-preview relative flex h-full overflow-hidden rounded-lg border border-border bg-background shadow-2xs'
                      data-theme={item.id}
                    >
                      <div className='flex w-6 flex-col gap-1 border-r border-sidebar-border/50 bg-sidebar p-1'>
                        <div className='size-2 rounded-xs bg-sidebar-primary-foreground' />
                        <div className='h-1 w-full rounded-xs bg-sidebar-foreground/30' />
                        <div className='h-1 w-full rounded-xs bg-sidebar-foreground/20' />
                      </div>
                      <div className='flex flex-1 flex-col p-1.5'>
                        <div className='mb-1 flex items-center justify-between border-b border-border/40 pb-1'>
                          <div className='h-1 w-7 rounded-xs bg-foreground/70' />
                          <div className='size-1.5 rounded-full bg-primary' />
                        </div>
                        <div className='flex flex-1 flex-col justify-between'>
                          <div className='h-1 w-full rounded-xs bg-muted' />
                          <div className='flex items-center justify-between pt-1'>
                            <div className='h-1 w-6 rounded-xs bg-muted' />
                            <div className='h-3 w-5 rounded-xs bg-primary shadow-xs' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-auto flex min-h-5 items-center justify-between gap-2 px-0.5'>
                    <span
                      className={cn(
                        'text-xs transition-colors',
                        isSelected
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground',
                      )}
                    >
                      {t(item.labelKey, {
                        defaultValue:
                          item.id.charAt(0).toUpperCase() + item.id.slice(1),
                      })}
                    </span>
                    {isSelected ? (
                      <span
                        aria-hidden='true'
                        className='flex size-3.5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'
                      >
                        <Check className='size-2 stroke-[3]' />
                      </span>
                    ) : null}
                  </div>
                </label>
              );
            })}
          </RadioGroup>
        </fieldset>
      </PopoverContent>
    </Popover>
  );
}
