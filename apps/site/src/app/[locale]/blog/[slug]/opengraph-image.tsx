import { GetBlogPostBySlug, ListBlogPosts } from '@repo/application/blog';
import { DEFAULT_LOCALE, type Locale, LOCALES } from '@repo/core/shared';
import { OG_IMAGE_SIZE, renderOgImage } from '@repo/seo/renderOgImage';
import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';

import { env } from '~/config/env';
import { getServerContainer } from '~/lib/server/container';

// Node runtime (the default): the post is read through
// FileSystemBlogPostRepository, which the edge runtime can't do.

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';
export const alt = 'Wallace Ferreira — Blog';

const siteHost = new URL(env.siteUrl).host;

export async function generateStaticParams() {
  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  if (result.isLeft()) {
    // eslint-disable-next-line no-console
    console.warn(
      '[blog] could not list posts for OG image static params — no cards will be prerendered',
    );
  }

  const slugs = result.isRight() ? result.value.map((post) => post.slug) : [];
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

interface OgImageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function Image({ params }: OgImageProps) {
  const { locale, slug } = await params;

  const result = await new GetBlogPostBySlug(
    getServerContainer().blogPostRepository,
  ).execute({ slug, locale: locale as Locale });

  if (result.isLeft()) notFound();

  const { title, description } = result.value;

  return new ImageResponse(
    renderOgImage({
      title,
      subtitle: description,
      locale: locale as Locale,
      page: 'BLOG',
      siteHost,
    }),
    size,
  );
}
