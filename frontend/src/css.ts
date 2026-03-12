import type { ThemeTokens, StaticTokens, ThemeName } from './types.js';
import { themes, staticTokens } from './tokens.js';

/** camelCase → kebab-case */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

/** 主题 token → CSS 变量名映射 */
export const tokenToCssVar = Object.keys(themes.dark).reduce(
  (acc, key) => {
    acc[key as keyof ThemeTokens] = `--ag-${toKebab(key)}`;
    return acc;
  },
  {} as Record<keyof ThemeTokens, string>,
);

/** 静态 token → CSS 变量名映射 */
export const staticToCssVar = Object.keys(staticTokens).reduce(
  (acc, key) => {
    acc[key as keyof StaticTokens] = `--ag-${toKebab(key)}`;
    return acc;
  },
  {} as Record<keyof StaticTokens, string>,
);

function themeVarsBlock(theme: ThemeTokens): string {
  return Object.entries(theme)
    .map(([key, value]) => `  --ag-${toKebab(key)}: ${value};`)
    .join('\n');
}

function staticVarsBlock(): string {
  return Object.entries(staticTokens)
    .map(([key, value]) => `  --ag-${toKebab(key)}: ${value};`)
    .join('\n');
}

/**
 * 生成完整的 CSS 变量定义字符串。
 * 输出：:root（静态）+ :root[data-theme="dark"] + :root[data-theme="light"]
 */
export function generateThemeCSS(): string {
  return [
    `:root {\n${staticVarsBlock()}\n}`,
    `:root[data-theme="dark"] {\n${themeVarsBlock(themes.dark)}\n}`,
    `:root[data-theme="light"] {\n${themeVarsBlock(themes.light)}\n}`,
  ].join('\n\n');
}

/** 运行时注入主题 CSS 到 <head> */
export function injectThemeStyle(id = 'ag-theme-vars'): void {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = generateThemeCSS();
}

/** 设置当前主题（data-theme 属性 + localStorage） */
export function setTheme(theme: ThemeName): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ag-theme', theme);
}

/** 读取已保存的主题偏好，默认 dark */
export function getStoredTheme(): ThemeName {
  if (typeof localStorage === 'undefined') return 'dark';
  return (localStorage.getItem('ag-theme') as ThemeName) || 'dark';
}
