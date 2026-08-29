'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export interface INavLinkState {
  /** Locale-prefixed href for the given path. */
  href: string;
  /** Whether the current route matches this link. */
  active: boolean;
}

/**
 * Resolves a locale-relative nav path (`"/"`, `"/projects"`, …) into a
 * locale-prefixed href and whether it matches the current pathname. The root
 * link matches exactly; every other link matches on an exact hit or a path
 * prefix (`"/x"` or `"/x/…"`).
 *
 * Cross-zone and external links do not use this hook — they pass a final href
 * straight to the `Nav` primitives.
 */
export const useNavLink = (path: string): INavLinkState => {
  const locale = useLocale();
  const pathname = usePathname();

  const href = path === '/' ? `/${locale}` : `/${locale}${path}`;
  const isRoot = href === `/${locale}`;
  const active = isRoot
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return { href, active };
};
