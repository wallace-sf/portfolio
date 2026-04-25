import { right } from '@repo/core/shared';
import {
  SUPABASE_ACCESS_TOKEN_COOKIE,
  SUPABASE_REFRESH_TOKEN_COOKIE,
  getContainer,
} from '@repo/infra';

import { handleRequest } from '~/lib/api/handler';
import { createNextAuthCookieApi } from '~/lib/auth/cookie';

export async function POST() {
  return handleRequest(async () => {
    const { authGateway } = getContainer();
    const cookieApi = createNextAuthCookieApi();

    const sessionResult = await authGateway.refreshSession(cookieApi);
    if (sessionResult.isLeft()) return sessionResult;

    const session = sessionResult.value;
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

    return right(null as unknown);
  });
}
