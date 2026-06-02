import { toErrorDTO } from '@repo/application/shared';
import { DEFAULT_LOCALE, DomainError, Either, Locale } from '@repo/core/shared';
import { NextResponse } from 'next/server';

import { errorResponse, successResponse } from './envelope';
import { mapDomainErrorToHttp } from './error-mapper';

export async function handleRequest<T>(
  factory: () => Promise<Either<DomainError, T>>,
  successStatus = 200,
  locale: Locale = DEFAULT_LOCALE,
): Promise<NextResponse> {
  try {
    const result = await factory();
    if (result.isLeft()) {
      const error = result.value;
      const { status, code } = mapDomainErrorToHttp(error);
      const { message } = toErrorDTO(error, locale, code);
      return NextResponse.json(errorResponse(code, message, status), {
        status,
      });
    }
    if (successStatus === 204) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json(successResponse(result.value), {
      status: successStatus,
    });
  } catch {
    return NextResponse.json(
      errorResponse(
        'INTERNAL_ERROR',
        toErrorDTO(new DomainError('INTERNAL_ERROR'), locale).message,
        500,
      ),
      { status: 500 },
    );
  }
}
