import { IButtonBaseProps } from '@repo/ui/Control';
import type { Meta } from '@storybook/react';

const meta: Meta<IButtonBaseProps> = {
  title: 'Design System/Control/Accordion',
  tags: ['audocs'],
};
export default meta;

export { AccordionStandard as Standard } from '~compositions';
