import { NextRequest, NextResponse } from 'next/server';

import { getSiteApiUrl } from '~/lib/api/internal';

export async function POST(request: NextRequest) {
  const body = await request.text();

  const res = await fetch(`${getSiteApiUrl()}/api/v1/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
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
