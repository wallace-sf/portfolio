import { ButtonBase } from './Base';
import { Clipboard } from './Clipboard';

export const Button = { Base: ButtonBase, Clipboard };

export { type IButtonBaseProps } from './Base';
export {
  type IButtonClipboardProps,
  type ClipboardChildrenFn,
} from './Clipboard';
