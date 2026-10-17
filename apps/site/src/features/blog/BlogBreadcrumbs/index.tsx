import { buildBreadcrumbListJsonLd } from '@repo/seo';
import { getTranslations } from 'next-intl/server';

import { JsonLd } from '~components';
import {
  type BlogBreadcrumbsTarget,
  buildBlogBreadcrumbs,
} from '~features/blog/buildBlogBreadcrumbs';
import { Breadcrumb } from '~features/shared/Breadcrumb';

export interface IBlogBreadcrumbsProps {
  locale: string;
  target: BlogBreadcrumbsTarget;
}

/** The visible blog breadcrumb plus its matching `BreadcrumbList` JSON-LD. */
export async function BlogBreadcrumbs({
  locale,
  target,
}: IBlogBreadcrumbsProps) {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const { visible, jsonLd } = buildBlogBreadcrumbs({
    locale,
    labels: {
      home: t('breadcrumbHome'),
      blog: t('title'),
      tags: t('tags'),
    },
    target,
  });
  // A Server Component renders once — no re-render for a fresh object to defeat.
  // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
  const breadcrumbListJsonLd = {
    '@context': 'https://schema.org',
    ...buildBreadcrumbListJsonLd(jsonLd),
  };

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd} />
      <Breadcrumb items={visible} />
    </>
  );
}
