import { GetProfile } from '@repo/application/portfolio';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';
import { resolveLocale } from '~/lib/api/locale';

export async function GET(request: NextRequest) {
  return handleRequest(() => {
    const locale = resolveLocale(request);
    const { profileRepository } = getContainer();
    return new GetProfile(profileRepository).execute({ locale });
  });
}
