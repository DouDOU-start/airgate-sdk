/** 随主题变化的 token（颜色、阴影等） */
export interface ThemeTokens {
  // 主色调
  primary: string;
  primaryHover: string;
  primarySubtle: string;
  primaryGlow: string;

  // 语义色
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  dangerSubtle: string;
  info: string;
  infoSubtle: string;

  // 背景层次
  bgDeep: string;
  bg: string;
  bgElevated: string;
  bgSurface: string;
  bgHover: string;
  bgActive: string;

  // 边框
  border: string;
  borderSubtle: string;
  borderFocus: string;

  // 文字
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // 玻璃态
  glass: string;
  glassBorder: string;

  // 阴影
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowGlow: string;
}

/** 不随主题变化的 token（布局、字体、过渡等） */
export interface StaticTokens {
  sidebarWidth: string;
  sidebarCollapsed: string;
  topbarHeight: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  fontSans: string;
  fontMono: string;
  transition: string;
  transitionSlow: string;
}

export type ThemeName = 'dark' | 'light';
