'use client';

import { FC } from 'react';

import { ISkillProps } from '@repo/core';
import { Button } from '@repo/ui/Control';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Icon } from '~components/Imagery';
import { useBreakpoint } from '~hooks';

import { SkillGroup } from '../SkillGroup';

export interface IProjectCardProps {
  view: 'grid' | 'row';
  title: string;
  caption: string;
  compact?: boolean;
  skills: ISkillProps[];
}

export const ProjectCard: FC<IProjectCardProps> = ({
  view,
  title,
  caption,
  compact = false,
  skills,
}) => {
  const t = useTranslations('Clipboard');
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
            src="https://cdn.pixabay.com/photo/2024/10/16/06/03/ai-generated-9123876_1280.jpg"
            fill
            alt="Imagem do projeto"
            className="object-cover"
            sizes="100%"
            priority
          />
        </header>
        <section className="flex flex-col gap-y-2 flex-grow pr-8">
          <h3 className="text-body-lg !font-bold !text-white line-clamp-1">
            {title}
          </h3>
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
          <Button.Base className="flex flex-row justify-center gap-x-2">
            Ver projeto
            <Icon icon="ic:round-arrow-forward" />
          </Button.Base>
        </footer>
      </section>
      <Button.Clipboard
        text="This is the text copied from project card."
        tooltip={t('copy')}
        className={classNames(
          'absolute z-40 top-5 right-5 flex items-center justify-center w-8 h-8 !p-0 !rounded-lg !bg-dark/80 hover:!bg-dark-200/80 transition-all duration-300',
          {
            'xl:top-3 xl:right-3': view === 'row',
          },
        )}
      >
        {(copied) =>
          copied ? (
            <Icon icon="material-symbols:check" className="text-xl" />
          ) : (
            <Icon icon="material-symbols:share" className="text-xl" />
          )
        }
      </Button.Clipboard>
    </article>
  );
};
