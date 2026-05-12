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

type CodeEntry = { status: number; httpCode: string };

const CODE_REGISTRY: Partial<Record<string, CodeEntry>> = {
  INVALID_CREDENTIALS: {
    status: 401,
    httpCode: HttpErrorCodes.AUTH_INVALID_CREDENTIALS,
  },
  NO_ACCESS_TOKEN: { status: 401, httpCode: HttpErrorCodes.AUTH_REQUIRED },
  INVALID_ACCESS_TOKEN: { status: 401, httpCode: HttpErrorCodes.AUTH_REQUIRED },
  NO_REFRESH_TOKEN: { status: 401, httpCode: HttpErrorCodes.AUTH_REQUIRED },
  INVALID_REFRESH_TOKEN: {
    status: 401,
    httpCode: HttpErrorCodes.AUTH_REQUIRED,
  },
  AUTH_SUBJECT_CONFLICT: {
    status: 409,
    httpCode: HttpErrorCodes.AUTH_SUBJECT_CONFLICT,
  },
};

export function mapDomainErrorToHttp(error: DomainError): HttpError {
  for (const [ErrorClass, status] of HTTP_STATUS_REGISTRY) {
    if (error instanceof ErrorClass) {
      return { status, code: error.code, message: error.message };
    }
  }

  const codeEntry = CODE_REGISTRY[error.code];
  if (codeEntry) {
    return {
      status: codeEntry.status,
      code: codeEntry.httpCode,
      message: error.message,
    };
  }

  return {
    status: 500,
    code: HttpErrorCodes.INTERNAL_ERROR,
    message: 'Internal server error',
  };
}
