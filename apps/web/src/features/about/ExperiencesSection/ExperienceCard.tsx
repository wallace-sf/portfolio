'use client';

import { FC } from 'react';

import { TextRich } from '@repo/ui/View';

import { SkillAccordion } from './SkillAccordion';

export interface IExperienceCardProps {
  id: string;
  company: string;
  position: string;
  location: string;
  description?: string;
  logo?: { url: string; alt: string };
  employmentType: string;
  locationType: string;
  startAt: string;
  endAt?: string;
  skills: string[];
}

export const ExperienceCard: FC<IExperienceCardProps> = ({
  company,
  position,
  location,
  description,
  skills,
}) => {
  return (
    <article className="flex flex-col py-6 px-3 bg-surface-sunken rounded-xl gap-y-3">
      <header className="flex flex-col justify-center gap-y-2">
        <h5 className="text-content-primary line-clamp-2">{position}</h5>
        <h6 className="text-content-muted line-clamp-3">{company}</h6>
        <span className="text-body-xs !text-content-muted">{location}</span>
      </header>
      {description && (
        <TextRich
          className="text-content-primary line-clamp-4"
          content={description}
        />
      )}
      <SkillAccordion skills={skills} />
    </article>
  );
};
