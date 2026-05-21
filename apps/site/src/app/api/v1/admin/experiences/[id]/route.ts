import { EnsureAdmin } from '@repo/application/identity';
import { DeleteExperience, SaveExperience } from '@repo/application/portfolio';
import { left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';
import { resolveSessionUserId } from '~/lib/auth/ensure-admin';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const locale = resolveLocale(request);
  return handleRequest(
    async () => {
      const userIdResult = await resolveSessionUserId();
      if (userIdResult.isLeft()) return left(userIdResult.value);

      const body = await request.json();
      const { experienceRepository, userRepository } = getContainer();
      const ensureAdmin = new EnsureAdmin(userRepository);

      return new SaveExperience(experienceRepository, ensureAdmin).execute({
        userId: userIdResult.value,
        experienceProps: { ...body, id },
      });
    },
    200,
    locale,
  );
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return handleRequest(async () => {
    const userIdResult = await resolveSessionUserId();
    if (userIdResult.isLeft()) return left(userIdResult.value);

    const { experienceRepository, userRepository } = getContainer();
    const ensureAdmin = new EnsureAdmin(userRepository);

    return new DeleteExperience(experienceRepository, ensureAdmin).execute({
      userId: userIdResult.value,
      experienceId: id,
    });
  }, 204);
}
