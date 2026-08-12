import { BlogPost } from '@repo/core/blog';
import { Slug } from '@repo/core/shared';

export interface IBlogPostRepository {
  findAll(): Promise<BlogPost[]>;
  findBySlug(slug: Slug): Promise<BlogPost | null>;
}
