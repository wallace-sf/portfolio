import { describe, expect, it, vi } from 'vitest';

const infraContainer = {
  projectRepository: { tag: 'project' },
  skillRepository: { tag: 'skill' },
};

vi.mock('@repo/infra', () => ({
  getContainer: () => infraContainer,
  FileSystemBlogPostRepository: class {
    findAll = vi.fn();
    findBySlug = vi.fn();
    constructor(public readonly dir: string) {}
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

  it('should point the blog repository at the repo-root content/posts directory', () => {
    const repo = getServerContainer().blogPostRepository as unknown as {
      dir: string;
    };

    expect(repo.dir).toContain('content/posts');
  });
});
