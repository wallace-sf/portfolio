'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { TextRich } from '@repo/ui/View';

export interface IProfessionalValueCardProps {
  id: string;
  icon: string;
  content: string;
}

export const ProfessionalValue: FC<IProfessionalValueCardProps> = ({
  icon,
  content,
}) => {
  return (
    <article className="w-[225px] h-[199px] bg-surface rounded-xl px-4 py-6 flex flex-col gap-y-2.5">
      <Icon icon={icon} className="text-[48px] text-brand-accent min-w-fit" />
      <TextRich
        className="text-base text-content-primary w-[194px]"
        content={content}
      />
    </article>
  );
};
