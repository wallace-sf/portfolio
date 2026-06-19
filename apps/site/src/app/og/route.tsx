import { DEFAULT_LOCALE } from '@repo/core';
import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

import { SITE_URL } from '~/lib/og';

export const runtime = 'edge';

const SIZE = { width: 1200, height: 630 };
const siteHost = new URL(SITE_URL).host;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'Wallace Ferreira';
  const subtitle = searchParams.get('subtitle') ?? '';
  const locale = searchParams.get('locale') ?? DEFAULT_LOCALE;
  const page = searchParams.get('page') ?? '';
  const jobTitle =
    searchParams.get('jobTitle') ?? 'Front-end Software Engineer';

  return new ImageResponse(
    <div
      tw="flex flex-col justify-between w-full h-full relative p-[72px] text-[#F8FAFC] font-[Arial]"
      style={{
        background:
          'linear-gradient(135deg, #070B12 0%, #0E1622 60%, #10251C 100%)',
      }}
    >
      {/* Watermark W */}
      <div tw="absolute flex -right-[60px] top-[80px] text-[420px] font-extrabold leading-none text-[#5CD66E]/10">
        W
      </div>

      {/* Header */}
      <div tw="flex items-center justify-between">
        <div tw="flex items-center gap-6">
          <div tw="flex text-[54px] font-extrabold text-[#5CD66E]">W</div>
          <div tw="flex flex-col">
            <div tw="flex text-[28px] font-semibold">Wallace Ferreira</div>
            <div tw="flex text-[22px] text-[#94A3B8]">{jobTitle}</div>
          </div>
        </div>
        {locale && (
          <div tw="flex rounded-full px-[22px] py-[10px] text-[22px] font-extrabold bg-[#5CD66E] text-[#070B12]">
            {locale}
          </div>
        )}
      </div>

      {/* Main content */}
      <div tw="flex flex-col">
        <div tw="flex text-[64px] font-extrabold max-w-[760px] leading-[1.05] tracking-[-0.04em]">
          {title}
        </div>
        <div tw="flex w-[150px] h-[6px] bg-[#5CD66E] rounded-full mt-6 mb-8" />
        {subtitle && (
          <div tw="flex text-[30px] text-[#CBD5E1] max-w-[760px] leading-[1.3]">
            {subtitle}
          </div>
        )}
      </div>

      {/* Footer */}
      <div tw="flex items-center justify-between">
        <div tw="flex text-[18px] text-[#475569]">{siteHost}</div>
        {page && (
          <div tw="flex text-[28px] font-extrabold tracking-[0.1em] text-[#5CD66E]/50">
            {page}
          </div>
        )}
      </div>
    </div>,
    SIZE,
  );
}
