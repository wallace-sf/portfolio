'use client';

import { FC } from 'react';

import { ISkillProps } from '@repo/core';
import classNames from 'classnames';
import Image from 'next/image';
import { Tooltip } from 'react-tooltip';

import { Button } from '~components/Control';
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
  const isLg = useBreakpoint('lg');

  return (
    <article
      className={classNames(
        'relative bg-dark-300 px-3 pt-3 pb-6 rounded-lg w-full flex flex-col gap-y-4 max-w-[343px]',
        {
          'lg:grid lg:grid-cols-2 lg:auto-rows-max lg:pb-3 lg:gap-x-9 lg:max-w-[950px] lg:max-h-[339px]':
            view === 'row',
        },
      )}
    >
      <header
        className={classNames('relative aspect-319/180 h-[180px]', {
          'lg:aspect-7/5 lg:row-span-2 lg:static lg:max-w-[441px] lg:h-auto':
            view === 'row',
        })}
      >
        <Image
          src="https://cdn.pixabay.com/photo/2017/03/01/09/10/animals-2107902_1280.jpg"
          layout="fill"
          alt="Imagem do projeto"
          className="rounded-lg !w-full !h-full !static"
          objectFit="cover"
        />
        <Button
          className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 !p-0 !rounded-lg !bg-dark/80 hover:!bg-dark-200/80 transition-all duration-300"
          data-tooltip-id="share-project-link"
        >
          <Icon icon="material-symbols:share" className="text-xl" />
        </Button>
        <Tooltip id="share-project-link" place="bottom">
          Clique para copiar
        </Tooltip>
      </header>
      <section className="flex flex-col gap-y-2">
        <h3 className="text-body-lg !font-bold !text-white">{title}</h3>
        <p
          className={classNames('text-body-sm !text-dark-900', {
            'line-clamp-2': compact,
          })}
        >
          {caption}
        </p>
      </section>
      <footer className="flex flex-col gap-y-5">
        <SkillGroup
          skills={skills}
          max={isLg ? 3 : 2}
          initializeWithMax={2}
          total={skills.length}
        />
        <Button className="flex flex-row justify-center gap-x-2">
          Ver projeto
          <Icon icon="ic:round-arrow-forward" />
        </Button>
      </footer>
    </article>
  );
};
