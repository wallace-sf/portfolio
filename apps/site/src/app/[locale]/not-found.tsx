'use client';

import { useTranslations } from 'next-intl';

import { Link } from '~i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4 text-content-primary">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="text-content-secondary text-center max-w-sm">
        {t('description')}
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-surface text-content-primary rounded-lg font-medium hover:bg-surface-interactive transition-colors"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
