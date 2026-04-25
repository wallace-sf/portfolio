import { SendContactMessage } from '@repo/application/contact';
import { ValidationError, left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { Validator } from '@repo/utils/validator';
import { NextRequest } from 'next/server';

import { HttpErrorCodes } from '~/lib/api/error-codes';
import { handleRequest } from '~/lib/api/handler';

export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const body = await request.json().catch(() => null);

    const { isValid, error } = Validator.of(body)
      .notNil('Invalid JSON body.')
      .refine((v) => typeof v === 'object', 'Invalid JSON body.')
      .validate();

    if (!isValid && error) {
      return left(
        new ValidationError({
          code: HttpErrorCodes.INVALID_INPUT,
          message: error,
        }),
      );
    }

    const { emailService } = getContainer();
    return new SendContactMessage(emailService).execute({
      name: body.name ?? '',
      email: body.email ?? '',
      message: body.message ?? '',
    });
  }, 201);
}
