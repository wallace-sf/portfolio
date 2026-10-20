'use client';

import { FC } from 'react';

import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';

interface IShareButtonProps {
  /** Locale-agnostic path of the page to share, e.g. `/projects/my-app`. */
  path: string;
  /** Accessible name, e.g. "Share project link". */
  label: string;
  className?: string;
}

/** Copies the absolute URL of `path` (in the current locale) to the clipboard. */
export const ShareButton: FC<IShareButtonProps> = ({
  path,
  label,
  className,
}) => {
  const locale = useLocale();
  const t = useTranslations('Share');
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}${path}`;

  return (
    <Button.Clipboard
      unstyled
      text={url}
      tooltip={t('copyLink')}
      aria-label={label}
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
