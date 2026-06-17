import { LOCALES } from '@repo/core/shared';
import classNames from 'classnames';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';

import { AppLayout } from '~components';

import '@repo/tailwind-config/tailwind.css';
import '@repo/ui/globals.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Wallace Ferreira',
    template: '%s | Wallace Ferreira',
  },
  description:
    'Frontend Software Engineer with 6+ years of experience building scalable, performant, and accessible web products with React, Next.js, and TypeScript.',
  openGraph: {
    type: 'website',
    siteName: 'Wallace Ferreira',
    images: [
      { url: 'https://github.com/wallace-sf.png', alt: 'Wallace Ferreira' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: `${SITE_URL}/feed.xml`, title: 'Wallace Ferreira' },
      ],
    },
  },
};

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

  return (
    <html dir="ltr" lang={locale}>
      <body
        className={classNames(
          'flex flex-col h-screen antialiased dark:bg-dark overflow-x-clip',
          inter.className,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppLayout>{children}</AppLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
