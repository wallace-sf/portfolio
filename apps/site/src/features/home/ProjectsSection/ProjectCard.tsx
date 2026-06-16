'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { screens } from '@repo/tailwind-config/screens';
import classNames from 'classnames';
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
  compact = false,
  skills,
}) => {
  const t = useTranslations('ProjectCard');
  const locale = useLocale();
  const isLG = useBreakpoint('lg');

  return (
    <article
      className={classNames(
        'relative flex flex-col bg-surface rounded-xl overflow-hidden',
        !compact && 'lg:flex-row lg:w-full lg:h-[339px]',
      )}
    >
      <div
        className={classNames(
          'relative h-[244px] mx-3 mt-3 rounded-lg overflow-hidden',
          !compact && 'lg:w-[380px] lg:h-auto lg:shrink-0 lg:m-3',
        )}
      >
        <Image
          src={coverImage.url}
          fill
          alt={coverImage.alt}
          className="object-cover"
          sizes={`(min-width: ${screens.lg}) 380px, 463px`}
          priority
        />
      </div>

      <ShareButton
        slug={slug}
        className={classNames(
          'absolute top-5 right-5 z-10',
          !compact && 'lg:top-3 lg:right-3',
        )}
      />

      <div
        className={classNames(
          'flex flex-col flex-1 p-4 gap-4',
          !compact && 'lg:p-6 lg:gap-5',
        )}
      >
        <div className="flex flex-col gap-4 flex-1">
          {theme && (
            <span
              className={classNames(
                'text-xs font-bold text-content-muted uppercase tracking-wide',
                !compact && 'lg:text-sm',
              )}
            >
              {theme}
            </span>
          )}

          <h3 className="text-2xl font-bold text-content-primary">{title}</h3>

          <p
            className={classNames(
              'text-base font-normal text-content-secondary line-clamp-2',
              !compact && 'lg:line-clamp-3',
            )}
          >
            {caption}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SkillGroup
            skills={skills}
            max={!compact && isLG ? 3 : 2}
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
