import type { BlogPostLinkDTO } from '@repo/application/blog';
import { getTranslations } from 'next-intl/server';

import { Link } from '~/i18n/routing';

export interface IPrevNextNavProps {
  /** The chronologically newer post, if any. */
  newer?: BlogPostLinkDTO;
  /** The chronologically older post, if any. */
  older?: BlogPostLinkDTO;
  locale: string;
}

export async function PrevNextNav({ newer, older, locale }: IPrevNextNavProps) {
  if (!newer && !older) return null;

  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <nav
      aria-label={t('postNavigation')}
      className="flex flex-col gap-4 sm:flex-row"
    >
      {newer ? (
        <Link
          href={`/blog/${newer.slug}`}
          className="group flex flex-1 flex-col gap-1 rounded-card bg-surface p-4 shadow-drop-sm transition-shadow hover:shadow-drop-md"
        >
          <span className="text-body-xs text-content-muted">
            {t('newerPost')}
          </span>
          <span className="text-body-sm font-bold text-content-primary">
            {newer.title}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}

      {older ? (
        <Link
          href={`/blog/${older.slug}`}
          className="group flex flex-1 flex-col items-end gap-1 rounded-card bg-surface p-4 text-right shadow-drop-sm transition-shadow hover:shadow-drop-md"
        >
          <span className="text-body-xs text-content-muted">
            {t('olderPost')}
          </span>
          <span className="text-body-sm font-bold text-content-primary">
            {older.title}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
