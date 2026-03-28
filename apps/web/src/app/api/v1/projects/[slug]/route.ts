import { NextResponse } from 'next/server';
import { getContainer } from '@repo/infra';
import { GetProjectBySlug } from '@repo/application/portfolio';
import { DEFAULT_LOCALE, isLocale } from '@repo/core/shared';

import { errorResponse, successResponse } from '~/lib/api/envelope';
import { mapDomainErrorToHttp } from '~/lib/api/error-mapper';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { projectRepository } = getContainer();
  const useCase = new GetProjectBySlug(projectRepository);

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get('locale') ?? '';
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const result = await useCase.execute({ slug: params.slug, locale });

  if (result.isLeft()) {
    const { status, code, message } = mapDomainErrorToHttp(result.value);
    return NextResponse.json(errorResponse(code, message), { status });
  }

  return NextResponse.json(successResponse(result.value));
}
