import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';

interface IStatCardProps {
  label: string;
  value: string;
  icon: string;
}

export const StatCard: FC<IStatCardProps> = ({ label, value, icon }) => {
  return (
    <article className="flex flex-row items-center gap-4 bg-surface rounded-xl w-full h-[152px] px-4">
      <div className="flex items-center justify-center w-[72px] h-[72px] shrink-0">
        <Icon icon={icon} className="text-[54px] text-brand-accent" />
      </div>
      <div className="flex flex-col gap-1 pb-2.5">
        <span className="text-4xl font-bold text-content-primary leading-[50.4px]">
          {value}
        </span>
        <span className="text-lg font-normal text-content-primary leading-[25.2px] pl-5">
          {label}
        </span>
      </div>
    </article>
  );
};
