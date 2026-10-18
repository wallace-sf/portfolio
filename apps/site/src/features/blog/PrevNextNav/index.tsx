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
    // The arrow sits on the outer edge and, motion permitting, nudges outward
    // on hover.
    className: 'sm:col-start-1',
    arrowClassName: 'motion-safe:group-hover:-translate-x-1',
  },
  older: {
    rel: 'next',
    icon: 'material-symbols:arrow-forward',
    labelKey: 'olderPost',
    className: 'flex-row-reverse text-right sm:col-start-2',
    arrowClassName: 'motion-safe:group-hover:translate-x-1',
  },
} as const;

interface IAdjacentLinkProps {
  post: BlogPostLinkDTO;
  direction: keyof typeof DIRECTIONS;
  label: string;
  locale: string;
}

/**
 * Contrast (WCAG AA, small text): the label uses the brand accent in dark
 * (10:1) and `brand-primary-hover` in light (7.8:1, plain `brand-primary` is
 * 4.45:1); the date uses `content-secondary` (≥ 6.6:1). The `!` is needed
 * because the `text-body-*` / `text-overline-*` typography utilities set
 * their own color and weight after Tailwind's.
 */
function AdjacentLink({ post, direction, label, locale }: IAdjacentLinkProps) {
  const { rel, icon, className, arrowClassName } = DIRECTIONS[direction];

  return (
    <Link
      href={blogPostPath(post.publishedAt, post.slug)}
      rel={rel}
      className={classNames(
        'group flex items-center gap-4 rounded-card border border-border-default bg-surface p-4 shadow-drop-sm transition-[border-color,box-shadow] hover:border-brand-primary hover:shadow-drop-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className={classNames(
          'flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-interactive text-content-primary motion-safe:transition-transform',
          arrowClassName,
        )}
      >
        <Icon icon={icon} className="text-xl" />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-overline-sm !text-brand-accent [.light_&]:!text-brand-primary-hover">
          {label}
        </span>
        <span className="text-body-base !font-bold">{post.title}</span>
        <time
          dateTime={post.publishedAt}
          className="text-body-xs !text-content-secondary"
        >
          {formatPublishedAt(post.publishedAt, locale)}
        </time>
      </span>
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
