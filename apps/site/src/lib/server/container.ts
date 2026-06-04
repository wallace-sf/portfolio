import { getContainer as getInfraContainer, Container } from '@repo/infra';

export type { Container };

/** Revalidation interval for ISR pages: 24 hours in seconds. */
/**
 * Returns the DI container for use in Server Components only.
 * Never import this in 'use client' files.
 */
export function getServerContainer(): Container {
  return getInfraContainer();
}
