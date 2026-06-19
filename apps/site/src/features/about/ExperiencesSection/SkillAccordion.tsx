'use client';

import { FC } from 'react';

import { Accordion } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { Badge } from '@repo/ui/View';
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
              className={`text-xl text-content-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </Accordion.Header>
          <Accordion.Body>
            <ul className="flex flex-row flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <li key={skill.name}>
                  {skill.icon ? (
                    <Badge.WithIcon label={skill.name} icon={skill.icon} />
                  ) : (
                    <Badge.Text label={skill.name} />
                  )}
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </>
      )}
    </Accordion.Root>
  );
};
