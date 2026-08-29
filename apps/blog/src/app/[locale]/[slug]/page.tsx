import { GetBlogPostBySlug, ListBlogPosts } from '@repo/application/blog';
import { type Locale, LOCALES } from '@repo/core/shared';
import { Badge } from '@repo/ui/View';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import rehypePrettyCode from 'rehype-pretty-code';

import { DEFAULT_LOCALE } from '~/i18n/routing';
import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';
import { mdxComponents } from '~/mdx-components';

const rehypePrettyCodePlugin: [
  typeof rehypePrettyCode,
  { theme: string; keepBackground: boolean },
] = [rehypePrettyCode, { theme: 'github-dark', keepBackground: true }];

const MDX_OPTIONS = {
  mdxOptions: {
    rehypePlugins: [rehypePrettyCodePlugin],
  },
};

export async function generateStaticParams() {
  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: DEFAULT_LOCALE });

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
    alternates: buildAlternates(`/${slug}`, locale as Locale),
    // `og:image` comes from the sibling `opengraph-image.tsx` (Next file
    // convention) — a per-post rendered card via @repo/seo's renderOgImage.
    openGraph: {
      ...buildOpenGraph(locale as Locale, `/${slug}`, 'article'),
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const result = await new GetBlogPostBySlug(
    getServerContainer().blogPostRepository,
  ).execute({ slug, locale: locale as Locale });

  if (result.isLeft()) notFound();

  const { title, description, publishedAt, tags, content } = result.value;

  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
      <time dateTime={publishedAt}>{publishedAt}</time>
      <div>
        {tags.map((tag) => (
          <Badge.Text key={tag} label={tag} />
        ))}
      </div>
      <article>
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={MDX_OPTIONS}
        />
      </article>
    </main>
  );
}
