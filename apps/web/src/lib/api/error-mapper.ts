import { UnauthorizedError } from '@repo/core/identity';
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { HttpErrorCodes } from './error-codes';

export interface HttpError {
  status: number;
  code: string;
  message: string;
}

type DomainErrorConstructor = new (...args: never[]) => DomainError;

const HTTP_STATUS_REGISTRY: ReadonlyArray<
  readonly [DomainErrorConstructor, number]
> = [
  [NotFoundError, 404],
  [ValidationError, 400],
  [UnauthorizedError, 401],
];

export function mapDomainErrorToHttp(error: DomainError): HttpError {
  for (const [ErrorClass, status] of HTTP_STATUS_REGISTRY) {
    if (error instanceof ErrorClass) {
      return { status, code: error.code, message: error.message };
    }
  }
  return {
    status: 500,
    code: HttpErrorCodes.INTERNAL_ERROR,
    message: 'Internal server error',
  };
}
