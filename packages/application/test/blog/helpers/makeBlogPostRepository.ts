import { vi } from 'vitest';

import { IBlogPostRepository } from '~/blog/ports';

/** A stub `IBlogPostRepository`; override the methods a test cares about. */
export function makeBlogPostRepository(
  overrides: Partial<IBlogPostRepository> = {},
): IBlogPostRepository {
  return { findAll: vi.fn(), findBySlug: vi.fn(), ...overrides };
}
