import { ButtonBase } from './Base';
import { Clipboard } from './Clipboard';
import { Toggle } from './Toggle';
import { ToggleGroup } from './ToggleGroup';

export const Button = { Base: ButtonBase, Clipboard, Toggle, ToggleGroup };

export { type IButtonBaseProps } from './Base';
export {
  type IButtonClipboardProps,
  type ClipboardChildrenFn,
} from './Clipboard';
export { type IToggleGroupProps } from './ToggleGroup';
export { type IToggleProps } from './Toggle';
