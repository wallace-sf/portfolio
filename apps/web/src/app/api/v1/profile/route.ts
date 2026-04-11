import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@repo/infra';
import { GetProfile } from '@repo/application/portfolio';

import { errorResponse, successResponse } from '~/lib/api/envelope';
import { mapDomainErrorToHttp } from '~/lib/api/error-mapper';
import { resolveLocale } from '~/lib/api/locale';

export async function GET(request: NextRequest) {
  try {
    const locale = resolveLocale(request);
    const { profileRepository } = getContainer();
    const useCase = new GetProfile(profileRepository);
    const result = await useCase.execute({ locale });
    if (result.isLeft()) {
      const { status, code, message } = mapDomainErrorToHttp(result.value);
      return NextResponse.json(errorResponse(code, message, status), { status });
    }
    return NextResponse.json(successResponse(result.value));
  } catch {
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'Internal server error', 500), {
      status: 500,
    });
  }
}
