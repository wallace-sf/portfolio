import { Fragment, type ReactNode } from 'react';

import { getTranslations } from 'next-intl/server';

import { formatPublishedAt } from '~features/blog/formatPublishedAt';

export interface IPostMetaProps {
  publishedAt: string;
  readingMinutes: number;
  locale: string;
  updatedAt?: string;
  /** Prefixes the date with "Published on" (the post header, not cards). */
  labelled?: boolean;
}

/** `YYYY-MM-DD` of an ISO timestamp in UTC — the day dates are formatted in. */
const utcDay = (iso: string): string =>
  new Date(iso).toISOString().slice(0, 10);

const updatedLater = (publishedAt: string, updatedAt?: string): boolean =>
  updatedAt !== undefined && utcDay(updatedAt) > utcDay(publishedAt);

/**
 * The post's metadata line: published date (optionally labelled) · "Updated …"
 * (only when updated on a later day) · reading time.
 */
export async function PostMeta({
  publishedAt,
  readingMinutes,
  locale,
  updatedAt,
  labelled = false,
}: IPostMetaProps) {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const published = formatPublishedAt(publishedAt, locale);

  const items: ReactNode[] = [
    <time key="published" dateTime={publishedAt}>
      {labelled ? t('publishedOn', { date: published }) : published}
    </time>,
    updatedLater(publishedAt, updatedAt) && updatedAt && (
      <time key="updated" dateTime={updatedAt}>
        {t('updatedOn', { date: formatPublishedAt(updatedAt, locale) })}
      </time>
    ),
    <span key="reading">{t('readingTime', { minutes: readingMinutes })}</span>,
  ].filter(Boolean);

  return (
    <p className="text-body-xs text-content-muted">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          {item}
        </Fragment>
      ))}
    </p>
  );
}
