import { DEFAULT_LOCALE, LOCALES } from '@repo/core/shared';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export { DEFAULT_LOCALE } from '@repo/core/shared';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
// eslint
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
