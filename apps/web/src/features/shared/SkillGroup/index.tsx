'use client';

import { FC, useMemo, useState } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export type SkillSummary = { name: string; icon: string };

interface ISkillGroupProps {
  max: number;
  total: number;
  skills: SkillSummary[];
  initializeWithMax: number;
}

export const SkillGroup: FC<ISkillGroupProps> = ({
  max,
  skills,
  total,
  initializeWithMax,
}) => {
  const [storedMax, setStoredMax] = useState<number>(initializeWithMax);

  const renderedSkills = useMemo(
    () =>
      skills.slice(0, storedMax).map((skill) => (
        <li
          key={skill.name}
          className="flex flex-row items-center bg-surface-raised py-1 px-3 gap-x-2 rounded-3.75 text-body-xs !text-content-primary"
        >
          {skill.icon && (
            <Icon icon={skill.icon} className="text-base min-w-fit" />
          )}
          <span>{skill.name}</span>
        </li>
      )),
    [skills, storedMax],
  );

  useIsomorphicLayoutEffect(() => {
    setStoredMax(max);
  }, [max]);

  return (
    <ul className="flex flex-row gap-2 flex-wrap">
      {renderedSkills}
      {skills.length > storedMax ? (
        <li className="flex flex-row items-center bg-surface-raised py-1 px-3 gap-x-2.5 rounded-3.75 text-content-primary">
          +{total - storedMax}
        </li>
      ) : null}
    </ul>
  );
};
