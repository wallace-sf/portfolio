'use client';

import { FC } from 'react';

import { Accordion } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';

interface ISkillAccordionProps {
  skills: { name: string; icon: string }[];
}

export const SkillAccordion: FC<ISkillAccordionProps> = ({ skills }) => {
  const t = useTranslations('ExperienceCard');

  if (!skills.length) return null;

  return (
    <Accordion.Root>
      {({ expanded }) => (
        <>
          <Accordion.Header className="py-2">
            <span className="text-body-xs !text-content-muted">
              {t('skills_label')}
            </span>
            <Icon
              icon="ic:round-keyboard-arrow-down"
              className={`text-content-muted text-xl transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </Accordion.Header>
          <Accordion.Body>
            <ul className="flex flex-row gap-2 flex-wrap pt-2">
              {skills.map((skill) => (
                <li
                  key={skill.name}
                  className="flex flex-row items-center bg-surface-raised py-1 px-3 gap-x-2 rounded-3.75 text-body-xs !text-content-primary"
                >
                  {skill.icon && (
                    <Icon icon={skill.icon} className="text-base min-w-fit" />
                  )}
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </>
      )}
    </Accordion.Root>
  );
};
