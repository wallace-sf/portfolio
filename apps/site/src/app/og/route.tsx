import { DEFAULT_LOCALE } from '@repo/core';
import type { Locale } from '@repo/core/shared';
import { OG_IMAGE_SIZE, renderOgImage } from '@repo/seo/renderOgImage';
import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

import { env } from '~/config/env';

export const runtime = 'edge';

const siteHost = new URL(env.siteUrl).host;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'Wallace Ferreira';
  const subtitle = searchParams.get('subtitle') ?? '';
  const locale = (searchParams.get('locale') ?? DEFAULT_LOCALE) as Locale;
  const page = searchParams.get('page') ?? '';
  const jobTitle =
    searchParams.get('jobTitle') ?? 'Front-end Software Engineer';

  return new ImageResponse(
    renderOgImage({ title, subtitle, locale, page, jobTitle, siteHost }),
    OG_IMAGE_SIZE,
  );
}
