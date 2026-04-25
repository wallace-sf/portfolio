import { EnsureAppUserForAuthSession } from '@repo/application/identity';
import { ValidationError, left, right } from '@repo/core/shared';
import {
  SUPABASE_ACCESS_TOKEN_COOKIE,
  SUPABASE_REFRESH_TOKEN_COOKIE,
  getContainer,
} from '@repo/infra';
import { Validator } from '@repo/utils/validator';
import { NextRequest } from 'next/server';

import { HttpErrorCodes } from '~/lib/api/error-codes';
import { handleRequest } from '~/lib/api/handler';
import { createNextAuthCookieApi } from '~/lib/auth/cookie';

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

    const { authGateway, userRepository } = getContainer();

    const sessionResult = await authGateway.signInWithPassword({
      email: body.email ?? '',
      password: body.password ?? '',
    });

    if (sessionResult.isLeft()) return sessionResult;

    const session = sessionResult.value;
    const cookieApi = createNextAuthCookieApi();
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

    const principalResult = await authGateway.getPrincipalFromCookies({
      get: (name) =>
        name === SUPABASE_ACCESS_TOKEN_COOKIE ? session.accessToken : undefined,
      set: () => {},
      delete: () => {},
    });

    if (principalResult.isLeft()) return principalResult;

    const ensureResult = await new EnsureAppUserForAuthSession(
      userRepository,
    ).execute({
      authSubject: principalResult.value.id,
      email: principalResult.value.email,
    });

    if (ensureResult.isLeft()) return ensureResult;

    return right(null as unknown);
  });
}
