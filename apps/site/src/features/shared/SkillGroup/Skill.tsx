'use client';

import { FC } from 'react';

import { ISkillProps } from '@repo/core/portfolio';
import { Icon } from '@repo/ui/Imagery';

export const Skill: FC<ISkillProps> = ({ icon, description }) => {
  return (
    <li
      className="flex flex-row items-center gap-x-2 rounded-3.75 bg-surface-raised px-3 py-1"
      title={description}
    >
      <Icon icon={icon} className="min-w-fit text-xl" />
      <span className="text-body-xs !text-content-primary">{description}</span>
    </li>
  );
};
