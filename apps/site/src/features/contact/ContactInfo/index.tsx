'use client';

import { FC } from 'react';

import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { Divider } from '@repo/ui/View';
import { formatCellphone } from '@repo/utils';
import { useLocale, useTranslations } from 'next-intl';

import { MenuItem } from '~/components/Layout/SideNavigation/MenuItem';
import { env } from '~/config/env';

export const ContactInfo: FC = () => {
  const t = useTranslations('ContactInfo');
  const tClip = useTranslations('Clipboard');
  const locale = useLocale();
  const whatsappUrl = `https://wa.me/${env.contactNumber}?text=${encodeURIComponent(t('whatsappMessage'))}`;

  return (
    <section className="flex flex-col gap-y-6 xl:w-[326px]">
      <h2 className="text-2xl font-bold text-content-primary">{t('title')}</h2>

      <address className="flex flex-col gap-y-6 not-italic">
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <Icon
              icon="ic:baseline-email"
              className="text-2xl text-content-secondary"
            />
            <strong className="text-base font-bold text-content-primary">
              {t('email')}
            </strong>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-base text-content-secondary">
              {env.contactEmail}
            </span>
            <Button.Clipboard
              text={env.contactEmail ?? ''}
              tooltip={tClip('copy')}
              aria-label={tClip('copy')}
              unstyled
            >
              <Icon
                icon="material-symbols:content-copy"
                className="text-2xl text-content-secondary"
              />
            </Button.Clipboard>
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <Icon
              icon="ic:baseline-whatsapp"
              className="text-2xl text-content-secondary"
            />
            <strong className="text-base font-bold text-content-primary">
              WhatsApp
            </strong>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-base text-content-secondary">
              {formatCellphone(env.contactNumber)}
            </span>
            <Button.Clipboard
              text={env.contactNumber ?? ''}
              tooltip={tClip('copy')}
              aria-label={tClip('copy')}
              unstyled
            >
              <Icon
                icon="material-symbols:content-copy"
                className="text-2xl text-content-secondary"
              />
            </Button.Clipboard>
          </div>
        </div>
      </address>

      <Divider className="!my-0 border-b-2" />

      <p className="text-base text-content-primary">{t('paragraph1')}</p>
      <p className="text-base text-content-primary">{t('paragraph2')}</p>

      <nav className="flex gap-x-3">
        <MenuItem.Item2.ShortLink
          href={whatsappUrl}
          icon="logos:whatsapp-icon"
          aria-label={t('whatsapp')}
          newTab
        />
        <MenuItem.Item2.ShortLink
          href={env.linkedinUrl}
          icon="devicon:linkedin"
          aria-label={t('linkedin')}
          newTab
        />
        <MenuItem.Item2.ShortLink
          href={env.githubUrl}
          icon="mdi:github"
          iconClassName="text-content-primary"
          aria-label={t('github')}
          newTab
        />
        <MenuItem.Item2.ShortLink
          href={`/${locale}/feed.xml`}
          icon="mdi:rss"
          iconClassName="text-content-primary"
          aria-label={t('rss')}
          newTab
        />
      </nav>
    </section>
  );
};
