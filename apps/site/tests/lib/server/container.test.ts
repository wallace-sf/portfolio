import { describe, expect, it, vi } from 'vitest';

const infraContainer = {
  projectRepository: { tag: 'project' },
  skillRepository: { tag: 'skill' },
};

vi.mock('@repo/infra', () => ({
  getContainer: () => infraContainer,
  PrismaBlogPostRepository: class {
    findAll = vi.fn();
    findBySlug = vi.fn();
    constructor(public readonly db: unknown) {}
  },
  prisma: {
    blogPost: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import { getServerContainer } from '~/lib/server/container';

describe('getServerContainer', () => {
  it('should expose the infra repositories alongside a blogPostRepository', () => {
    const container = getServerContainer();

    expect(container.projectRepository).toBe(infraContainer.projectRepository);
    expect(container.skillRepository).toBe(infraContainer.skillRepository);
    expect(typeof container.blogPostRepository.findAll).toBe('function');
    expect(typeof container.blogPostRepository.findBySlug).toBe('function');
  });

  it('should reuse the same blogPostRepository instance across calls', () => {
    expect(getServerContainer().blogPostRepository).toBe(
      getServerContainer().blogPostRepository,
    );
  });
});
