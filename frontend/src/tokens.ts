import type { ThemeTokens, StaticTokens, ThemeName } from './types.js';

/** 暗色主题 */
export const darkTheme: ThemeTokens = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primarySubtle: 'rgba(59, 130, 246, 0.12)',
  primaryGlow: 'rgba(59, 130, 246, 0.25)',

  success: '#10b981',
  successSubtle: 'rgba(16, 185, 129, 0.12)',
  warning: '#f59e0b',
  warningSubtle: 'rgba(245, 158, 11, 0.12)',
  danger: '#ef4444',
  dangerSubtle: 'rgba(239, 68, 68, 0.12)',
  info: '#6366f1',
  infoSubtle: 'rgba(99, 102, 241, 0.12)',

  bgDeep: '#0a0e1a',
  bg: '#0f1320',
  bgElevated: '#161b2e',
  bgSurface: '#1c2237',
  bgHover: '#232a42',
  bgActive: '#2a3350',

  border: 'rgba(255, 255, 255, 0.06)',
  borderSubtle: 'rgba(255, 255, 255, 0.03)',
  borderFocus: 'rgba(59, 130, 246, 0.5)',

  text: '#e8ecf4',
  textSecondary: '#8892a8',
  textTertiary: '#5a637a',
  textInverse: '#0f1320',

  glass: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',

  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 16px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 12px 40px rgba(0, 0, 0, 0.5)',
  shadowGlow: '0 0 20px rgba(59, 130, 246, 0.15)',
};

/** 亮色主题 */
export const lightTheme: ThemeTokens = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primarySubtle: 'rgba(37, 99, 235, 0.08)',
  primaryGlow: 'rgba(37, 99, 235, 0.15)',

  success: '#16a34a',
  successSubtle: 'rgba(22, 163, 74, 0.08)',
  warning: '#d97706',
  warningSubtle: 'rgba(217, 119, 6, 0.08)',
  danger: '#dc2626',
  dangerSubtle: 'rgba(220, 38, 38, 0.08)',
  info: '#4f46e5',
  infoSubtle: 'rgba(79, 70, 229, 0.08)',

  bgDeep: '#f5f5f7',
  bg: '#ffffff',
  bgElevated: '#ffffff',
  bgSurface: '#f9fafb',
  bgHover: '#f3f4f6',
  bgActive: '#e5e7eb',

  border: 'rgba(0, 0, 0, 0.08)',
  borderSubtle: 'rgba(0, 0, 0, 0.04)',
  borderFocus: 'rgba(37, 99, 235, 0.5)',

  text: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',

  glass: 'rgba(0, 0, 0, 0.02)',
  glassBorder: 'rgba(0, 0, 0, 0.06)',

  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 12px rgba(0, 0, 0, 0.08)',
  shadowLg: '0 12px 32px rgba(0, 0, 0, 0.12)',
  shadowGlow: '0 0 16px rgba(37, 99, 235, 0.1)',
};

/** 不随主题变化的静态 token */
export const staticTokens: StaticTokens = {
  sidebarWidth: '260px',
  sidebarCollapsed: '72px',
  topbarHeight: '64px',
  radiusSm: '6px',
  radiusMd: '10px',
  radiusLg: '14px',
  radiusXl: '20px',
  fontSans: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontMono: "'JetBrains Mono', 'SF Mono', monospace",
  transition: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  transitionSlow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
};

/** 主题集合 */
export const themes: Record<ThemeName, ThemeTokens> = {
  dark: darkTheme,
  light: lightTheme,
};
