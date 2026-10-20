import { Prisma, type PrismaClient } from '@prisma/client';

import { BLOG_POST_AUTHOR, blogPosts } from './index';

export async function seedBlogPosts(db: PrismaClient): Promise<void> {
  // The seed is the source of truth: posts no longer listed (e.g. retired
  // placeholders) are removed so a re-seed also prunes them.
  const { count } = await db.blogPost.deleteMany({
    where: { id: { notIn: blogPosts.map((post) => post.id) } },
  });

  for (const post of blogPosts) {
    const data = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      tags: post.tags,
      author: BLOG_POST_AUTHOR,
      publishedAt: post.publishedAt,
      // Explicit, so `@updatedAt` tracks editorial revisions instead of being
      // bumped by every re-seed.
      updatedAt: post.updatedAt ?? post.publishedAt,
      status: 'PUBLISHED' as const,
      featured: post.featured,
      // Explicit nulls so a re-seed also clears images removed from the source.
      coverImageUrl: post.coverImage?.url ?? null,
      coverImageAlt: post.coverImage?.alt ?? Prisma.JsonNull,
      thumbnailImageUrl: post.thumbnailImage?.url ?? null,
      thumbnailImageAlt: post.thumbnailImage?.alt ?? Prisma.JsonNull,
    };

    await db.blogPost.upsert({
      where: { id: post.id },
      update: data,
      create: { id: post.id, ...data },
    });
  }

  console.log(
    `✔ ${blogPosts.length} blog posts seeded, ${count} stale removed`,
  );
}
