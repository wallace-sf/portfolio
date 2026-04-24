import { DomainError } from '../../shared/errors/DomainError';

export class UnauthorizedError extends DomainError {
  constructor(options?: {
    message?: string;
    details?: Record<string, unknown>;
  }) {
    const message = options?.message ?? 'Unauthorized access';
    super('UNAUTHORIZED', { message, details: options?.details });
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
