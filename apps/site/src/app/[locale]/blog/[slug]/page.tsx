import {
  GetAdjacentBlogPosts,
  GetBlogPostBySlug,
  ListBlogPosts,
} from '@repo/application/blog';
import { type Locale, LOCALES } from '@repo/core/shared';
import { Divider } from '@repo/ui/View';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE } from '~/i18n/routing';
import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';
import { PostBody } from '~features/blog/PostBody';
import { PostCover } from '~features/blog/PostCover';
import { PostHeader } from '~features/blog/PostHeader';
import { PrevNextNav } from '~features/blog/PrevNextNav';

export async function generateStaticParams() {
  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  if (result.isLeft()) {
    // eslint-disable-next-line no-console
    console.warn(
      '[blog] could not list posts for static params — no post pages will be prerendered',
    );
  }

  const slugs = result.isRight() ? result.value.map((p) => p.slug) : [];
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const result = await new GetBlogPostBySlug(
    getServerContainer().blogPostRepository,
  ).execute({ slug, locale: locale as Locale });

  if (result.isLeft()) return {};

  const { title, description } = result.value;

  return {
    title,
    description,
    alternates: buildAlternates(`/blog/${slug}`, locale as Locale),
    // `og:image` comes from the sibling `opengraph-image.tsx` (Next file
    // convention) — a per-post rendered card via @repo/seo's renderOgImage.
    openGraph: {
      ...buildOpenGraph(locale as Locale, `/blog/${slug}`, 'article'),
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const { blogPostRepository } = getServerContainer();

  const [postResult, navResult] = await Promise.all([
    new GetBlogPostBySlug(blogPostRepository).execute({
      slug,
      locale: locale as Locale,
    }),
    new GetAdjacentBlogPosts(blogPostRepository).execute({
      slug,
      locale: locale as Locale,
    }),
  ]);

  if (postResult.isLeft()) notFound();

  const post = postResult.value;
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
