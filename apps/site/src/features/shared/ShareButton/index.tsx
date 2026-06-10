'use client';

import { FC } from 'react';

import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';

interface IShareButtonProps {
  slug: string;
  className?: string;
}

export const ShareButton: FC<IShareButtonProps> = ({ slug, className }) => {
  const locale = useLocale();
  const t = useTranslations('ProjectCard');
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/projects/${slug}`;

  return (
    <Button.Clipboard
      unstyled
      text={url}
      tooltip={t('share_tooltip')}
      aria-label={t('share_button_label')}
      className={classNames(
        'flex items-center justify-center w-9 h-9 rounded-lg',
        'bg-surface-raised hover:bg-surface-interactive transition-colors',
        className,
      )}
    >
      {(copied) => (
        <Icon
          icon={copied ? 'ic:round-check' : 'ic:round-share'}
          className="text-xl text-content-secondary"
        />
      )}
    </Button.Clipboard>
  );
};
