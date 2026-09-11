import { getContainer, Container } from '@repo/infra';

export type { Container };

/**
 * Returns the DI container for use in Server Components only.
 * Never import this in 'use client' files.
 */
export function getServerContainer(): Container {
  return getContainer();
}
