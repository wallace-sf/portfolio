import { IBlogPostRepository } from '@repo/application/blog';
import { FileSystemBlogPostRepository } from '@repo/infra';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), '../../content/posts');

export type Container = {
  blogPostRepository: IBlogPostRepository;
};

let containerInstance: Container | null = null;

/**
 * Returns the DI container for use in Server Components only.
 * Never import this in 'use client' files.
 */
export function getServerContainer(): Container {
  if (!containerInstance) {
    containerInstance = {
      blogPostRepository: new FileSystemBlogPostRepository(CONTENT_DIR),
    };
  }
  return containerInstance;
}
