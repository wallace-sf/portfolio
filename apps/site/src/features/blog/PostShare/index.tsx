import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { getTranslations } from 'next-intl/server';

import { env } from '~/config/env';
import { NativeShareButton } from '~features/shared/NativeShareButton';
import { ShareButton } from '~features/shared/ShareButton';
import { shareLinks } from '~features/shared/shareLinks';

export interface IPostShareProps {
  /** Locale-agnostic post path, from `blogPostPath`. */
  path: string;
  title: string;
  locale: string;
}

const ACTION = classNames(
  'flex items-center justify-center w-9 h-9 rounded-lg',
  'bg-surface-raised hover:bg-surface-interactive transition-colors',
);

/**
 * "Share" actions under the post header: copy the link, post it to a social
 * network (the canonical, production URL), or — where supported — open the
 * system share sheet.
 */
export async function PostShare({ path, title, locale }: IPostShareProps) {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const url = `${env.siteUrl}/${locale}${path}`;

  return (
    <div
      role="group"
      aria-label={t('sharePost')}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-body-xs text-content-muted">{t('sharePost')}</span>
      <ShareButton path={path} label={t('copyPostLink')} />
      {shareLinks(url, title).map(({ network, icon, href }) => (
        <a
          key={network}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('shareOn', { network })}
          title={t('shareOn', { network })}
          className={ACTION}
        >
          <Icon icon={icon} className="text-xl text-content-secondary" />
        </a>
      ))}
      <NativeShareButton path={path} title={title} label={t('shareNative')} />
    </div>
  );
}
