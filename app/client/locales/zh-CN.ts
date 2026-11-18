import fileUi from '../extensions/nocobase-file-component-ui/locales/zh-CN.js';
import type { AppResource } from './en-US.js';
import systemZhCN from './system/zh-CN.js';

const zhCN: AppResource = {
  // The template's own copy; see `./en-US.ts`.
  ...systemZhCN,
  ...fileUi,
  navigation: { ...systemZhCN.navigation, invite: '打开邀请链接' },
  invite: {
    action: '打开邀请链接',
    description: '输入 Studio 邀请码，程序会自动在浏览器中打开对应的邀请链接。',
    errorInvalid: '邀请码格式不正确：应以 G- 开头，后跟 8–64 位字母、数字、下划线或短横线。',
    errorRequired: '请输入邀请码。',
    label: '邀请码',
    placeholder: '例如：G-AG8p4FpnpAu83F_vJ1ND0aJ',
    success: '邀请码有效，已尝试打开链接：',
    title: '打开 Studio 邀请链接',
  },
};

export default zhCN;
