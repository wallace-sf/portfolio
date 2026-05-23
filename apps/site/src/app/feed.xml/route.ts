import { ApiResponse } from '~/lib/api/envelope';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

interface ProjectItem {
  slug: string;
  title: string;
  caption: string;
  createdAt: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const res = await fetch(`${SITE_URL}/api/v1/projects`, {
    cache: 'no-store',
  }).catch(() => null);

  const projects: ProjectItem[] = [];

  if (res?.ok) {
    const body: ApiResponse<ProjectItem[]> = await res.json();
    if (!body.error) projects.push(...body.data);
  }

  const lastBuildDate =
    projects.length > 0 && projects[0]
      ? new Date(projects[0].createdAt).toUTCString()
      : new Date().toUTCString();

  const items = projects
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/projects/${escapeXml(p.slug)}</link>
      <description>${escapeXml(p.caption)}</description>
      <guid isPermaLink="true">${SITE_URL}/projects/${escapeXml(p.slug)}</guid>
      <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
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
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
