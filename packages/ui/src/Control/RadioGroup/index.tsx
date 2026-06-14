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

  if (isFieldset) {
    return createElement(
      containerElementType,
      { className },
      createElement('legend', { className: 'sr-only' }, legend),
      content,
    );
  }

  return createElement(containerElementType, { className }, content);
};

export type {
  RadioGroupProps,
  RadioGroupChildrenFn,
  IRadioGroupContext,
} from './types';
