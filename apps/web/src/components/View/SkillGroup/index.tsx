'use client';

import { FC, useMemo } from 'react';

import { ISkillProps } from '@repo/core';

import { Skill } from '../Skill';

interface ISkillGroupProps {
  max: number;
  total: number;
  skills: ISkillProps[];
}

export const SkillGroup: FC<ISkillGroupProps> = ({ max, skills, total }) => {
  const renderedSkills = useMemo(
    () =>
      skills.slice(0, max).map((skill) => <Skill key={skill.id} {...skill} />),
    [skills, max],
  );

  return (
    <ul className="flex flex-row gap-2 flex-wrap">
      {renderedSkills}
      {skills.length > max ? (
        <li className="flex flex-row items-center bg-dark-500 py-1 px-3 gap-x-2.5 rounded-3.75 text-white">
          +{total - max}
        </li>
      ) : null}
    </ul>
  );
};
