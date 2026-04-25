import { DomainError } from '../../shared/errors/DomainError';

export class UnauthorizedError extends DomainError {
  static readonly CODE = 'UNAUTHORIZED';

  constructor(options?: {
    message?: string;
    details?: Record<string, unknown>;
  }) {
    const message = options?.message ?? 'Unauthorized access';
    super(UnauthorizedError.CODE, { message, details: options?.details });
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
