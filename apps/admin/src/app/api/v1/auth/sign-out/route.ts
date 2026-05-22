import { NextRequest, NextResponse } from 'next/server';

import { getSiteApiUrl } from '~/lib/api/internal';

export async function POST(request: NextRequest) {
  const res = await fetch(`${getSiteApiUrl()}/api/v1/auth/sign-out`, {
    method: 'POST',
    headers: { cookie: request.headers.get('cookie') ?? '' },
  }).catch(() => null);

  if (!res) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: 'SITE_UNREACHABLE',
          message: 'Could not reach the API.',
        },
      },
      { status: 502 },
    );
  }

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  for (const cookie of res.headers.getSetCookie()) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}
