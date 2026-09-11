import { IBlogPostRepository } from '@repo/application/blog';
import {
  getContainer as getInfraContainer,
  Container as InfraContainer,
  PrismaBlogPostRepository,
  prisma,
} from '@repo/infra';

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
    blogPostRepository = new PrismaBlogPostRepository(prisma);
  }

  return {
    ...getInfraContainer(),
    blogPostRepository,
  };
}
