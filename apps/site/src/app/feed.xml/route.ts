import { GetPublishedProjects } from '@repo/application/portfolio';

import { DEFAULT_LOCALE } from '~/i18n/routing';
import { getServerContainer } from '~/lib/server/container';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

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
  const result = await new GetPublishedProjects(
    projectRepository,
    skillRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  const projects = result.isRight() ? result.value : [];

  const items = projects
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/${DEFAULT_LOCALE}/projects/${escapeXml(p.slug)}</link>
      <description>${escapeXml(p.caption)}</description>
      <guid isPermaLink="true">${SITE_URL}/${DEFAULT_LOCALE}/projects/${escapeXml(p.slug)}</guid>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wallace Ferreira</title>
    <link>${SITE_URL}</link>
    <description>Frontend Software Engineer — scalable web applications built with React, Next.js, and TypeScript.</description>
    <language>en-US</language>
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
