import { FC, type ReactNode } from 'react';

import { Icon } from '@repo/ui/Imagery';

export interface IProfessionalValueCardProps {
  id: string;
  icon: string;
  /** The rendered value statement (a server-rendered `Markdown`). */
  children: ReactNode;
}

export const ProfessionalValueCard: FC<IProfessionalValueCardProps> = ({
  icon,
  children,
}) => {
  return (
    <article className="flex size-full flex-col gap-y-4 rounded-xl border border-border-subtle bg-surface/20 px-4 py-6 shadow-drop-sm">
      <Icon
        icon={icon}
        className="flex-shrink-0 !text-[48px] text-brand-accent"
      />
      <div className="markdown-body flex-1 text-base text-content-primary [&_p]:m-0 [&_p]:line-clamp-4 [&_p]:text-base [&_p]:leading-[1.4] [&_p]:text-content-primary [&_strong]:font-bold [&_strong]:text-brand-accent">
        {children}
      </div>
    </article>
  );
};
