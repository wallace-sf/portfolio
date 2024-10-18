'use client';

import { FC, useMemo, useState } from 'react';

import { ISkillProps } from '@repo/core';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

import { Skill } from '../Skill';

interface ISkillGroupProps {
  max: number;
  total: number;
  skills: ISkillProps[];
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
      skills
        .slice(0, storedMax)
        .map((skill) => <Skill key={skill.id} {...skill} />),
    [skills, storedMax],
  );

  useIsomorphicLayoutEffect(() => {
    setStoredMax(max);
  }, [max]);

  return (
    <ul className="flex flex-row gap-2 flex-wrap">
      {renderedSkills}
      {skills.length > storedMax ? (
        <li className="flex flex-row items-center bg-dark-500 py-1 px-3 gap-x-2.5 rounded-3.75 text-white">
          +{total - storedMax}
        </li>
      ) : null}
    </ul>
  );
};
