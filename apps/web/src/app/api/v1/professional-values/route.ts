import { GetProfessionalValues } from '@repo/application/portfolio';
import { getContainer } from '@repo/infra';

import { handleRequest } from '~/lib/api/handler';

export async function GET() {
  return handleRequest(() => {
    const { professionalValueRepository } = getContainer();
    return new GetProfessionalValues(professionalValueRepository).execute();
  });
}
