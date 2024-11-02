export type DummyFn = () => void;
export type NoopFunction = (...args: unknown[]) => unknown;

export interface IFieldProps {
  error?: boolean;
  errorBorder?: boolean;
  touched?: boolean;
  unstyled?: boolean;
}
