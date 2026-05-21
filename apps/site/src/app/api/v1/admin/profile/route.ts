import { EnsureAdmin } from '@repo/application/identity';
import { UpdateProfile } from '@repo/application/portfolio';
import { left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';
import { resolveSessionUserId } from '~/lib/auth/ensure-admin';

export async function PUT(request: NextRequest) {
  const locale = resolveLocale(request);
  return handleRequest(
    async () => {
      const userIdResult = await resolveSessionUserId();
      if (userIdResult.isLeft()) return left(userIdResult.value);

      const body = await request.json();
      const { profileRepository, userRepository } = getContainer();
      const ensureAdmin = new EnsureAdmin(userRepository);

      return new UpdateProfile(profileRepository, ensureAdmin).execute({
        userId: userIdResult.value,
        profileProps: body,
      });
    },
    200,
    locale,
  );
}
