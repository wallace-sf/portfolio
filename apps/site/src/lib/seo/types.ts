import type { Locale } from '@repo/core/shared';

/**
 * Locale-agnostic path used to build alternates/canonical URLs,
 * e.g. '', '/about', '/projects', '/projects/my-project'.
 */
export type Pathname = string;

export type HreflangMap = Record<Locale | 'x-default', string>;
