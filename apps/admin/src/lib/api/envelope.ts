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
