'use client';

import { type FC, createElement } from 'react';

import { type RadioGroupProps } from './types';

export const RadioGroup: FC<RadioGroupProps> = ({
  className,
  name,
  value,
  containerElementType = 'fieldset',
  legend,
  onChange,
  children,
}) => {
  const isFieldset = containerElementType === 'fieldset';
  const content =
    children instanceof Function
      ? children({ name, value, onChange })
      : children;

  return createElement(
    containerElementType,
    { className },
    isFieldset
      ? [
          createElement(
            'legend',
            { key: 'legend', className: 'sr-only' },
            legend,
          ),
          content,
        ]
      : content,
  );
};

export type {
  RadioGroupProps,
  RadioGroupChildrenFn,
  IRadioGroupContext,
} from './types';
