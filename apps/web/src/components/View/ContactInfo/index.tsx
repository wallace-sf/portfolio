'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { Divider } from '@repo/ui/View';
import { formatCellphone } from '@repo/utils';
import { useTranslations } from 'next-intl';

import { Link } from '~i18n/routing';

import { MenuItem } from '../MenuItem';

export const ContactInfo: FC = () => {
  const t = useTranslations('ContactInfo');

  return (
    <section className="flex flex-col gap-y-6 bg-dark-300 px-4 py-6 rounded-xl">
      <address>
        <strong className="inline-block w-full text-body-base !text-white !font-bold not-italic mb-2">
          {t('email')}
        </strong>
        <Link
          className="inline-block w-full text-body-sm !text-primary !underline not-italic mb-6"
          href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
        >
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
        </Link>
        <strong className="inline-block w-full text-body-base !text-white !font-bold not-italic mb-2">
          WhatsApp
        </strong>
        <Link
          className="flex flex-row items-center gap-x-2 w-full text-body-sm !text-primary !underline not-italic"
          href={process.env.NEXT_PUBLIC_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon="twemoji:flag-brazil" />
          {formatCellphone(process.env.NEXT_PUBLIC_CONTACT_NUMBER)}
        </Link>
      </address>
      <Divider className="!my-0" />
      <p className="text-body-sm !text-white">{t('paragraph1')}</p>
      <p className="text-body-sm !text-white">{t('paragraph2')}</p>
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
