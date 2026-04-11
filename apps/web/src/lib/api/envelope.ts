export interface SuccessResponse<T> {
  data: T;
  error: null;
  meta?: { total?: number };
}

export interface ErrorResponse {
  data: null;
  error: { code: string; message: string };
  meta: { status: number };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T>(data: T, meta?: { total?: number }): SuccessResponse<T> {
  return { data, error: null, ...(meta ? { meta } : {}) };
}

export function errorResponse(code: string, message: string, status: number): ErrorResponse {
  return { data: null, error: { code, message }, meta: { status } };
}
