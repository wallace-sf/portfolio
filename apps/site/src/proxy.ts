import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';

const intl = createIntlMiddleware(routing);

export default function middleware(request: NextRequest): NextResponse {
  return intl(request) as NextResponse;
}

export const config = {
  matcher: [
    '/',
    '/((?!api|og|_next|_vercel|.*\\..*).*)',
    '/(en-US|es|pt-BR)/:path*',
  ],
};
