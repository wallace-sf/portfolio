import { FC, ReactNode } from 'react';

import classNames from 'classnames';

interface ITextProps {
  children?: ReactNode;
  className?: string;
}

export const Text: FC<ITextProps> = ({ children, className }) => {
  return (
    <span
      className={classNames('text-body-sm font-normal line-clamp-1', className)}
    >
      {children}
    </span>
  );
};
