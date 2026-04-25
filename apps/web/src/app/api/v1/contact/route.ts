import { SendContactMessage } from '@repo/application/contact';
import { ValidationError, left } from '@repo/core/shared';
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { handleRequest } from '~/lib/api/handler';

export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return left(
        new ValidationError({
          code: 'INVALID_INPUT',
          message: 'Invalid JSON body',
        }),
      );
    }
    const { emailService } = getContainer();
    return new SendContactMessage(emailService).execute({
      name: body.name ?? '',
      email: body.email ?? '',
      message: body.message ?? '',
    });
  }, 201);
}
