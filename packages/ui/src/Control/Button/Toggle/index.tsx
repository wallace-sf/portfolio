import { FC, useCallback } from 'react';

import { ButtonBase, IButtonBaseProps } from '../Base';
import { useToggleGroup } from '../ToggleGroup';

export interface IToggleProps
  extends Omit<IButtonBaseProps, 'onClick' | 'value'> {
  value: string;
}

export const Toggle: FC<IToggleProps> = ({ children, ...props }) => {
  const { onChange, value } = useToggleGroup();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (value !== props.value) onChange?.(event, props.value);
    },
    [onChange, props.value, value],
  );

  return (
    <ButtonBase {...props} onClick={handleClick} unstyled>
      {children}
    </ButtonBase>
  );
};
