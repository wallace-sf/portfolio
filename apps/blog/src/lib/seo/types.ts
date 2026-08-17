import type { Locale } from '@repo/core/shared';

/**
 * Locale-agnostic path used to build alternates/canonical URLs,
 * e.g. '', '/hello-blog'. Does not include the '/blog' basePath — that's
 * prepended by buildAlternates/buildOpenGraph.
 */
export type Pathname = string;

export type HreflangMap = Record<Locale | 'x-default', string>;
