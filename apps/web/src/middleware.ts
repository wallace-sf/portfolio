import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';

const intl = createIntlMiddleware(routing);

const locales = routing.locales.join('|');
const adminPattern = new RegExp(`^/(${locales})/admin(/|$)`);

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (adminPattern.test(pathname) && !request.cookies.get('sb-access-token')) {
    const locale = pathname.split('/')[1] ?? routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return intl(request) as NextResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
};
