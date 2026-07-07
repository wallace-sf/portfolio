'use client';

import { FC } from 'react';

import classNames from 'classnames';

export interface ISectionHeaderProps {
  title: string;
  overline?: string;
  description?: string;
  as?: 'h2' | 'h3' | 'h4';
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: FC<ISectionHeaderProps> = ({
  title,
  overline,
  description,
  as: Tag = 'h2',
  align = 'left',
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col gap-y-2',
        { 'items-center text-center': align === 'center' },
        className,
      )}
    >
      {overline && (
        <span className="text-overline-sm !text-content-muted">{overline}</span>
      )}
      <Tag className="text-body-lg !font-bold !text-content-primary">
        {title}
      </Tag>
      {description && (
        <p className="text-body-sm !text-content-muted">{description}</p>
      )}
    </div>
  );
};
