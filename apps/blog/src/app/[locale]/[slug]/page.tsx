import { GetBlogPostBySlug } from '@repo/application/blog';
import { type Locale } from '@repo/core/shared';
import { notFound } from 'next/navigation';

import { getServerContainer } from '~/lib/server/container';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const result = await new GetBlogPostBySlug(
    getServerContainer().blogPostRepository,
  ).execute({ slug, locale: locale as Locale });

  if (result.isLeft()) notFound();

  const post = result.value;

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
    </main>
  );
}
