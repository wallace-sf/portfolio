'use client';

import { FC, useState } from 'react';

import { TextRich } from '@repo/ui/View';

import { SkillGroup } from '~features/shared/SkillGroup';
import { useLayout } from '~hooks';

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
  const [modalOpen, setModalOpen] = useState(false);
  const { close } = useLayout();

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
            onShowAll={() => {
              close?.();
              setModalOpen(true);
            }}
          />
        )}
      </article>

      <TechnologiesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        company={company}
        position={position}
        technologies={skills}
      />
    </>
  );
};
