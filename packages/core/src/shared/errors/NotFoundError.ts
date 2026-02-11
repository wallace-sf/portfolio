import { DomainError } from './DomainError';

/**
 * Entity/resource not found error.
 * Default code: NOT_FOUND.
 */
export class NotFoundError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super('NOT_FOUND', {
      message: 'Resource not found',
      details,
    });
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
