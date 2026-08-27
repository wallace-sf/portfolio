// next.config.mjs loads this package's source directly (no bundler), so the
// specifier must resolve to an exact file — Node/Next's config loader
// doesn't rewrite `.ts` extensions the way TypeScript's bundler mode does.
// eslint-disable-next-line import/extensions
export { getSecurityHeaders } from './securityHeaders.ts';
export type {
  ISecurityHeader,
  IGetSecurityHeadersOptions,
  // eslint-disable-next-line import/extensions
} from './securityHeaders.ts';
