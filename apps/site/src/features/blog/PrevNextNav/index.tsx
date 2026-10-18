import type { BlogPostLinkDTO } from '@repo/application/blog';
import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { getTranslations } from 'next-intl/server';

import { Link } from '~/i18n/routing';
import { formatPublishedAt } from '~features/blog/formatPublishedAt';
import { blogPostPath } from '~features/blog/paths';

export interface IPrevNextNavProps {
  /** The chronologically newer post, if any. */
  newer?: BlogPostLinkDTO;
  /** The chronologically older post, if any. */
  older?: BlogPostLinkDTO;
  locale: string;
}

/**
 * The listing runs newest first, so the newer post is the previous page
 * (`rel="prev"`, left column) and the older one the next (`rel="next"`, right
 * column — even when it is alone).
 */
const DIRECTIONS = {
  newer: {
    rel: 'prev',
    icon: 'material-symbols:arrow-back',
    labelKey: 'newerPost',
    className: 'sm:col-start-1',
  },
  older: {
    rel: 'next',
    icon: 'material-symbols:arrow-forward',
    labelKey: 'olderPost',
    className: 'items-end text-right sm:col-start-2',
  },
} as const;

interface IAdjacentLinkProps {
  post: BlogPostLinkDTO;
  direction: keyof typeof DIRECTIONS;
  label: string;
  locale: string;
}

function AdjacentLink({ post, direction, label, locale }: IAdjacentLinkProps) {
  const { rel, icon, className } = DIRECTIONS[direction];
  const arrow = <Icon icon={icon} className="text-base" />;

  return (
    <Link
      href={blogPostPath(post.publishedAt, post.slug)}
      rel={rel}
      className={classNames(
        'group flex flex-col gap-1 rounded-card bg-surface p-4 shadow-drop-sm transition-shadow hover:shadow-drop-md',
        className,
      )}
    >
      <span className="text-body-xs flex items-center gap-1 text-content-muted">
        {direction === 'newer' && arrow}
        {label}
        {direction === 'older' && arrow}
      </span>
      <span className="text-body-sm font-bold text-content-primary">
        {post.title}
      </span>
      <time
        dateTime={post.publishedAt}
        className="text-body-xs text-content-muted"
      >
        {formatPublishedAt(post.publishedAt, locale)}
      </time>
    </Link>
  );
}

export async function PrevNextNav({ newer, older, locale }: IPrevNextNavProps) {
  if (!newer && !older) return null;

  const t = await getTranslations({ locale, namespace: 'Blog' });
  const links = [
    { direction: 'newer', post: newer },
    { direction: 'older', post: older },
  ] as const;

  return (
    <nav
      aria-label={t('postNavigation')}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {links.map(
        ({ direction, post }) =>
          post && (
            <AdjacentLink
              key={direction}
              post={post}
              direction={direction}
              label={t(DIRECTIONS[direction].labelKey)}
              locale={locale}
            />
          ),
      )}
    </nav>
  );
}
