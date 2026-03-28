'use client';

import { FC } from 'react';

import { IExperienceProps, ISkillProps } from '@repo/core/portfolio';
import { TextRich } from '@repo/ui/View';

import { useBreakpoint } from '~hooks';

import { SkillGroup } from '../SkillGroup';

export const ExperienceCard: FC<IExperienceProps> = ({
  company,
  position,
}) => {
  const isXL = useBreakpoint('xl');
  const skillProps: ISkillProps[] = [];

  return (
    <article className="flex flex-col py-6 px-3 bg-dark-200 rounded-xl gap-y-3">
      <header className="flex flex-col justify-center gap-y-2">
        <h5 className="text-white line-clamp-2">{position['pt-BR']}</h5>
        <h6 className="text-dark-700 line-clamp-3">{company['pt-BR']}</h6>
      </header>
      <TextRich
        className="text-white line-clamp-4"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe dolore voluptas ab blanditiis beatae rem unde voluptatem animi error, perspiciatis, ratione quo ullam cupiditate aut illum numquam eos ducimus facere?"
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
