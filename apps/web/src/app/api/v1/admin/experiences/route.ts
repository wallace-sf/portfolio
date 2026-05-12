import { EnsureAdmin } from '@repo/application/identity';
import { SaveExperience } from '@repo/application/portfolio';
import { left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveSessionUserId } from '~/lib/auth/ensure-admin';

export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const userIdResult = await resolveSessionUserId();
    if (userIdResult.isLeft()) return left(userIdResult.value);

    const body = await request.json();
    const { experienceRepository, userRepository } = getContainer();
    const ensureAdmin = new EnsureAdmin(userRepository);

    return new SaveExperience(experienceRepository, ensureAdmin).execute({
      userId: userIdResult.value,
      experienceProps: body,
    });
  }, 201);
}
