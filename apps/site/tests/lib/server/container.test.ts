import { describe, expect, it, vi } from 'vitest';

const infraContainer = {
  projectRepository: { tag: 'project' },
  skillRepository: { tag: 'skill' },
  blogPostRepository: { tag: 'blogPost' },
};

vi.mock('@repo/infra', () => ({
  getContainer: () => infraContainer,
}));

import { getServerContainer } from '~/lib/server/container';

describe('getServerContainer', () => {
  it('should expose the infra repositories including blogPostRepository when called', () => {
    const container = getServerContainer();

    expect(container.projectRepository).toBe(infraContainer.projectRepository);
    expect(container.skillRepository).toBe(infraContainer.skillRepository);
    expect(container.blogPostRepository).toBe(
      infraContainer.blogPostRepository,
    );
  });

  it('should reuse the same blogPostRepository instance across calls', () => {
    expect(getServerContainer().blogPostRepository).toBe(
      getServerContainer().blogPostRepository,
    );
  });
});
