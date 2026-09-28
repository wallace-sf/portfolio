import { PrismaClient } from '@prisma/client';

import { seedBlogPosts } from './seed-data/blog-posts/seedBlogPosts';

/**
 * Seeds only the blog posts (upsert by id), leaving every other table
 * untouched. Used by `db:seed:blog`.
 */
const prisma = new PrismaClient({ datasourceUrl: process.env['DIRECT_URL'] });

seedBlogPosts(prisma)
  .catch((e) => {
    console.error('Blog seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
