import { SendContactMessage } from '@repo/application/contact';
import { getContainer } from '@repo/infra';
import { NextRequest, NextResponse } from 'next/server';

import { errorResponse, successResponse } from '~/lib/api/envelope';
import { HttpErrorCodes } from '~/lib/api/error-codes';
import { mapDomainErrorToHttp } from '~/lib/api/error-mapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        errorResponse(HttpErrorCodes.INVALID_INPUT, 'Invalid JSON body', 400),
        {
          status: 400,
        },
      );
    }

    const { emailService } = getContainer();
    const useCase = new SendContactMessage(emailService);
    const result = await useCase.execute({
      name: body.name ?? '',
      email: body.email ?? '',
      message: body.message ?? '',
    });

    if (result.isLeft()) {
      const { status, code, message } = mapDomainErrorToHttp(result.value);
      return NextResponse.json(errorResponse(code, message, status), {
        status,
      });
    }

    return NextResponse.json(successResponse(null), { status: 201 });
  } catch {
    return NextResponse.json(
      errorResponse(
        HttpErrorCodes.INTERNAL_ERROR,
        'Internal server error',
        500,
      ),
      {
        status: 500,
      },
    );
  }
}
