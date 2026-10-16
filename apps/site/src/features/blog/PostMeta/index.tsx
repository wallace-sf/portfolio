import { Fragment, type ReactNode } from 'react';

import { getTranslations } from 'next-intl/server';

import { formatPublishedAt } from '~features/blog/formatPublishedAt';

export interface IPostMetaProps {
  publishedAt: string;
  readingMinutes: number;
  locale: string;
  updatedAt?: string;
  /** Credited as "By {name}" when present (the post header, not cards). */
  authorName?: string;
}

/** `YYYY-MM-DD` of an ISO timestamp in UTC — the day dates are formatted in. */
const utcDay = (iso: string): string =>
  new Date(iso).toISOString().slice(0, 10);

const updatedLater = (publishedAt: string, updatedAt?: string): boolean =>
  updatedAt !== undefined && utcDay(updatedAt) > utcDay(publishedAt);

/**
 * The post's metadata line: published date · "Updated …" (only when updated on
 * a later day) · "By {author}" (when given) · reading time.
 */
export async function PostMeta({
  publishedAt,
  readingMinutes,
  locale,
  updatedAt,
  authorName,
}: IPostMetaProps) {
  const t = await getTranslations({ locale, namespace: 'Blog' });

  const items: ReactNode[] = [
    <time key="published" dateTime={publishedAt}>
      {formatPublishedAt(publishedAt, locale)}
    </time>,
    updatedLater(publishedAt, updatedAt) && updatedAt && (
      <time key="updated" dateTime={updatedAt}>
        {t('updatedOn', { date: formatPublishedAt(updatedAt, locale) })}
      </time>
    ),
    authorName && (
      <span key="author">{t('byAuthor', { name: authorName })}</span>
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
