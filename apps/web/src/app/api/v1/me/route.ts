import {
  EnsureAppUserForAuthSession,
  GetCurrentUser,
  UserDTO,
} from '@repo/application/identity';
import { DomainError, Either, left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';

import { handleRequest } from '~/lib/api/handler';
import { createNextAuthCookieApi } from '~/lib/auth/cookie';

export async function GET() {
  return handleRequest<UserDTO>(
    async (): Promise<Either<DomainError, UserDTO>> => {
      const { authGateway, userRepository } = getContainer();
      const cookieApi = createNextAuthCookieApi();

      const principalResult =
        await authGateway.getPrincipalFromCookies(cookieApi);
      if (principalResult.isLeft()) return left(principalResult.value);

      const principal = principalResult.value;

      const ensureResult = await new EnsureAppUserForAuthSession(
        userRepository,
      ).execute({
        authSubject: principal.id,
        email: principal.email,
      });
      if (ensureResult.isLeft()) return left(ensureResult.value);

      return new GetCurrentUser(userRepository).execute({
        userId: ensureResult.value,
      });
    },
  );
}
