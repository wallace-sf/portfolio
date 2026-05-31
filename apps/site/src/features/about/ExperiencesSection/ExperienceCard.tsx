'use client';

import { FC, useState, useCallback } from 'react';

import { TextRich } from '@repo/ui/View';
import { useScrollLock, useBoolean } from 'usehooks-ts';

import { SkillGroup } from '~features/shared/SkillGroup';

import { TechnologiesModal } from '../TechnologiesModal';

export interface IExperienceCardSkill {
  name: string;
  icon: string;
  description?: string;
}

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
  skills: IExperienceCardSkill[];
}

export const ExperienceCard: FC<IExperienceCardProps> = ({
  company,
  position,
  location,
  description,
  skills,
}) => {
  const { lock, unlock } = useScrollLock({ autoLock: false });
  const { value, setTrue, setFalse } = useBoolean(false);

  const handleShowAll = useCallback(() => {
    setTrue();
    lock();
  }, [lock, setTrue]);

  const handleClose = useCallback(() => {
    setFalse();
    unlock();
  }, [unlock, setFalse]);

  return (
    <>
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

        {skills.length > 0 && (
          <SkillGroup
            skills={skills}
            max={3}
            initializeWithMax={3}
            total={skills.length}
            onShowAll={!value ? handleShowAll : undefined}
          />
        )}
      </article>
      <TechnologiesModal
        open={value}
        onClose={handleClose}
        company={company}
        position={position}
        technologies={skills}
      />
    </>
  );
};
