import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';

interface IStatCardProps {
  label: string;
  value: string;
  icon: string;
}

export const StatCard: FC<IStatCardProps> = ({ label, value, icon }) => {
  return (
    <article className="flex items-center gap-x-3 rounded-xl border border-border-subtle bg-surface/20 p-4 shadow-drop-sm">
      <Icon icon={icon} className="shrink-0 text-4xl text-accent" />
      <div className="flex flex-col">
        <span className="text-lg font-semibold leading-tight text-content-primary">
          {value}
        </span>
        <span className="text-sm text-content-muted">{label}</span>
      </div>
    </article>
  );
};
