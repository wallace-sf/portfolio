'use client';

import { FC } from 'react';

import { screens } from '@repo/tailwind-config/screens';
import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { useBreakpoint } from '~/hooks';
import { OpenSourceBadge } from '~features/shared/OpenSourceBadge';
import { ShareButton } from '~features/shared/ShareButton';
import { SkillGroup } from '~features/shared/SkillGroup';

export interface IProjectCardProps {
  slug: string;
  title: string;
  caption: string;
  thumbnailImage: { url: string; alt: string };
  theme?: string;
  skills: { name: string; icon: string }[];
  repositoryUrl?: string;
  compact?: boolean;
}

export const ProjectCard: FC<IProjectCardProps> = ({
  slug,
  title,
  caption,
  thumbnailImage,
  theme,
  compact = false,
  skills,
  repositoryUrl,
}) => {
  const t = useTranslations('ProjectCard');
  const locale = useLocale();
  const isLG = useBreakpoint('lg');

  return (
    <article
      className={classNames(
        'relative flex flex-col bg-surface rounded-xl overflow-hidden shadow-drop-sm',
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
          src={thumbnailImage.url}
          fill
          alt={thumbnailImage.alt}
          className="object-cover"
          sizes={`(min-width: ${screens.lg}) 380px, calc(100vw - 3rem)`}
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
        <div className="flex flex-1 flex-col gap-4">
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

          <div className="min-h-16 flex flex-wrap items-center gap-x-2 gap-y-2">
            <h3 className="line-clamp-2 text-2xl font-bold text-content-primary">
              {title}
            </h3>
            {repositoryUrl && <OpenSourceBadge repositoryUrl={repositoryUrl} />}
          </div>

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

          <Button.Link
            component={Link}
            href={`/${locale}/projects/${slug}`}
            className="flex flex-row items-center justify-center gap-2"
          >
            {t('view_project')}
            <Icon icon="ic:round-arrow-forward" className="text-xl" />
          </Button.Link>
        </div>
      </div>
    </article>
  );
};
