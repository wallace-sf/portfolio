'use client';

import { FC } from 'react';

import { Accordion } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';

interface ISkillAccordionProps {
  skills: string[];
}

export const SkillAccordion: FC<ISkillAccordionProps> = ({ skills }) => {
  const t = useTranslations('ExperienceCard');

  if (!skills.length) return null;

  return (
    <Accordion.Root>
      {({ expanded }) => (
        <>
          <Accordion.Header className="py-2">
            <span className="text-body-xs !text-dark-700">
              {t('skills_label')}
            </span>
            <Icon
              icon="ic:round-keyboard-arrow-down"
              className={`text-dark-700 text-xl transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </Accordion.Header>
          <Accordion.Body>
            <ul className="flex flex-row gap-2 flex-wrap pt-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="flex flex-row items-center bg-dark-500 py-1 px-3 rounded-3.75 text-body-xs !text-white"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </>
      )}
    </Accordion.Root>
  );
};
