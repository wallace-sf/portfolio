import { GetCurrentUser, UserDTO } from '@repo/application/identity';
import { DomainError, Either, left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';

import { handleRequest } from '~/lib/api/handler';
import { resolveSessionUserId } from '~/lib/auth/ensure-admin';

export async function GET() {
  return handleRequest<UserDTO>(
    async (): Promise<Either<DomainError, UserDTO>> => {
      const userIdResult = await resolveSessionUserId();
      if (userIdResult.isLeft()) return left(userIdResult.value);

      const { userRepository } = getContainer();
      return new GetCurrentUser(userRepository).execute({
        userId: userIdResult.value,
      });
    },
  );
}
