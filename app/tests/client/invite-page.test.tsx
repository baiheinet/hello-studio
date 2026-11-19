import {
  ClientApplication,
  ClientApplicationContext,
  createAppClientConfig,
  defineAppClientRenderConfig,
  toasterToken,
  type Toaster,
} from '@nocobase/app-client';
import { defineClientPlugins } from '@nocobase/app-client/plugins';
import {
  defineAppRuntime,
  resolveAppRuntime,
} from '@nocobase/app-client/runtime';
import { I18nProvider } from '@nocobase/i18n/client';
import { I18nRuntime } from '@nocobase/i18n';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import InvitePage from '../../client/pages/invite.js';
import { AppThemeProvider } from '../../client/theme/index.js';

const APP = '@nocobase/app-template-default';
const fetchMock = vi.fn();
const toaster = {
  show: vi.fn<Toaster['show']>(() => 'toast'),
  close: vi.fn<Toaster['close']>(),
};
const applications: ClientApplication[] = [];

const copy = {
  'en-US': {
    actions: { language: 'Language' },
    appearance: {
      title: 'Theme',
      mode: 'Color mode',
      preset: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    invite: {
      action: 'Open invite link',
      description:
        'Enter a Studio invite code and its invitation link opens in your browser.',
      errorRequired: 'Please enter an invite code.',
      label: 'Invite code',
      placeholder: 'e.g. G-AG8p4FpnpAu83F_vJ1ND0aJ',
      success: 'Opened the invite link:',
      title: 'Open a Studio invite link',
    },
    notices: {
      serverLocaleFallback:
        'The server does not support this language, so server messages will use English.',
      languageChangeFailed:
        'Unable to complete the language change. Please try again.',
    },
  },
  'zh-CN': {
    actions: { language: '语言' },
    appearance: {
      title: '主题',
      mode: '颜色模式',
      preset: '主题',
      light: '浅色',
      dark: '深色',
      system: '跟随系统',
    },
    invite: {
      action: '打开邀请链接',
      description:
        '输入 Studio 邀请码，程序会自动在浏览器中打开对应的邀请链接。',
      errorRequired: '请输入邀请码。',
      label: '邀请码',
      placeholder: '例如：G-AG8p4FpnpAu83F_vJ1ND0aJ',
      success: '已尝试打开链接：',
      title: '打开 Studio 邀请链接',
    },
    notices: {
      serverLocaleFallback: '服务端不支持该语言，服务端内容已回落为英文。',
      languageChangeFailed: '未能完成语言切换，请重试。',
    },
  },
} as const;

async function createRuntime(locales: string[]): Promise<{
  app: ClientApplication;
  runtime: I18nRuntime;
}> {
  const runtime = new I18nRuntime({
    defaultLocale: 'en-US',
    locales,
    applicationNamespace: APP,
  });
  runtime.registerApplicationNamespace(APP, {
    'en-US': () => Promise.resolve({ default: copy['en-US'] }),
    'zh-CN': () => Promise.resolve({ default: copy['zh-CN'] }),
  });
  await runtime.init('en-US');
  const appRuntime = await resolveAppRuntime(
    defineAppRuntime({
      packageName: APP,
      createAppConfig: createAppClientConfig,
      plugins: defineClientPlugins([]),
    }),
    { rawConfig: { api: { baseURL: '/api' } } },
  );
  const app = new ClientApplication({
    runtime: appRuntime,
    createRenderConfig: () => defineAppClientRenderConfig({ routes: null }),
  });
  // Stands in for the toaster client/service-provider.ts registers.
  app.container.instance(toasterToken, toaster);
  await app.start();
  applications.push(app);
  return { app, runtime };
}

function renderInvite(app: ClientApplication, runtime: I18nRuntime) {
  return render(
    <ClientApplicationContext.Provider value={app}>
      <I18nProvider runtime={runtime}>
        <AppThemeProvider>
          <InvitePage />
        </AppThemeProvider>
      </I18nProvider>
    </ClientApplicationContext.Provider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.localStorage.clear();
  fetchMock.mockImplementation(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: { locale: 'zh-CN', requestedLocale: 'zh-CN', fallback: false },
        }),
        { headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  // jsdom does not implement the media queries used by the real theme provider.
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  }));
});

afterEach(async () => {
  await Promise.all(applications.splice(0).map((app) => app.shutdown()));
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute('class');
  document.documentElement.removeAttribute('style');
  document.documentElement.removeAttribute('data-theme');
});

describe('invite page', () => {
  it('keeps the native language and theme choices in its header', async () => {
    const { app, runtime } = await createRuntime(['en-US', 'zh-CN']);

    renderInvite(app, runtime);

    expect(
      screen.getByRole('button', { name: /Language\s*English/ }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Theme' })).toBeVisible();
  });

  it('switches the interface language from the header', async () => {
    const { app, runtime } = await createRuntime(['en-US', 'zh-CN']);
    const user = userEvent.setup();

    renderInvite(app, runtime);
    await user.click(screen.getByRole('button', { name: /Language/ }));
    // jsdom has no submenu geometry for the pointer safe corridor.
    fireEvent.click(await screen.findByRole('menuitemradio', { name: '中文' }));

    await waitFor(() => expect(runtime.getLocale()).toBe('zh-CN'));
    expect(
      await screen.findByRole('heading', { name: '打开 Studio 邀请链接' }),
    ).toBeVisible();
    expect(screen.getByTestId('submit-button')).toHaveTextContent(
      '打开邀请链接',
    );
  });

  it('switches the color mode from the header', async () => {
    const { app, runtime } = await createRuntime(['en-US', 'zh-CN']);
    const user = userEvent.setup();

    renderInvite(app, runtime);
    await user.click(screen.getByRole('button', { name: 'Theme' }));
    await user.click(
      await screen.findByRole('menuitemradio', { name: 'Dark' }),
    );

    await waitFor(() => expect(document.documentElement).toHaveClass('dark'));
  });

  it('reports an empty code and opens nothing', async () => {
    const { app, runtime } = await createRuntime(['en-US', 'zh-CN']);
    const user = userEvent.setup();

    renderInvite(app, runtime);
    await user.click(screen.getByTestId('submit-button'));

    expect(screen.getByTestId('error')).toHaveTextContent(
      'Please enter an invite code.',
    );
    expect(screen.queryByTestId('success')).not.toBeInTheDocument();
  });
});
