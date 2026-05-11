'use client';

import { FC } from 'react';

import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  locale: string;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({ locale }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/v1/auth/sign-out', { method: 'POST' }).catch(() => null);
    router.push(`/${locale}/login`);
  };

  return (
    <aside className="w-64 bg-dark-300 flex flex-col shrink-0">
      <nav className="flex-1 p-4">
        <a
          href={`/${locale}/admin`}
          className="block text-white py-2 px-4 rounded hover:text-accent"
        >
          Dashboard
        </a>
      </nav>
      <button
        onClick={handleSignOut}
        className="m-4 py-2 px-4 bg-dark-200 text-white rounded hover:text-accent"
      >
        Sign out
      </button>
    </aside>
  );
};
