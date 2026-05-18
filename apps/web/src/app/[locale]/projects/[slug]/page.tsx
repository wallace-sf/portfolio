import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import {
  ProjectDetail,
  IProjectDetailProps,
} from '~features/projects/ProjectDetail';
import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

type ProjectDetailData = IProjectDetailProps & { id: string };

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const [locale, baseUrl] = await Promise.all([
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const res = await fetch(
    `${baseUrl}/api/v1/projects/${slug}?locale=${locale}`,
    { cache: 'no-store' },
  ).catch(() => null);

  if (!res || res.status === 404 || !res.ok) notFound();

  const body: ApiResponse<ProjectDetailData> = await res.json();
  if (body.error) notFound();

  const project = body.data;

  return <ProjectDetail {...project} />;
}

export async function generateStaticParams() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

  try {
    const res = await fetch(`${baseUrl}/api/v1/projects`, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const body: ApiResponse<{ slug: string }[]> = await res.json();
    if (body.error) return [];
    return body.data.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
