import { DomainError } from './DomainError';

/**
 * Validation error.
 * Default code: VALIDATION_ERROR.
 */
export class ValidationError extends DomainError {
  constructor(options?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  }) {
    const code = options?.code ?? 'VALIDATION_ERROR';
    const message = options?.message ?? 'Validation failed';
    super(code, { message, details: options?.details });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
