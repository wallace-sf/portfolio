import {
  type BlogPostDetailDTO,
  GetAdjacentBlogPosts,
  GetBlogPostBySlug,
} from '@repo/application/blog';
import { type Locale } from '@repo/core/shared';
import { Divider } from '@repo/ui/View';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';
import { blogPostPath, publicationSegments } from '~features/blog/paths';
import { PostBody } from '~features/blog/PostBody';
import { PostCover } from '~features/blog/PostCover';
import { PostHeader } from '~features/blog/PostHeader';
import { PrevNextNav } from '~features/blog/PrevNextNav';

import {
  type BlogPostRouteParams,
  blogPostStaticParams,
} from './static-params';

export const dynamicParams = false;

export const generateStaticParams = blogPostStaticParams;

interface BlogPostPageProps {
  params: Promise<BlogPostRouteParams>;
}

/**
 * The post, or `undefined` when the slug is unknown / unpublished or the URL's
 * year/month don't match its publication date. `dynamicParams = false` already
 * rejects such URLs in a production build; this covers `next dev`, which
 * renders any params on demand.
 */
async function findPostAt({
  locale,
  year,
  month,
  slug,
}: BlogPostRouteParams): Promise<BlogPostDetailDTO | undefined> {
  const result = await new GetBlogPostBySlug(
    getServerContainer().blogPostRepository,
  ).execute({ slug, locale: locale as Locale });

  if (result.isLeft()) return undefined;

  const segments = publicationSegments(result.value.publishedAt);
  const atPeriod = segments.year === year && segments.month === month;

  return atPeriod ? result.value : undefined;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const routeParams = await params;
  const post = await findPostAt(routeParams);

  if (!post) return {};

  const locale = routeParams.locale as Locale;
  const path = blogPostPath(post.publishedAt, post.slug);
  const { title, description } = post;

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    // `og:image` comes from the sibling `opengraph-image.tsx` (Next file
    // convention) — a per-post rendered card via @repo/seo's renderOgImage.
    openGraph: {
      ...buildOpenGraph(locale, path, 'article'),
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const routeParams = await params;
  const { locale, slug } = routeParams;
  setRequestLocale(locale);

  const [post, navResult] = await Promise.all([
    findPostAt(routeParams),
    new GetAdjacentBlogPosts(getServerContainer().blogPostRepository).execute({
      slug,
      locale: locale as Locale,
    }),
  ]);

  if (!post) notFound();

  const { newer, older } = navResult.isRight() ? navResult.value : {};

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 py-4 lg:py-8">
      {post.coverImage && <PostCover image={post.coverImage} />}

      <PostHeader
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        tags={post.tags}
        locale={locale}
      />

      <Divider />

      <PostBody content={post.content} />

      {(newer || older) && (
        <>
          <Divider />
          <PrevNextNav newer={newer} older={older} locale={locale} />
        </>
      )}
    </article>
  );
}
