import { GetPublishedProjects } from '@repo/application/portfolio';
import { LOCALES } from '@repo/core/shared';

import { DEFAULT_LOCALE } from '~/i18n/routing';
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

export async function GET(): Promise<Response> {
  const { projectRepository, skillRepository } = getServerContainer();

  const projectsByLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const result = await new GetPublishedProjects(
        projectRepository,
        skillRepository,
      ).execute({ locale });
      return { locale, projects: result.isRight() ? result.value : [] };
    }),
  );

  const items = projectsByLocale
    .flatMap(({ locale, projects }) =>
      projects.map(
        (p) => `
    <item xml:lang="${locale}">
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/${locale}/projects/${escapeXml(p.slug)}</link>
      <description>${escapeXml(p.caption)}</description>
      <guid isPermaLink="true">${SITE_URL}/${locale}/projects/${escapeXml(p.slug)}</guid>
    </item>`,
      ),
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wallace Ferreira</title>
    <link>${SITE_URL}</link>
    <description>${CHANNEL_DESCRIPTION[DEFAULT_LOCALE]}</description>
    <language>${DEFAULT_LOCALE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
