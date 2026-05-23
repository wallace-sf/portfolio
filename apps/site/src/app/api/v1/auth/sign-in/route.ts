import { SignIn } from '@repo/application/identity';
import { ValidationError, left } from '@repo/core/shared';
import {
  SUPABASE_ACCESS_TOKEN_COOKIE,
  SUPABASE_REFRESH_TOKEN_COOKIE,
  getContainer,
} from '@repo/infra';
import { Validator } from '@repo/utils/validator';
import { NextRequest } from 'next/server';

import { HttpErrorCodes } from '~/lib/api/error-codes';
import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';
import { createNextAuthCookieApi } from '~/lib/auth/cookie';

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
      const expiresIn = session.expiresAt - Math.floor(Date.now() / 1000);

      cookieApi.set(SUPABASE_ACCESS_TOKEN_COOKIE, session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiresIn,
        path: '/',
      });
      cookieApi.set(SUPABASE_REFRESH_TOKEN_COOKIE, session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      return result;
    },
    200,
    locale,
  );
}
