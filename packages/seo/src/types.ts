import type { Locale } from '@repo/core/shared';

/** Locale-agnostic path, e.g. '', '/about', '/projects/my-project'. */
export type Pathname = string;

export type HreflangMap = Record<Locale | 'x-default', string>;

export type RssTypeMap = Record<
  'application/rss+xml',
  { url: string; title: string }[]
>;

export interface IRssFeedConfig {
  /** Feed filename, e.g. 'feed.xml' or 'rss.xml'. */
  filename: string;
  title: string;
}

export interface ISeoBuildersConfig {
  /** Canonical public origin, no trailing slash, e.g. 'https://wallace-ferreira.dev'. */
  siteUrl: string;
  /** App's Next.js basePath, e.g. '/blog'. Omit or '' when the app has none. */
  basePath?: string;
  siteName: string;
  /** Omit when the app has no RSS feed. */
  rssFeed?: IRssFeedConfig;
}

export interface IAlternatesResult {
  canonical: string;
  languages: HreflangMap;
  types?: RssTypeMap;
}

export interface IOpenGraphResult {
  type: 'website' | 'article';
  url: string;
  locale: Locale;
  siteName: string;
}

export interface ISeoBuilders {
  buildAlternates(pathname: Pathname, locale: Locale): IAlternatesResult;
  buildOpenGraph(
    locale: Locale,
    pathname: Pathname,
    type?: 'website' | 'article',
  ): IOpenGraphResult;
}
