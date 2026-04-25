import { DomainError, Either } from '@repo/core/shared';
import { NextResponse } from 'next/server';

import { errorResponse, successResponse } from './envelope';
import { mapDomainErrorToHttp } from './error-mapper';

export async function handleRequest<T>(
  factory: () => Promise<Either<DomainError, T>>,
  successStatus = 200,
): Promise<NextResponse> {
  try {
    const result = await factory();
    if (result.isLeft()) {
      const { status, code, message } = mapDomainErrorToHttp(result.value);
      return NextResponse.json(errorResponse(code, message, status), {
        status,
      });
    }
    return NextResponse.json(successResponse(result.value), {
      status: successStatus,
    });
  } catch {
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Internal server error', 500),
      { status: 500 },
    );
  }
}
