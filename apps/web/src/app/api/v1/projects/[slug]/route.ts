import { GetProjectBySlug } from '@repo/application/portfolio';
import { getContainer } from '@repo/infra';
import { NextRequest, NextResponse } from 'next/server';

import { errorResponse, successResponse } from '~/lib/api/envelope';
import { mapDomainErrorToHttp } from '~/lib/api/error-mapper';
import { resolveLocale } from '~/lib/api/locale';

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const locale = resolveLocale(request);
    const { projectRepository } = getContainer();
    const useCase = new GetProjectBySlug(projectRepository);
    const result = await useCase.execute({ slug: params.slug, locale });
    if (result.isLeft()) {
      const { status, code, message } = mapDomainErrorToHttp(result.value);
      return NextResponse.json(errorResponse(code, message, status), {
        status,
      });
    }
    return NextResponse.json(successResponse(result.value));
  } catch {
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'Internal server error', 500),
      {
        status: 500,
      },
    );
  }
}
