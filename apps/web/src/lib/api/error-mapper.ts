import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

export interface HttpErrorResult {
  status: number;
  code: string;
  message: string;
}

export function mapDomainErrorToHttp(error: DomainError): HttpErrorResult {
  if (error instanceof NotFoundError) {
    return { status: 404, code: error.code, message: error.message };
  }
  if (error instanceof ValidationError) {
    return { status: 422, code: error.code, message: error.message };
  }
  return { status: 500, code: error.code, message: 'Internal server error' };
}
