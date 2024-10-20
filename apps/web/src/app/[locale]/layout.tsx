import classNames from 'classnames';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';

import { AppLayout } from '~components';

import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={classNames(
          'flex flex-col h-screen antialiased dark:bg-dark',
          inter.className,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <AppLayout>{children}</AppLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
