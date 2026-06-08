'use client';

import { FC } from 'react';

import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { Divider } from '@repo/ui/View';
import { formatCellphone } from '@repo/utils';
import { useTranslations } from 'next-intl';

import { MenuItem } from '~/components/Layout/SideNavigation/MenuItem';

export const ContactInfo: FC = () => {
  const t = useTranslations('ContactInfo');
  const tClip = useTranslations('Clipboard');

  return (
    <section className="flex flex-col gap-y-6 xl:w-[326px]">
      <h2 className="text-2xl font-bold text-content-primary">{t('title')}</h2>

      <address className="flex flex-col gap-y-6 not-italic">
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <Icon
              icon="ic:baseline-email"
              className="text-content-secondary text-2xl"
            />
            <strong className="text-base font-bold text-content-primary">
              {t('email')}
            </strong>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-base text-content-secondary">
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            </span>
            <Button.Clipboard
              text={process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ''}
              tooltip={tClip('copy')}
              unstyled
            >
              <Icon
                icon="material-symbols:content-copy"
                className="text-content-secondary text-2xl"
              />
            </Button.Clipboard>
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <Icon
              icon="ic:baseline-whatsapp"
              className="text-content-secondary text-2xl"
            />
            <strong className="text-base font-bold text-content-primary">
              WhatsApp
            </strong>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-base text-content-secondary">
              {formatCellphone(process.env.NEXT_PUBLIC_CONTACT_NUMBER)}
            </span>
            <Button.Clipboard
              text={process.env.NEXT_PUBLIC_CONTACT_NUMBER ?? ''}
              tooltip={tClip('copy')}
              unstyled
            >
              <Icon
                icon="material-symbols:content-copy"
                className="text-content-secondary text-2xl"
              />
            </Button.Clipboard>
          </div>
        </div>
      </address>

      <Divider className="!my-0 border-b-2" />

      <p className="text-base text-content-primary">{t('paragraph1')}</p>
      <p className="text-base text-content-primary">{t('paragraph2')}</p>

      <nav className="flex flex-col gap-y-3">
        <MenuItem.Item2.Link
          href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
          icon="devicon:linkedin"
          newTab
        >
          Linkedin
        </MenuItem.Item2.Link>
        <MenuItem.Item2.Link
          href={process.env.NEXT_PUBLIC_GITHUB_URL}
          icon="mdi:github"
          iconClassName="text-white"
          newTab
        >
          GitHub
        </MenuItem.Item2.Link>
      </nav>
    </section>
  );
};
