import { createContext } from 'react';

export interface IToggleGroupContext {
  value: string;
  onChange:
    | ((event: React.MouseEvent<HTMLButtonElement>, value: string) => void)
    | null;
  disabled?: boolean;
}

export const ToggleGroupContext = createContext<IToggleGroupContext>({
  value: '',
  onChange: null,
  disabled: false,
});

export const ToggleGroupProvider = ToggleGroupContext.Provider;

ToggleGroupContext.displayName = 'ToggleGroupContext';
