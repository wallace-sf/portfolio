import { describe, expect, it } from 'vitest';

import { getServerContainer } from '~/lib/server/container';

describe('getServerContainer', () => {
  it('should return the same blogPostRepository instance when called multiple times', () => {
    const first = getServerContainer();
    const second = getServerContainer();

    expect(first.blogPostRepository).toBe(second.blogPostRepository);
  });

  it('should expose a blogPostRepository with findAll and findBySlug methods', () => {
    const { blogPostRepository } = getServerContainer();

    expect(typeof blogPostRepository.findAll).toBe('function');
    expect(typeof blogPostRepository.findBySlug).toBe('function');
  });
});
