'use client';

import { FC } from 'react';

import { ISkillProps } from '@repo/core';
import { Icon } from '@repo/ui/Imagery';

export const Skill: FC<ISkillProps> = ({ icon, description }) => {
  return (
    <li
      className="flex flex-row items-center bg-dark-500 py-1 px-3 gap-x-2 rounded-3.75"
      title={description}
    >
      <Icon icon={icon} className="text-xl min-w-fit" />
      <span className="text-body-xs !text-white">{description}</span>
    </li>
  );
};
