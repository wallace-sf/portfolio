import { DomainError } from './DomainError';

export class ConflictError extends DomainError {
  static readonly CODE = 'CONFLICT';

  constructor(details?: Record<string, unknown>) {
    super(ConflictError.CODE, {
      message: 'Resource already exists',
      details,
    });
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
