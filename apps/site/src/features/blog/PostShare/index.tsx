import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { getTranslations } from 'next-intl/server';

import { env } from '~/config/env';
import { ShareButton } from '~features/shared/ShareButton';

const LINKEDIN_SHARE_URL = 'https://www.linkedin.com/sharing/share-offsite/';

export interface IPostShareProps {
  /** Locale-agnostic post path, from `blogPostPath`. */
  path: string;
  locale: string;
}

/** The LinkedIn share dialog for the post's canonical (production) URL. */
export const linkedInShareUrl = (path: string, locale: string): string => {
  const url = `${env.siteUrl}/${locale}${path}`;
  return `${LINKEDIN_SHARE_URL}?url=${encodeURIComponent(url)}`;
};

const ACTION = classNames(
  'flex items-center justify-center w-9 h-9 rounded-lg',
  'bg-surface-raised hover:bg-surface-interactive transition-colors',
);

/** "Share" actions under the post header: copy the link, or post to LinkedIn. */
export async function PostShare({ path, locale }: IPostShareProps) {
  const t = await getTranslations({ locale, namespace: 'Blog' });

  return (
    <div
      role="group"
      aria-label={t('sharePost')}
      className="flex items-center gap-2"
    >
      <span className="text-body-xs text-content-muted">{t('sharePost')}</span>
      <ShareButton path={path} label={t('copyPostLink')} />
      <a
        href={linkedInShareUrl(path, locale)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('shareOnLinkedIn')}
        title={t('shareOnLinkedIn')}
        className={ACTION}
      >
        <Icon icon="mdi:linkedin" className="text-xl text-content-secondary" />
      </a>
    </div>
  );
}
