'use client';

import { FC } from 'react';

import { IProfessionalValueProps } from '@repo/core';
import { Icon } from '@repo/ui/Imagery';
import { TextRich } from '@repo/ui/View';

export const ProfessionalValue: FC<IProfessionalValueProps> = ({
  icon,
  content,
}) => {
  return (
    <article className="w-full h-full max-w-56 border border-dark-300 px-4 py-6 rounded-xl bg-dark-300/20 flex flex-col gap-y-3">
      <header>
        <Icon icon={icon} className="text-5xl text-accent min-w-fit" />
      </header>
      <TextRich className="text-white line-clamp-4" content={content} />
    </article>
  );
};
