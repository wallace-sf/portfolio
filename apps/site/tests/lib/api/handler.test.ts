/**
 * @vitest-environment node
 */
import { DomainError, NotFoundError, ValidationError, left, right } from '@repo/core/shared';

import { handleRequest } from '~/lib/api/handler';

describe('handleRequest', () => {
  it('should return 200 with successResponse when factory resolves right', async () => {
    const response = await handleRequest(() =>
      Promise.resolve(right<DomainError, { id: string }>({ id: '1' })),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual({ id: '1' });
    expect(body.error).toBeNull();
  });

  it('should use custom successStatus when provided', async () => {
    const response = await handleRequest(
      () => Promise.resolve(right<DomainError, null>(null)),
      201,
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data).toBeNull();
    expect(body.error).toBeNull();
  });

  it('should return 404 when factory resolves left(NotFoundError)', async () => {
    const response = await handleRequest(() =>
      Promise.resolve(left(new NotFoundError({ slug: 'missing' }))),
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.data).toBeNull();
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 with original code when factory resolves left(ValidationError)', async () => {
    const response = await handleRequest(() =>
      Promise.resolve(left(new ValidationError({ code: 'INVALID_SLUG', message: 'Bad slug' }))),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_SLUG');
    expect(body.error.message).toBe('Bad slug');
  });

  it('should return 500 with INTERNAL_ERROR when factory throws', async () => {
    const response = await handleRequest(() => {
      throw new Error('Unexpected DB failure');
    });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.data).toBeNull();
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });

  it('should return 500 when factory returns left with unknown DomainError', async () => {
    const response = await handleRequest(() =>
      Promise.resolve(left(new DomainError('FETCH_FAILED', { message: 'timeout' }))),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
