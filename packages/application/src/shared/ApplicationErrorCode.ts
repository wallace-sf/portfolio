/**
 * Error codes shared across use cases for infrastructure-level failures
 * (repository fetch/save operations), as opposed to domain-specific
 * `DomainError`/`ValidationError` codes raised by entities and VOs.
 */
export const ApplicationErrorCode = {
  FETCH_FAILED: 'FETCH_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
} as const;
