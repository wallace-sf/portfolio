import { UnauthorizedError } from '@repo/core/identity';
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { mapDomainErrorToHttp } from '~/lib/api/error-mapper';

describe('mapDomainErrorToHttp', () => {
  it('should map NotFoundError to 404', () => {
    const error = new NotFoundError({ slug: 'my-project' });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(404);
    expect(result.code).toBe('NOT_FOUND');
  });

  it('should map ValidationError to 400 with original code', () => {
    const error = new ValidationError({
      code: 'INVALID_SLUG',
      message: 'Slug is invalid',
    });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(400);
    expect(result.code).toBe('INVALID_SLUG');
    expect(result.message).toBe('Slug is invalid');
  });

  it('should map UnauthorizedError to 401', () => {
    const error = new UnauthorizedError();
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(401);
    expect(result.code).toBe('UNAUTHORIZED');
  });

  it('should map generic DomainError to 500 with INTERNAL_ERROR code', () => {
    const error = new DomainError('FETCH_FAILED', {
      message: 'DB connection failed',
    });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(500);
    expect(result.code).toBe('INTERNAL_ERROR');
  });

  it.each([
    ['NO_ACCESS_TOKEN', 401, 'AUTH_REQUIRED'],
    ['INVALID_ACCESS_TOKEN', 401, 'AUTH_REQUIRED'],
    ['NO_REFRESH_TOKEN', 401, 'AUTH_REQUIRED'],
    ['INVALID_REFRESH_TOKEN', 401, 'AUTH_REQUIRED'],
  ])('should map DomainError(%s) to %i with code %s', (code, status, httpCode) => {
    const error = new DomainError(code, { message: 'auth error' });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(status);
    expect(result.code).toBe(httpCode);
  });

  it('should map INVALID_CREDENTIALS to 401 with AUTH_INVALID_CREDENTIALS', () => {
    const error = new DomainError('INVALID_CREDENTIALS', {
      message: 'Wrong password',
    });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(401);
    expect(result.code).toBe('AUTH_INVALID_CREDENTIALS');
    expect(result.message).toBe('Wrong password');
  });

  it('should map AUTH_SUBJECT_CONFLICT to 409', () => {
    const error = new DomainError('AUTH_SUBJECT_CONFLICT', {
      message: 'Email already linked',
    });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(409);
    expect(result.code).toBe('AUTH_SUBJECT_CONFLICT');
  });
});
