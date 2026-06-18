import { ButtonBase } from './Base';
import { Clipboard } from './Clipboard';
import { ButtonLink } from './Link';
import { Toggle } from './Toggle';
import { ToggleGroup } from './ToggleGroup';

export const Button = {
  Base: ButtonBase,
  Link: ButtonLink,
  Clipboard,
  Toggle,
  ToggleGroup,
};

export { type IButtonBaseProps } from './Base';
export { type IButtonLinkProps } from './Link';
export {
  type IButtonClipboardProps,
  type ClipboardChildrenFn,
} from './Clipboard';
export { type IToggleGroupProps } from './ToggleGroup';
export { type IToggleProps } from './Toggle';
export {
  buttonVariants,
  type ButtonVariantsOptions,
  type ButtonSize,
  type ButtonAppearance,
} from './variants';
