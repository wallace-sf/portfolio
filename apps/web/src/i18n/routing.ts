import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en-US', 'es', 'pt-BR'],

  // Used when no locale matches
  defaultLocale: 'en-US',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
// eslint
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
