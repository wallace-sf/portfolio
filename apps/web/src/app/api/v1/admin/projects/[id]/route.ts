import { EnsureAdmin } from '@repo/application/identity';
import { DeleteProject, SaveProject } from '@repo/application/portfolio';
import { left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveSessionUserId } from '~/lib/auth/ensure-admin';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return handleRequest(async () => {
    const userIdResult = await resolveSessionUserId();
    if (userIdResult.isLeft()) return left(userIdResult.value);

    const body = await request.json();
    const { projectRepository, userRepository } = getContainer();
    const ensureAdmin = new EnsureAdmin(userRepository);

    return new SaveProject(projectRepository, ensureAdmin).execute({
      userId: userIdResult.value,
      projectProps: { ...body, id },
    });
  });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return handleRequest(async () => {
    const userIdResult = await resolveSessionUserId();
    if (userIdResult.isLeft()) return left(userIdResult.value);

    const { projectRepository, userRepository } = getContainer();
    const ensureAdmin = new EnsureAdmin(userRepository);

    return new DeleteProject(projectRepository, ensureAdmin).execute({
      userId: userIdResult.value,
      projectId: id,
    });
  }, 204);
}
