'use client';

import { FC, useState } from 'react';

import { TextRich } from '@repo/ui/View';
import { Icon } from '@repo/ui/Imagery';

import { TechnologiesModal } from '../TechnologiesModal';

const MAX_VISIBLE_SKILLS = 3;

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

  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS);
  const hiddenCount = skills.length - MAX_VISIBLE_SKILLS;

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
          <ul className="flex flex-row gap-3 flex-wrap">
            {visibleSkills.map((skill) => (
              <li key={skill.name}>
                <span className="inline-flex items-center gap-2 bg-surface-interactive rounded-[15px] px-3 py-1 h-7">
                  {skill.icon && (
                    <Icon icon={skill.icon} className="text-xl min-w-fit" />
                  )}
                  <span className="text-body-xs font-normal text-content-primary">
                    {skill.name}
                  </span>
                </span>
              </li>
            ))}
            {hiddenCount > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center bg-surface-interactive rounded-[15px] px-3 py-1 h-7 text-body-xs font-normal text-content-primary hover:opacity-80 transition-opacity"
                >
                  +{hiddenCount}
                </button>
              </li>
            )}
          </ul>
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
