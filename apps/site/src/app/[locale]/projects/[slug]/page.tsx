import {
  GetProjectBySlug,
  GetPublishedProjects,
} from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE } from '~/i18n/routing';
import { buildOgImageUrl } from '~/lib/og';
import { buildAlternates } from '~/lib/seo/alternates';
import { buildOpenGraph } from '~/lib/seo/openGraph';
import { buildProjectJsonLd } from '~/lib/seo/structuredData';
import { getServerContainer } from '~/lib/server/container';
import { JsonLd } from '~components';
import { ProjectDetail } from '~features/projects/ProjectDetail';

export async function generateStaticParams() {
  const { projectRepository, skillRepository } = getServerContainer();
  const result = await new GetPublishedProjects(
    projectRepository,
    skillRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  const slugs = result.isRight() ? result.value.map((p) => p.slug) : [];
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const { projectRepository, skillRepository } = getServerContainer();
  const result = await new GetProjectBySlug(
    projectRepository,
    skillRepository,
  ).execute({ locale: locale as Locale, slug });

  if (result.isLeft()) return {};

  const { title, caption } = result.value;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title,
    description: caption,
    alternates: buildAlternates(`/projects/${slug}`, locale as Locale),
    openGraph: {
      ...buildOpenGraph(locale as Locale, `/projects/${slug}`, 'article'),
      title,
      description: caption,
      // Generated card rather than the cover: covers are banner art (some
      // are SVG, which social platforms reject, or not 1.91:1).
      images: [
        {
          url: buildOgImageUrl({
            title,
            subtitle: caption,
            locale,
            page: t('ProjectsPage.ogPage'),
            jobTitle: t('OgCard.jobTitle'),
          }),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const { projectRepository, skillRepository } = getServerContainer();
  const result = await new GetProjectBySlug(
    projectRepository,
    skillRepository,
  ).execute({ locale: locale as Locale, slug });

  if (result.isLeft()) notFound();

  const t = await getTranslations({ locale, namespace: 'SideNavigation' });
  const { title, caption, coverImage } = result.value;
  const projectJsonLd = buildProjectJsonLd({
    title,
    caption,
    coverImage,
    slug,
    locale: locale as Locale,
    homeLabel: t('home'),
    projectsLabel: t('projects'),
  });

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <ProjectDetail {...result.value} />
    </>
  );
}
