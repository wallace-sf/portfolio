import { getTranslations } from 'next-intl/server';

import { Link } from '~/i18n/routing';
import { blogArchivePath } from '~features/blog/paths';

const HEADING_ID = 'archive-nav-heading';

export interface IArchiveNavYear {
  year: number;
  /** Published posts that year. */
  count: number;
}

export interface IArchiveNavProps {
  /** Newest first, as `ListBlogArchive` returns them. */
  years: IArchiveNavYear[];
  locale: string;
}

/** One link per archive year, with its post count. */
export async function ArchiveNav({ years, locale }: IArchiveNavProps) {
  if (years.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <nav aria-labelledby={HEADING_ID} className="flex flex-col gap-4">
      <h2 id={HEADING_ID} className="text-heading-h4">
        {t('archive')}
      </h2>

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {years.map(({ year, count }) => (
          <li key={year}>
            <Link
              href={blogArchivePath(year)}
              className="text-body-base rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {year}{' '}
              <span className="text-content-muted">
                · {t('archivePostCount', { count })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
