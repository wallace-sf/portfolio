import { errorResponse, successResponse } from './envelope';

describe('successResponse', () => {
  it('should return success shape with data', () => {
    const result = successResponse({ id: '1', name: 'Project' });

    expect(result).toEqual({ success: true, data: { id: '1', name: 'Project' } });
  });

  it('should work with primitive data types', () => {
    expect(successResponse(42)).toEqual({ success: true, data: 42 });
    expect(successResponse('hello')).toEqual({ success: true, data: 'hello' });
    expect(successResponse(null)).toEqual({ success: true, data: null });
  });
});

describe('errorResponse', () => {
  it('should return error shape with code and message', () => {
    const result = errorResponse('NOT_FOUND', 'Resource not found');

    expect(result).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Resource not found' },
    });
  });

  it('should preserve the error code exactly', () => {
    const result = errorResponse('VALIDATION_ERROR', 'Invalid slug');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
  });
});
