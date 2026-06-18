import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';

interface IStatCardProps {
  label: string;
  value: string;
  icon: string;
}

export const StatCard: FC<IStatCardProps> = ({ label, value, icon }) => {
  return (
    <article className="flex items-center gap-x-3 border border-border-subtle px-4 py-4 rounded-xl bg-surface/20 shadow-drop-sm">
      <Icon icon={icon} className="text-4xl text-accent shrink-0" />
      <div className="flex flex-col">
        <span className="text-content-primary font-semibold text-lg leading-tight">
          {value}
        </span>
        <span className="text-content-muted text-sm">{label}</span>
      </div>
    </article>
  );
};
