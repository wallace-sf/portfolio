import { GetPublishedProjects } from '@repo/application/portfolio';
import { LOCALES } from '@repo/core/shared';
import type { Locale } from '@repo/core/shared';
import { getTranslations } from 'next-intl/server';

import { env } from '~/config/env';
import { getServerContainer } from '~/lib/server/container';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
): Promise<Response> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Feed' });
  const { projectRepository, skillRepository } = getServerContainer();

  const result = await new GetPublishedProjects(
    projectRepository,
    skillRepository,
  ).execute({ locale: locale as Locale });

  const projects = result.isRight() ? result.value : [];

  const description = t('description');

  const items = projects
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${env.siteUrl}/${locale}/projects/${escapeXml(p.slug)}</link>
      <description>${escapeXml(p.caption)}</description>
      <guid isPermaLink="true">${env.siteUrl}/${locale}/projects/${escapeXml(p.slug)}</guid>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wallace Ferreira</title>
    <link>${env.siteUrl}/${locale}</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${env.siteUrl}/${locale}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
