'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { TextRich } from '@repo/ui/View';

export interface IProfessionalValueCardProps {
  id: string;
  icon: string;
  content: string;
}

export const ProfessionalValueCard: FC<IProfessionalValueCardProps> = ({
  icon,
  content,
}) => {
  return (
    <article className="w-full h-full border border-border-subtle bg-surface/20 rounded-xl px-4 py-6 flex flex-col gap-y-4">
      <Icon
        icon={icon}
        className="!text-[48px] text-brand-accent flex-shrink-0"
      />
      <TextRich
        className="text-base text-content-primary flex-1 [&_p]:text-base [&_p]:leading-[1.4] [&_p]:text-content-primary [&_p]:m-0 [&_strong]:text-brand-accent [&_strong]:font-bold [&_p]:line-clamp-4"
        content={content}
      />
    </article>
  );
};
