import { right } from '@repo/core/shared';
import {
  SUPABASE_ACCESS_TOKEN_COOKIE,
  SUPABASE_REFRESH_TOKEN_COOKIE,
  getContainer,
} from '@repo/infra';

import { handleRequest } from '~/lib/api/handler';
import {
  clearSessionCookies,
  createNextAuthCookieApi,
} from '~/lib/auth/cookie';

export async function POST() {
  return handleRequest(async () => {
    const { authGateway } = getContainer();
    const cookieApi = await createNextAuthCookieApi();
    const accessToken = cookieApi.get(SUPABASE_ACCESS_TOKEN_COOKIE) ?? '';
    const refreshToken = cookieApi.get(SUPABASE_REFRESH_TOKEN_COOKIE) ?? '';

    const result = await authGateway.signOut(accessToken, refreshToken);
    if (result.isLeft()) return result;

    clearSessionCookies(cookieApi);
    return right(null as unknown);
  });
}
