import { type JSX, FC, type ReactNode, createElement, useMemo } from 'react';

import { ToggleGroupProvider } from './context';

export interface IToggleGroupProps {
  as?: Extract<keyof JSX.IntrinsicElements, string>;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onChange: (event: React.MouseEvent<HTMLButtonElement>, value: string) => void;
  value: string;
}

export const ToggleGroup: FC<IToggleGroupProps> = ({
  as = 'div',
  children,
  className,
  disabled,
  onChange,
  value,
}) => {
  const providerValue = useMemo(
    () => ({ value, onChange, disabled }),
    [value, onChange, disabled],
  );

  return createElement(
    as,
    { className },
    <ToggleGroupProvider value={providerValue}>{children}</ToggleGroupProvider>,
  );
};

export { useToggleGroup } from './useToggleGroup';
