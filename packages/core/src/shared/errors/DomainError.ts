/**
 * Base domain error. Extend for domain-specific errors.
 *
 * Error code convention: SCREAMING_SNAKE_CASE (e.g. NOT_FOUND, VALIDATION_ERROR).
 * Context-specific codes can be added later (e.g. PROJECT_NOT_FOUND).
 */
export class DomainError extends Error {
  readonly code: string;
  readonly details?: unknown;
  readonly cause?: unknown;

  constructor(
    code: string,
    options?: { message?: string; details?: unknown; cause?: unknown },
  ) {
    const message = options?.message ?? code;
    super(message);
    this.code = code;
    this.details = options?.details;
    this.cause = options?.cause;
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
