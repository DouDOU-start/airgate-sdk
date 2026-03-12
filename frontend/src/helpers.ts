import type { ThemeTokens, StaticTokens } from './types.js';
import { darkTheme, staticTokens } from './tokens.js';
import { tokenToCssVar, staticToCssVar } from './css.js';

/** 所有可用 token 名称 */
export type TokenName = keyof ThemeTokens | keyof StaticTokens;

/**
 * 获取带 fallback 的 CSS var() 引用。
 * 同时支持主题 token 和静态 token。
 *
 * @example
 * cssVar('primary')    // → 'var(--ag-primary, #3b82f6)'
 * cssVar('bgSurface')  // → 'var(--ag-bg-surface, #1c2237)'
 * cssVar('radiusMd')   // → 'var(--ag-radius-md, 10px)'
 */
export function cssVar(token: TokenName): string {
  if (token in tokenToCssVar) {
    const t = token as keyof ThemeTokens;
    return `var(${tokenToCssVar[t]}, ${darkTheme[t]})`;
  }
  const s = token as keyof StaticTokens;
  return `var(${staticToCssVar[s]}, ${staticTokens[s]})`;
}

/**
 * 批量生成 CSSProperties 对象。
 *
 * @example
 * themeStyle({ color: 'text', backgroundColor: 'bgSurface', borderRadius: 'radiusMd' })
 */
export function themeStyle(
  mapping: Partial<Record<string, TokenName>>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [cssProp, token] of Object.entries(mapping)) {
    if (token) result[cssProp] = cssVar(token);
  }
  return result;
}
