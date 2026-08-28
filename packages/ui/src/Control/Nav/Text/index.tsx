import { FC, ReactNode } from 'react';

import classNames from 'classnames';

interface INavTextProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Label span shared by the `Nav` primitives. Kept local to `Nav/` — it is a
 * plain text node, unrelated to the form-field `Text` primitive.
 */
export const Text: FC<INavTextProps> = ({ children, className }) => {
  return (
    <span
      className={classNames('text-body-sm font-normal line-clamp-1', className)}
    >
      {children}
    </span>
  );
};
