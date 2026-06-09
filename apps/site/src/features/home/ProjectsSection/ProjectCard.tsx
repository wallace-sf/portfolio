'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';

import { useBreakpoint } from '~/hooks';
import { ShareButton } from '~features/shared/ShareButton';
import { SkillGroup } from '~features/shared/SkillGroup';
import { Link } from '~i18n/routing';

export interface IProjectCardProps {
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: { name: string; icon: string }[];
  compact?: boolean;
}

export const ProjectCard: FC<IProjectCardProps> = ({
  slug,
  title,
  caption,
  coverImage,
  theme,
  compact: _compact = false,
  skills,
}) => {
  const t = useTranslations('ProjectCard');
  const locale = useLocale();
  const isXL = useBreakpoint('xl');

  return (
    <article className="relative flex flex-col bg-surface rounded-xl overflow-hidden xl:flex-row xl:w-full xl:h-[339px]">
      <div className="relative h-[244px] mx-3 mt-3 rounded-lg overflow-hidden xl:w-[380px] xl:h-auto xl:shrink-0 xl:m-3">
        <Image
          src={coverImage.url}
          fill
          alt={coverImage.alt}
          className="object-cover"
          sizes="(min-width: 1280px) 380px, 463px"
          priority
        />
      </div>

      <ShareButton
        slug={slug}
        className="absolute top-5 right-5 z-10 xl:top-3 xl:right-3"
      />

      <div className="flex flex-col flex-1 p-4 gap-4 xl:p-6 xl:gap-5">
        <div className="flex flex-col gap-4 flex-1">
          {theme && (
            <span className="text-xs font-bold text-content-muted uppercase tracking-wide xl:text-sm">
              {theme}
            </span>
          )}

          <h3 className="text-2xl font-bold text-content-primary">{title}</h3>

          <p className="text-base font-normal text-content-secondary line-clamp-2 xl:line-clamp-3">
            {caption}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SkillGroup
            skills={skills}
            max={isXL ? 3 : 2}
            initializeWithMax={2}
            total={skills.length}
          />

          <Link
            href={`/projects/${slug}`}
            locale={locale}
            className="flex flex-row justify-center items-center gap-2 bg-brand-primary text-body-sm text-content-primary font-bold rounded-xl hover:bg-brand-primary-hover transition-colors duration-300 py-3 px-6"
          >
            {t('view_project')}
            <Icon icon="ic:round-arrow-forward" className="text-xl" />
          </Link>
        </div>
      </div>
    </article>
  );
};
