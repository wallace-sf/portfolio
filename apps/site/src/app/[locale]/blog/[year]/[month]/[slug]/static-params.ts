import { ListBlogPosts } from '@repo/application/blog';
import { DEFAULT_LOCALE, LOCALES } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';
import { publicationSegments } from '~features/blog/paths';

export interface BlogPostRouteParams {
  locale: string;
  year: string;
  month: string;
  slug: string;
}

/**
 * Every `(locale, year, month, slug)` a published post lives at. Shared by the
 * post page and its OpenGraph image; with `dynamicParams = false` on both, any
 * other combination (a wrong period, an unknown or unpublished slug) is a 404.
 */
export async function blogPostStaticParams(): Promise<BlogPostRouteParams[]> {
  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  if (result.isLeft()) {
    // eslint-disable-next-line no-console
    console.error(
      '[blog] could not list posts for static params — no post pages will be prerendered',
      'Error:',
      result.value,
    );
    return [];
  }

  return LOCALES.flatMap((locale) =>
    result.value.map(({ publishedAt, slug }) => ({
      locale,
      ...publicationSegments(publishedAt),
      slug,
    })),
  );
}
