'use client';

import { FC, useEffect, useState } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { useLocale } from 'next-intl';

interface INativeShareButtonProps {
  /** Locale-agnostic path of the page to share, e.g. `/blog/2026/10/post`. */
  path: string;
  title: string;
  /** Accessible name, e.g. "More sharing options". */
  label: string;
  className?: string;
}

/**
 * Opens the system share sheet (Web Share API). Renders nothing on the server
 * and where `navigator.share` is missing (most desktop browsers), so markup
 * only appears after mount and hydration stays consistent.
 */
export const NativeShareButton: FC<INativeShareButtonProps> = ({
  path,
  title,
  label,
  className,
}) => {
  const locale = useLocale();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof navigator.share === 'function');
  }, []);

  if (!supported) return null;

  const share = () =>
    // Cancelling the sheet rejects with AbortError; nothing to recover.
    navigator
      .share({ title, url: `${window.location.origin}/${locale}${path}` })
      .catch(() => undefined);

  return (
    <button
      type="button"
      onClick={share}
      aria-label={label}
      title={label}
      className={classNames(
        'flex items-center justify-center w-9 h-9 rounded-lg',
        'bg-surface-raised hover:bg-surface-interactive transition-colors',
        className,
      )}
    >
      <Icon
        icon="ic:round-ios-share"
        className="text-xl text-content-secondary"
      />
    </button>
  );
};
