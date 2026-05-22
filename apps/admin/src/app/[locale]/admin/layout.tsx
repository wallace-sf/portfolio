import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getSiteApiUrl } from '~lib/api/internal';

import { AdminSidebar } from './_components/AdminSidebar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [siteApiUrl, jar] = await Promise.all([
    Promise.resolve(getSiteApiUrl()),
    cookies(),
  ]);
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${siteApiUrl}/api/v1/me`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  }).catch(() => null);

  if (!res?.ok) redirect(`/${locale}/login`);

  return (
    <div className="flex h-screen">
      <AdminSidebar locale={locale} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
