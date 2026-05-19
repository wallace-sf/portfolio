import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getInternalBaseUrl } from '~/lib/api/internal';

import { AdminSidebar } from './_components/AdminSidebar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [baseUrl, jar] = await Promise.all([getInternalBaseUrl(), cookies()]);
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${baseUrl}/api/v1/me`, {
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
