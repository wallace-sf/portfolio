import { type JSX, type ReactNode } from 'react';

export type RadioGroupChildrenFn = (props: {
  name: RadioGroupProps['name'];
  value: RadioGroupProps['value'];
  onChange: RadioGroupProps['onChange'];
}) => ReactNode;

export interface RadioGroupProps {
  containerElementType?: Extract<keyof JSX.IntrinsicElements, string>;
  legend: string | ReactNode;
  children: RadioGroupChildrenFn | null;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface IRadioGroupContext {
  name: RadioGroupProps['name'];
  value: RadioGroupProps['value'];
  onChange: RadioGroupProps['onChange'] | null;
}
