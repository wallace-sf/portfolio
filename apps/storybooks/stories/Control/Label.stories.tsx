import { Label, ILabelProps } from '@repo/ui/Control';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<ILabelProps> = {
  title: 'Design System/Control/Label',
  component: Label,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<ILabelProps>;

export const Standard: Story = {
  name: 'Standard',
  args: {
    children: 'Lorem ipsum odor amet, consectetuer adipiscing elit.',
  },
};
