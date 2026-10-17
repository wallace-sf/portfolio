import {
  type BlogPostSummaryDTO,
  type BlogTagDTO,
  GetBlogTags,
  ListBlogPostsByTag,
} from '@repo/application/blog';
import {
  DEFAULT_LOCALE,
  type Locale,
  LOCALES,
  ValidationError,
} from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';

/**
 * The bridge between the tag routes and the application: lists the tags to
 * prerender and loads one tag's posts. Which tags exist and which posts carry
 * them is the use cases' call.
 */

/** Every tag with its post count; `[]` (logged) when the posts can't load. */
export async function listTags(locale: string): Promise<BlogTagDTO[]> {
  const result = await new GetBlogTags(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale });

  if (result.isLeft()) {
    // eslint-disable-next-line no-console
    console.error('[blog] could not list tags:', result.value);
    return [];
  }

  return result.value;
}

/** Every `(locale, tag)` that has published posts. */
export async function tagParams(): Promise<{ locale: string; tag: string }[]> {
  const tags = await listTags(DEFAULT_LOCALE);

  return LOCALES.flatMap((locale) => tags.map(({ tag }) => ({ locale, tag })));
}

/**
 * The tag's posts, or `undefined` when there is nothing to show (→ 404): a
 * malformed tag, a tag no published post uses, or a failed load (logged).
 */
export async function findTagPosts(
  locale: string,
  tag: string,
): Promise<BlogPostSummaryDTO[] | undefined> {
  const result = await new ListBlogPostsByTag(
    getServerContainer().blogPostRepository,
  ).execute({ tag, locale: locale as Locale });

  if (result.isLeft()) {
    if (!(result.value instanceof ValidationError)) {
      // eslint-disable-next-line no-console
      console.error(`[blog] could not load posts tagged ${tag}:`, result.value);
    }
    return undefined;
  }

  return result.value.length > 0 ? result.value : undefined;
}
