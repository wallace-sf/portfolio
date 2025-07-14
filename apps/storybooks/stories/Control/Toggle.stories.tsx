import { IButtonBaseProps } from '@repo/ui/Control';
import type { Meta } from '@storybook/react';

const meta: Meta<IButtonBaseProps> = {
  title: 'Design System/Control/Buttons/Toggle',
  tags: ['audocs'],
};
export default meta;

export { ToggleStandard as Standard } from '~compositions';
