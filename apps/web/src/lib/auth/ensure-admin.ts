import { EnsureAppUserForAuthSession } from '@repo/application/identity';
import { DomainError, Either, left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';

import { createNextAuthCookieApi } from './cookie';

export async function resolveSessionUserId(): Promise<
  Either<DomainError, string>
> {
  const { authGateway, userRepository } = getContainer();
  const cookieApi = await createNextAuthCookieApi();

  const principalResult = await authGateway.getPrincipalFromCookies(cookieApi);
  if (principalResult.isLeft()) return left(principalResult.value);

  const principal = principalResult.value;

  return new EnsureAppUserForAuthSession(userRepository).execute({
    authSubject: principal.id,
    email: principal.email,
  });
}
