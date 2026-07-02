import { GoogleAnalytics } from '@next/third-parties/google';
import { GetProfile } from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import classNames from 'classnames';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { Inter } from 'next/font/google';

import { env } from '~/config/env';
import { buildAlternates } from '~/lib/seo/alternates';
import { buildPersonJsonLd } from '~/lib/seo/structuredData';
import { getServerContainer } from '~/lib/server/container';
import { AppLayout, JsonLd } from '~components';

import '@repo/tailwind-config/tailwind.css';
import '@repo/ui/globals.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    metadataBase: new URL(env.siteUrl),
    title: {
      default: 'Wallace Ferreira',
      template: '%s | Wallace Ferreira',
    },
    description: t('Layout.description'),
    openGraph: {
      type: 'website',
      siteName: 'Wallace Ferreira',
      images: [
        {
          url: '/og',
          width: 1200,
          height: 630,
          alt: 'Wallace Ferreira',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      ...buildAlternates('', locale as Locale),
      types: {
        'application/rss+xml': [
          {
            url: `${env.siteUrl}/${locale}/feed.xml`,
            title: 'Wallace Ferreira',
          },
        ],
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  const profileResult = await new GetProfile(
    getServerContainer().profileRepository,
  ).execute({ locale: locale as Locale });

  const personJsonLd = profileResult.isRight()
    ? buildPersonJsonLd({
        name: profileResult.value.name,
        headline: profileResult.value.headline,
        photo: profileResult.value.photo,
      })
    : null;

  return (
    <html dir="ltr" lang={locale}>
      <body
        className={classNames(
          'flex flex-col h-screen antialiased bg-surface-base overflow-x-clip',
          inter.className,
        )}
      >
        {personJsonLd && <JsonLd data={personJsonLd} />}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppLayout>{children}</AppLayout>
        </NextIntlClientProvider>
        {env.gaMeasurementId && <GoogleAnalytics gaId={env.gaMeasurementId} />}
      </body>
    </html>
  );
}
