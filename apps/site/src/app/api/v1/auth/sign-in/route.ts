import { SignIn } from '@repo/application/identity';
import { ValidationError, left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { Validator } from '@repo/utils/validator';
import { NextRequest } from 'next/server';

import { HttpErrorCodes } from '~/lib/api/error-codes';
import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';
import { createNextAuthCookieApi, setSessionCookies } from '~/lib/auth/cookie';

export async function POST(request: NextRequest) {
  const locale = resolveLocale(request);
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

      const { authGateway, userRepository } = getContainer();

      const result = await new SignIn(authGateway, userRepository).execute({
        email: body.email ?? '',
        password: body.password ?? '',
      });

      if (result.isLeft()) return result;

      const session = result.value;
      const cookieApi = await createNextAuthCookieApi();

      setSessionCookies(cookieApi, session);

      return result;
    },
    200,
    locale,
  );
}
