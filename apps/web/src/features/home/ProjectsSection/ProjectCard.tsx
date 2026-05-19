'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { SkillGroup } from '~features/shared/SkillGroup';
import { useBreakpoint } from '~hooks';
import { Link } from '~i18n/routing';

export interface IProjectCardProps {
  view: 'grid' | 'row';
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: { name: string; icon: string }[];
  compact?: boolean;
}

export const ProjectCard: FC<IProjectCardProps> = ({
  view,
  slug,
  title,
  caption,
  coverImage,
  theme,
  compact = false,
  skills,
}) => {
  const t = useTranslations('ProjectCard');
  const isXL = useBreakpoint('xl');

  return (
    <article
      className={classNames(
        'relative bg-surface p-3 rounded-5 w-full h-full max-w-85.75 xl:max-w-116.25',
        {
          'xl:!max-w-237.5 xl:!max-h-84.75': view === 'row',
        },
      )}
    >
      <section
        className={classNames(
          'flex flex-col h-full gap-y-4 rounded-lg overflow-hidden',
          {
            'xl:grid xl:grid-cols-2 xl:auto-rows-max xl:gap-x-9':
              view === 'row',
          },
        )}
      >
        <header
          className={classNames(
            'relative aspect-319/180 h-45 xl:h-61 rounded-b-lg overflow-hidden',
            {
              'xl:aspect-7/5 xl:row-span-2 xl:max-w-110.25 xl:h-auto xl:rounded-tr-lg':
                view === 'row',
            },
          )}
        >
          <Image
            src={coverImage.url}
            fill
            alt={coverImage.alt}
            className="object-cover"
            sizes="100%"
            priority
          />
        </header>
        <section className="flex flex-col gap-y-2 flex-grow pr-8">
          <h3 className="text-body-lg !font-bold !text-content-primary line-clamp-1">
            {title}
          </h3>
          {theme && (
            <span className="text-body-xs !text-content-muted uppercase tracking-wide">
              {theme}
            </span>
          )}
          <p
            className={classNames('text-body-sm !text-content-secondary', {
              'line-clamp-2': compact,
            })}
          >
            {caption}
          </p>
        </section>
        <footer
          className={classNames('flex flex-col gap-y-5', {
            'xl:justify-end': view === 'row',
          })}
        >
          <SkillGroup
            skills={skills}
            max={isXL ? 3 : 2}
            initializeWithMax={2}
            total={skills.length}
          />
          <Link
            href={`/projects/${slug}`}
            className="flex flex-row justify-center gap-x-2 items-center bg-primary text-body-sm !text-white !font-bold rounded-xl hover:bg-blue-dark transition-all duration-300 py-3 px-6"
          >
            {t('view_project')}
            <Icon icon="ic:round-arrow-forward" />
          </Link>
        </footer>
      </section>
    </article>
  );
};
