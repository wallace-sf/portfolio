import { SendContactMessage } from '@repo/application/contact';
import { ValidationError, left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { Validator } from '@repo/utils/validator';
import { NextRequest, NextResponse } from 'next/server';

import { errorResponse } from '~/lib/api/envelope';
import { HttpErrorCodes } from '~/lib/api/error-codes';
import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';
import { checkContactRateLimit } from '~/lib/rate-limit';

export async function POST(request: NextRequest) {
  const locale = resolveLocale(request);
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const { success, limit, remaining, reset } = await checkContactRateLimit(ip);

  if (!success) {
    return NextResponse.json(
      errorResponse(
        HttpErrorCodes.RATE_LIMIT_EXCEEDED,
        'Too many requests. Please try again later.',
        429,
      ),
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      },
    );
  }

  return handleRequest(
    async () => {
      const body = await request.json().catch(() => null);

      const { isValid } = Validator.of(body)
        .notNil('Invalid JSON body.')
        .refine((v) => typeof v === 'object', 'Invalid JSON body.')
        .validate();

      if (!isValid) {
        return left(
          new ValidationError({ code: HttpErrorCodes.INVALID_INPUT }),
        );
      }

      const { emailService } = getContainer();
      return new SendContactMessage(emailService).execute({
        name: body.name ?? '',
        email: body.email ?? '',
        message: body.message ?? '',
      });
    },
    201,
    locale,
  );
}
