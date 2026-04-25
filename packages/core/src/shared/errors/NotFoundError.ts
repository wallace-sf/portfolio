import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  static readonly CODE = 'NOT_FOUND';

  constructor(details?: Record<string, unknown>) {
    super(NotFoundError.CODE, {
      message: 'Resource not found',
      details,
    });
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
