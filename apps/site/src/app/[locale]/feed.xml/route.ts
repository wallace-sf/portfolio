import { GetPublishedProjects } from '@repo/application/portfolio';
import { LOCALES } from '@repo/core/shared';
import type { Locale } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const CHANNEL_DESCRIPTION: Record<string, string> = {
  'en-US':
    'Frontend Software Engineer — scalable web applications built with React, Next.js, and TypeScript.',
  'pt-BR':
    'Engenheiro de Software Frontend — aplicações web escaláveis com React, Next.js e TypeScript.',
  es: 'Ingeniero de Software Frontend — aplicaciones web escalables con React, Next.js y TypeScript.',
};

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
  const { projectRepository, skillRepository } = getServerContainer();

  const result = await new GetPublishedProjects(
    projectRepository,
    skillRepository,
  ).execute({ locale: locale as Locale });

  const projects = result.isRight() ? result.value : [];

  const description =
    CHANNEL_DESCRIPTION[locale] ?? CHANNEL_DESCRIPTION['en-US'] ?? '';

  const items = projects
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/${locale}/projects/${escapeXml(p.slug)}</link>
      <description>${escapeXml(p.caption)}</description>
      <guid isPermaLink="true">${SITE_URL}/${locale}/projects/${escapeXml(p.slug)}</guid>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wallace Ferreira</title>
    <link>${SITE_URL}/${locale}</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/${locale}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
