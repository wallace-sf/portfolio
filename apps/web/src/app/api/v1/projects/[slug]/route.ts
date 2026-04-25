import { GetProjectBySlug } from '@repo/application/portfolio';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return handleRequest(() => {
    const locale = resolveLocale(request);
    const { projectRepository } = getContainer();
    return new GetProjectBySlug(projectRepository).execute({
      slug: params.slug,
      locale,
    });
  });
}
