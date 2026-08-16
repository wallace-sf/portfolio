import { ListBlogPosts } from '@repo/application/blog';
import { type Locale, LOCALES } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale });

  const posts = result.isRight() ? result.value : [];

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
