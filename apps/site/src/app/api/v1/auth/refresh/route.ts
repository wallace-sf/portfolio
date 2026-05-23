import { right } from '@repo/core/shared';
import { SUPABASE_REFRESH_TOKEN_COOKIE, getContainer } from '@repo/infra';

import { handleRequest } from '~/lib/api/handler';
import { createNextAuthCookieApi, setSessionCookies } from '~/lib/auth/cookie';

export async function POST() {
  return handleRequest(async () => {
    const { authGateway } = getContainer();
    const cookieApi = await createNextAuthCookieApi();
    const refreshToken = cookieApi.get(SUPABASE_REFRESH_TOKEN_COOKIE) ?? '';

    const sessionResult = await authGateway.refreshSession(refreshToken);
    if (sessionResult.isLeft()) return sessionResult;

    setSessionCookies(cookieApi, sessionResult.value);
    return right(null as unknown);
  });
}
