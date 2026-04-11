import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';
import { UnauthorizedError } from '@repo/core/identity';

import { mapDomainErrorToHttp } from '../error-mapper';

describe('mapDomainErrorToHttp', () => {
  it('should map NotFoundError to 404', () => {
    const error = new NotFoundError({ slug: 'my-project' });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(404);
    expect(result.code).toBe('NOT_FOUND');
  });

  it('should map ValidationError to 400 with original code', () => {
    const error = new ValidationError({ code: 'INVALID_SLUG', message: 'Slug is invalid' });
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
    const error = new DomainError('FETCH_FAILED', { message: 'DB connection failed' });
    const result = mapDomainErrorToHttp(error);
    expect(result.status).toBe(500);
    expect(result.code).toBe('INTERNAL_ERROR');
  });
});
