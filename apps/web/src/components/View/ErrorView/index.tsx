'use client';

import { FC } from 'react';

import { useTranslations } from 'next-intl';

interface ErrorViewProps {
  reset: () => void;
}

export const ErrorView: FC<ErrorViewProps> = ({ reset }) => {
  const t = useTranslations('Error');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4 text-white">
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="text-gray-400 text-center max-w-sm">{t('description')}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
      >
        {t('retry')}
      </button>
    </div>
  );
};
