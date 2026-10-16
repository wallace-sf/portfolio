import {
  type BlogPostDetailDTO,
  GetAdjacentBlogPosts,
  GetBlogPostBySlug,
} from '@repo/application/blog';
import { type Locale } from '@repo/core/shared';
import { Divider, Markdown, markdownHeadings } from '@repo/ui/View';
import classNames from 'classnames';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { JsonLd } from '~components';
import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';
import { AuthorByline } from '~features/blog/AuthorByline';
import { BlogBreadcrumbs } from '~features/blog/BlogBreadcrumbs';
import { buildPostJsonLd } from '~features/blog/buildPostJsonLd';
import { blogPostPath, publicationSegments } from '~features/blog/paths';
import { PostCover } from '~features/blog/PostCover';
import { PostHeader } from '~features/blog/PostHeader';
import { MIN_TOC_HEADINGS, PostToc } from '~features/blog/PostToc';
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
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.url ?? post.author.name],
      tags: post.tags,
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
  const headings = await markdownHeadings(post.content);
  const hasToc = headings.length >= MIN_TOC_HEADINGS;

  return (
    // With a TOC, `xl` gets a sticky rail beside the article; `data-toc` turns
    // on smooth anchor scrolling (globals.css).
    <div
      data-toc={hasToc || undefined}
      className={classNames(
        hasToc && 'xl:grid xl:grid-cols-[minmax(0,1fr)_11rem] xl:gap-10',
      )}
    >
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-4 lg:py-8">
        <JsonLd data={buildPostJsonLd(post, locale)} />
        <BlogBreadcrumbs locale={locale} target={post} />

        {post.coverImage && <PostCover image={post.coverImage} />}

        <PostHeader
          title={post.title}
          description={post.description}
          publishedAt={post.publishedAt}
          updatedAt={post.updatedAt}
          readingMinutes={post.readingMinutes}
          authorName={post.author.name}
          tags={post.tags}
          locale={locale}
        />

        <div className="xl:hidden">
          <PostToc headings={headings} locale={locale} variant="inline" />
        </div>

        <Divider />

        <Markdown content={post.content} />

        <AuthorByline author={post.author} locale={locale} />

        {(newer || older) && (
          <>
            <Divider />
            <PrevNextNav newer={newer} older={older} locale={locale} />
          </>
        )}
      </article>

      {hasToc && (
        <aside className="hidden xl:block">
          <div className="sticky top-8 py-8">
            <PostToc headings={headings} locale={locale} variant="rail" />
          </div>
        </aside>
      )}
    </div>
  );
}
