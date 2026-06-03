import { getContainer as getInfraContainer, Container } from '@repo/infra';

export type { Container };

/** Revalidation interval for ISR pages: 24 hours in seconds. */
export const REVALIDATE_SECONDS = 86400;

/**
 * Returns the DI container for use in Server Components only.
 * Never import this in 'use client' files — use /api/v1/... instead.
 */
export function getServerContainer(): Container {
  return getInfraContainer();
}
