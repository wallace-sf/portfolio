'use client';

import { FC } from 'react';

import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Link } from '~i18n/routing';
import { useBreakpoint } from '~hooks';

import { SkillGroup } from '../SkillGroup';

export interface IProjectCardProps {
  view: 'grid' | 'row';
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: string[];
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
        'relative bg-dark-300 p-3 rounded-5 w-full h-full max-w-[343px] xl:max-w-[465px]',
        {
          'xl:!max-w-237.5 xl:!max-h-[339px]': view === 'row',
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
            'relative aspect-319/180 h-[180px] xl:h-[244px] rounded-b-lg overflow-hidden',
            {
              'xl:aspect-7/5 xl:row-span-2 xl:max-w-[441px] xl:h-auto xl:rounded-tr-lg':
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
          <h3 className="text-body-lg !font-bold !text-white line-clamp-1">
            {title}
          </h3>
          {theme && (
            <span className="text-body-xs !text-dark-700 uppercase tracking-wide">
              {theme}
            </span>
          )}
          <p
            className={classNames('text-body-sm !text-dark-900', {
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
            className="flex flex-row justify-center gap-x-2 items-center w-full py-2 px-4 rounded-lg bg-dark-600 hover:bg-dark-500 text-white text-body-sm transition-colors"
          >
            {t('view_project')}
          </Link>
        </footer>
      </section>
    </article>
  );
};
