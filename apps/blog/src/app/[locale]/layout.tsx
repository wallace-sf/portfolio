import { GoogleAnalytics } from '@next/third-parties/google';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';

import { BlogLayout } from '~/components/Layout/BlogLayout';
import { env } from '~/config/env';
import { buildAlternates } from '~/lib/seo/alternates';

import '@repo/tailwind-config/tailwind.css';
import '@repo/ui/globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    // Includes the `/blog` basePath so file-convention metadata URLs
    // (e.g. per-post `opengraph-image`) resolve under the blog zone.
    metadataBase: new URL('/blog', env.siteUrl),
    alternates: buildAlternates('', locale as Locale),
  };
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
    <html lang={locale}>
      <body className={`bg-surface-base antialiased ${inter.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BlogLayout locale={locale as Locale}>{children}</BlogLayout>
        </NextIntlClientProvider>
        {env.gaMeasurementId && <GoogleAnalytics gaId={env.gaMeasurementId} />}
      </body>
    </html>
  );
}
