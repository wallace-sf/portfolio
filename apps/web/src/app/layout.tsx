import classNames from 'classnames';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={classNames(
          'flex flex-col h-screen antialiased dark:bg-dark',
          inter.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
