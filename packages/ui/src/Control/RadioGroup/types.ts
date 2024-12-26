import { type ReactHTML, type ReactNode } from 'react';

export type RadioGroupChildrenFn = (props: {
  name: RadioGroupProps['name'];
  value: RadioGroupProps['value'];
  onChange: RadioGroupProps['onChange'];
}) => ReactNode;

export interface RadioGroupProps {
  containerElementType?: keyof ReactHTML;
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
