'use client';

import { FC } from 'react';

import { useTranslations } from 'next-intl';

interface ErrorViewProps {
  reset: () => void;
}

export const ErrorView: FC<ErrorViewProps> = ({ reset }) => {
  const t = useTranslations('Error');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-y-4 text-content-primary">
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="max-w-sm text-center text-content-muted">
        {t('description')}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-surface px-6 py-2 font-medium text-content-primary transition-colors hover:bg-surface-interactive"
      >
        {t('retry')}
      </button>
    </div>
  );
};
