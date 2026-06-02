import { GetProjectBySlug } from '@repo/application/portfolio';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const locale = resolveLocale(request);
  return handleRequest(
    () => {
      const { projectRepository, skillRepository } = getContainer();
      return new GetProjectBySlug(projectRepository, skillRepository).execute({
        slug,
        locale,
      });
    },
    200,
    locale,
  );
}
