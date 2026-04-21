import { errorResponse, successResponse } from '../envelope';

describe('successResponse', () => {
  it('should return data with null error when no meta is provided', () => {
    const result = successResponse({ id: '1', name: 'Test' });
    expect(result.data).toEqual({ id: '1', name: 'Test' });
    expect(result.error).toBeNull();
    expect(result.meta).toBeUndefined();
  });

  it('should include meta when provided', () => {
    const result = successResponse([1, 2, 3], { total: 3 });
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.error).toBeNull();
    expect(result.meta).toEqual({ total: 3 });
  });

  it('should accept null data', () => {
    const result = successResponse(null);
    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });
});

describe('errorResponse', () => {
  it('should return null data with error code and message', () => {
    const result = errorResponse('NOT_FOUND', 'Resource not found', 404);
    expect(result.data).toBeNull();
    expect(result.error).toEqual({
      code: 'NOT_FOUND',
      message: 'Resource not found',
    });
    expect(result.meta).toEqual({ status: 404 });
  });

  it('should return correct status in meta for validation errors', () => {
    const result = errorResponse('INVALID_SLUG', 'Slug is invalid', 400);
    expect(result.data).toBeNull();
    expect(result.error.code).toBe('INVALID_SLUG');
    expect(result.meta.status).toBe(400);
  });

  it('should return correct status in meta for internal errors', () => {
    const result = errorResponse(
      'INTERNAL_ERROR',
      'Internal server error',
      500,
    );
    expect(result.meta.status).toBe(500);
  });
});
