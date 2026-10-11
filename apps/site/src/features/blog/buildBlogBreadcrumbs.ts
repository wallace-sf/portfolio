import type { IBreadcrumbListItem } from '@repo/seo';

import { env } from '~/config/env';
import type { BreadcrumbItem } from '~features/shared/Breadcrumb';

import { formatArchiveMonth } from './formatArchiveMonth';
import { blogArchivePath, blogPostPath, publicationSegments } from './paths';

/** An archive period: a year, or a month (1–12) of it. */
export interface IBlogArchivePeriod {
  year: number;
  month?: number;
}

/** The post a trail ends at; its year and month come from `publishedAt`. */
export interface IBlogBreadcrumbPost {
  title: string;
  publishedAt: string;
  slug: string;
}

/**
 * The page the trail ends at. Shaped so the pages can pass their DTOs as-is:
 * a post detail, or an archive year / month.
 */
export type BlogBreadcrumbsTarget = IBlogArchivePeriod | IBlogBreadcrumbPost;

const isPost = (target: BlogBreadcrumbsTarget): target is IBlogBreadcrumbPost =>
  'slug' in target;

export interface IBlogBreadcrumbsParams {
  locale: string;
  labels: { home: string; blog: string };
  target: BlogBreadcrumbsTarget;
}

export interface IBlogBreadcrumbs {
  /** For `Breadcrumb`; the current (last) item has no `href`. */
  visible: BreadcrumbItem[];
  /** For `buildBreadcrumbListJsonLd`; absolute, locale-prefixed URLs. */
  jsonLd: IBreadcrumbListItem[];
}

interface ITrailStep {
  label: string;
  /** Locale-agnostic path, as `Link` takes it. */
  path: string;
}

function periodSteps(year: number, month: number | undefined, locale: string) {
  const yearStep: ITrailStep = {
    label: String(year),
    path: blogArchivePath(year),
  };
  if (month === undefined) return [yearStep];

  const monthStep: ITrailStep = {
    label: formatArchiveMonth(year, month, locale, { capitalized: true }),
    path: blogArchivePath(year, month),
  };
  return [yearStep, monthStep];
}

function trailSteps({
  locale,
  labels,
  target,
}: IBlogBreadcrumbsParams): ITrailStep[] {
  const root: ITrailStep[] = [
    { label: labels.home, path: '/' },
    { label: labels.blog, path: '/blog' },
  ];

  if (!isPost(target)) {
    return [...root, ...periodSteps(target.year, target.month, locale)];
  }

  const { year, month } = publicationSegments(target.publishedAt);
  return [
    ...root,
    ...periodSteps(Number(year), Number(month), locale),
    {
      label: target.title,
      path: blogPostPath(target.publishedAt, target.slug),
    },
  ];
}

/**
 * The blog breadcrumb trail — Home › Blog › yyyy › Month › post — built once
 * and rendered twice: as the visible `Breadcrumb` and as `BreadcrumbList`
 * JSON-LD, so the two never disagree.
 */
export function buildBlogBreadcrumbs(
  params: IBlogBreadcrumbsParams,
): IBlogBreadcrumbs {
  const steps = trailSteps(params);
  const lastIndex = steps.length - 1;
  const localeUrl = `${env.siteUrl}/${params.locale}`;

  return {
    visible: steps.map(({ label, path }, index) =>
      index === lastIndex ? { label } : { label, href: path },
    ),
    jsonLd: steps.map(({ label, path }) => ({
      name: label,
      url: path === '/' ? localeUrl : `${localeUrl}${path}`,
    })),
  };
}
