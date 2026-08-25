import { ListBlogPosts } from '@repo/application/blog';
import { type Locale, LOCALES } from '@repo/core/shared';
import { Badge } from '@repo/ui/View';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '~/i18n/routing';
import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('', locale as Locale),
    openGraph: {
      ...buildOpenGraph(locale as Locale, ''),
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale });

  const posts = result.isRight() ? result.value : [];

  return (
    <main>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/${post.slug}`}>
                <h2>{post.title}</h2>
              </Link>
              <p>{post.description}</p>
              <div>
                {post.tags.map((tag) => (
                  <Badge.Text key={tag} label={tag} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
