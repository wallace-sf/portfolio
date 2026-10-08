import {
  type BlogArchiveYearDTO,
  GetBlogArchiveYear,
} from '@repo/application/blog';
import { type Locale, NotFoundError } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Link } from '~/i18n/routing';
import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { getServerContainer } from '~/lib/server/container';
import { formatArchiveMonth } from '~features/blog/formatArchiveMonth';
import { blogArchivePath } from '~features/blog/paths';
import { PostCard } from '~features/blog/PostCard';

import { archiveYearParams, parseYearSegment } from './archive';

export const dynamicParams = false;

export const generateStaticParams = archiveYearParams;

interface BlogYearArchivePageProps {
  params: Promise<{ locale: string; year: string }>;
}

/** The archive year, or `undefined` for a malformed or empty year (→ 404). */
async function findArchiveYear(
  locale: string,
  yearSegment: string,
): Promise<BlogArchiveYearDTO | undefined> {
  const year = parseYearSegment(yearSegment);
  if (year === undefined) return undefined;

  const result = await new GetBlogArchiveYear(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale, year });

  if (result.isRight()) return result.value;

  if (!(result.value instanceof NotFoundError)) {
    // eslint-disable-next-line no-console
    console.error('[blog] could not load the year archive:', result.value);
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: BlogYearArchivePageProps): Promise<Metadata> {
  const { locale, year } = await params;
  const archiveYear = await findArchiveYear(locale, year);

  if (!archiveYear) return {};

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.BlogArchive',
  });
  const path = blogArchivePath(archiveYear.year);
  const title = t('yearTitle', { year });
  const description = t('yearDescription', { year });

  return {
    title,
    description,
    alternates: buildAlternates(path, locale as Locale),
    openGraph: {
      ...buildOpenGraph(locale as Locale, path),
      title,
      description,
    },
  };
}

export default async function BlogYearArchivePage({
  params,
}: BlogYearArchivePageProps) {
  const { locale, year } = await params;
  setRequestLocale(locale);

  const archiveYear = await findArchiveYear(locale, year);

  if (!archiveYear) notFound();

  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <section className="mx-auto w-full max-w-3xl py-4 lg:py-8">
      <header className="mb-8 lg:mb-12">
        <h1 className="text-heading-h2">{t('archiveYearHeading', { year })}</h1>
      </header>

      <div className="flex flex-col gap-10">
        {archiveYear.months.map(({ month, count, posts }) => (
          <section key={month} className="flex flex-col gap-5">
            <header className="flex items-baseline justify-between gap-4">
              <h2 className="text-heading-h4">
                <Link
                  href={blogArchivePath(archiveYear.year, month)}
                  className="hover:underline"
                >
                  {formatArchiveMonth(archiveYear.year, month, locale, {
                    capitalized: true,
                  })}
                </Link>
              </h2>
              <span className="text-body-sm text-content-muted">
                {t('archivePostCount', { count })}
              </span>
            </header>

            <ul className="flex flex-col gap-5">
              {posts.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} locale={locale} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
