import { GetBlogPostBySlug } from '@repo/application/blog';
import { type Locale } from '@repo/core/shared';
import { OG_IMAGE_SIZE, renderOgImage } from '@repo/seo/renderOgImage';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { env } from '~/config/env';
import { getServerContainer } from '~/lib/server/container';

import {
  type BlogPostRouteParams,
  blogPostStaticParams,
} from './static-params';

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';
export const alt = 'Wallace Ferreira — Blog';

export const dynamicParams = false;

export const generateStaticParams = blogPostStaticParams;

const siteHost = new URL(env.siteUrl).host;

interface OgImageProps {
  params: Promise<BlogPostRouteParams>;
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
