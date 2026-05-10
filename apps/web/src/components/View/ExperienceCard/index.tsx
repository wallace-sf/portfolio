'use client';

import { FC } from 'react';

import { IExperienceProps } from '@repo/core/portfolio';
import { TextRich } from '@repo/ui/View';
import { useLocale } from 'next-intl';

import { useBreakpoint } from '~hooks';

import { SkillGroup } from '../SkillGroup';

export const ExperienceCard: FC<IExperienceProps> = ({
  company,
  position,
  description,
}) => {
  const isXL = useBreakpoint('xl');
  const locale = useLocale() as keyof typeof position;
  const skillProps: string[] = [];

  return (
    <article className="flex flex-col py-6 px-3 bg-dark-200 rounded-xl gap-y-3">
      <header className="flex flex-col justify-center gap-y-2">
        <h5 className="text-white line-clamp-2">
          {position[locale] ?? position['en-US']}
        </h5>
        <h6 className="text-dark-700 line-clamp-3">
          {company[locale] ?? company['en-US']}
        </h6>
      </header>
      <TextRich
        className="text-white line-clamp-4"
        content={description[locale] ?? description['en-US']}
      />
      <SkillGroup
        skills={skillProps}
        max={isXL ? 3 : 2}
        initializeWithMax={2}
        total={skillProps.length}
      />
    </article>
  );
};
