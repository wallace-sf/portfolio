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
    <article className="flex size-full flex-col gap-y-4 rounded-xl border border-border-subtle bg-surface/20 px-4 py-6 shadow-drop-sm">
      <Icon
        icon={icon}
        className="flex-shrink-0 !text-[48px] text-brand-accent"
      />
      <TextRich
        className="flex-1 text-base text-content-primary [&_p]:m-0 [&_p]:line-clamp-4 [&_p]:text-base [&_p]:leading-[1.4] [&_p]:text-content-primary [&_strong]:font-bold [&_strong]:text-brand-accent"
        content={content}
      />
    </article>
  );
};
