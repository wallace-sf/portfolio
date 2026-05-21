import { GetFeaturedProjects } from '@repo/application/portfolio';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  return handleRequest(
    () => {
      const { projectRepository, skillRepository } = getContainer();
      return new GetFeaturedProjects(
        projectRepository,
        skillRepository,
      ).execute({ locale });
    },
    200,
    locale,
  );
}
