/**
 * @jest-environment node
 */
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { mapDomainErrorToHttp } from './error-mapper';

describe('mapDomainErrorToHttp', () => {
  it('should map NotFoundError to 404', () => {
    const error = new NotFoundError({ slug: 'missing-project' });

    const result = mapDomainErrorToHttp(error);

    expect(result.status).toBe(404);
    expect(result.code).toBe('NOT_FOUND');
  });

  it('should map ValidationError to 422', () => {
    const error = new ValidationError({ code: 'INVALID_SLUG', message: 'Slug must be kebab-case.' });

    const result = mapDomainErrorToHttp(error);

    expect(result.status).toBe(422);
    expect(result.code).toBe('INVALID_SLUG');
    expect(result.message).toBe('Slug must be kebab-case.');
  });

  it('should map generic DomainError to 500 with opaque message', () => {
    const error = new DomainError('FETCH_FAILED', { message: 'DB connection refused' });

    const result = mapDomainErrorToHttp(error);

    expect(result.status).toBe(500);
    expect(result.code).toBe('FETCH_FAILED');
    expect(result.message).toBe('Internal server error');
  });
});
