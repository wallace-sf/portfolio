import { PrismaClient } from '@prisma/client';
import { IBlogPostRepository } from '@repo/application/blog';
import { BlogPost } from '@repo/core/blog';
import { Slug } from '@repo/core/shared';

import { BlogPostMapper } from './BlogPostMapper';

export class PrismaBlogPostRepository implements IBlogPostRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(): Promise<BlogPost[]> {
    const rows = await this.db.blogPost.findMany({
      where: { deletedAt: null },
      orderBy: { publishedAt: 'desc' },
    });

    return rows.map((row) => BlogPostMapper.toDomain(row));
  }

  async findBySlug(slug: Slug): Promise<BlogPost | null> {
    const row = await this.db.blogPost.findFirst({
      where: {
        slug: slug.value,
        deletedAt: null,
      },
    });

    if (!row) return null;

    return BlogPostMapper.toDomain(row);
  }
}
