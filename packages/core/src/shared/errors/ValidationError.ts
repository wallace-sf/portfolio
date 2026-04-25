import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  static readonly CODE = 'VALIDATION_ERROR';

  constructor(options?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  }) {
    const code = options?.code ?? ValidationError.CODE;
    const message = options?.message ?? 'Validation failed';
    super(code, { message, details: options?.details });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
