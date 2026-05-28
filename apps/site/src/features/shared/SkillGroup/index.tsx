'use client';

import { FC, useMemo, useState } from 'react';

import { Badge } from '@repo/ui/View';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export type SkillSummary = { name: string; icon: string };

interface ISkillGroupProps {
  max: number;
  total: number;
  skills: SkillSummary[];
  initializeWithMax: number;
  onShowAll?: () => void;
}

export const SkillGroup: FC<ISkillGroupProps> = ({
  max,
  skills,
  total,
  initializeWithMax,
  onShowAll,
}) => {
  const [storedMax, setStoredMax] = useState<number>(initializeWithMax);

  const renderedSkills = useMemo(
    () =>
      skills.slice(0, storedMax).map((skill) =>
        skill.icon ? (
          <li key={skill.name}>
            <Badge.WithIcon label={skill.name} icon={skill.icon} />
          </li>
        ) : (
          <li key={skill.name}>
            <Badge.Text label={skill.name} />
          </li>
        ),
      ),
    [skills, storedMax],
  );

  useIsomorphicLayoutEffect(() => {
    setStoredMax(max);
  }, [max]);

  return (
    <ul className="flex flex-row gap-2 flex-wrap">
      {renderedSkills}
      {skills.length > storedMax ? (
        <li>
          {onShowAll ? (
            <button
              type="button"
              onClick={onShowAll}
              className="hover:opacity-80 transition-opacity"
            >
              <Badge.Count count={total - storedMax} />
            </button>
          ) : (
            <Badge.Count count={total - storedMax} />
          )}
        </li>
      ) : null}
    </ul>
  );
};
