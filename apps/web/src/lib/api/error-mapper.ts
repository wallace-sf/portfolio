import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';
import { UnauthorizedError } from '@repo/core/identity';

export interface HttpError {
  status: number;
  code: string;
  message: string;
}

export function mapDomainErrorToHttp(error: DomainError): HttpError {
  if (error instanceof NotFoundError) {
    return { status: 404, code: error.code, message: error.message };
  }
  if (error instanceof ValidationError) {
    return { status: 400, code: error.code, message: error.message };
  }
  if (error instanceof UnauthorizedError) {
    return { status: 401, code: error.code, message: error.message };
  }
  return { status: 500, code: 'INTERNAL_ERROR', message: 'Internal server error' };
}
