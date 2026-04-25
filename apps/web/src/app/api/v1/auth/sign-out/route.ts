import { right } from '@repo/core/shared';
import { getContainer } from '@repo/infra';

import { handleRequest } from '~/lib/api/handler';
import { createNextAuthCookieApi } from '~/lib/auth/cookie';

export async function POST() {
  return handleRequest(async () => {
    const { authGateway } = getContainer();
    const cookieApi = createNextAuthCookieApi();

    const result = await authGateway.signOut(cookieApi);
    if (result.isLeft()) return result;

    return right(null as unknown);
  });
}
