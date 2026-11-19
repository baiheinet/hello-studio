import fileUi from '../extensions/nocobase-file-component-ui/locales/zh-CN.js';
import type { AppResource } from './en-US.js';
import systemZhCN from './system/zh-CN.js';

const zhCN: AppResource = {
  // The template's own copy; see `./en-US.ts`.
  ...systemZhCN,
  ...fileUi,
  invite: {
    action: '打开邀请链接',
    description: '输入 Studio 邀请码，即刻使用智搭。',
    errorRequired: '请输入邀请码。',
    label: '邀请码',
    placeholder: '例如：G-AG8p4FpnpAu83F_vJ1ND0aJ',
    success: '已尝试打开链接：',
    title: '打开 Studio 邀请链接',
  },
};

export default zhCN;
