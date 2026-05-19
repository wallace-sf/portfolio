import { GetProfessionalValues } from '@repo/application/portfolio';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';

export async function GET(request: NextRequest) {
  return handleRequest(() => {
    const locale = resolveLocale(request);
    const { professionalValueRepository } = getContainer();
    return new GetProfessionalValues(professionalValueRepository).execute({
      locale,
    });
  });
}
