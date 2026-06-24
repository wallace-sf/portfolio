'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';

interface IOpenSourceBadgeProps {
  repositoryUrl: string;
}

export const OpenSourceBadge: FC<IOpenSourceBadgeProps> = ({
  repositoryUrl,
}) => {
  const t = useTranslations('Common');

  return (
    <a
      href={repositoryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-x-1.5 rounded-full border border-content-muted/30 px-3 py-1 text-sm text-content-muted transition-colors hover:border-content-muted hover:text-content-primary"
    >
      <Icon icon="mdi:github" className="text-base" />
      {t('open_source_label')}
    </a>
  );
};
