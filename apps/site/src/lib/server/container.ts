import { IBlogPostRepository } from '@repo/application/blog';
import {
  getContainer as getInfraContainer,
  Container as InfraContainer,
  FileSystemBlogPostRepository,
} from '@repo/infra';
import path from 'node:path';

/**
 * The blog is a file-backed bounded context: posts live in `content/posts/`
 * at the repo root, read relative to this app's CWD (`apps/site`).
 */
const BLOG_CONTENT_DIR = path.join(process.cwd(), '../../content/posts');

export type Container = InfraContainer & {
  blogPostRepository: IBlogPostRepository;
};

let blogPostRepository: IBlogPostRepository | null = null;

/**
 * Returns the DI container for use in Server Components only.
 * Never import this in 'use client' files.
 */
export function getServerContainer(): Container {
  if (!blogPostRepository) {
    blogPostRepository = new FileSystemBlogPostRepository(BLOG_CONTENT_DIR);
  }

  return {
    ...getInfraContainer(),
    blogPostRepository,
  };
}
