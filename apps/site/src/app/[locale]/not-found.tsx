'use client';

import { useTranslations } from 'next-intl';

import { Link } from '~i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-y-4 text-content-primary">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="max-w-sm text-center text-content-secondary">
        {t('description')}
      </p>
      <Link
        href="/"
        className="rounded-lg bg-surface px-6 py-2 font-medium text-content-primary transition-colors hover:bg-surface-interactive"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
