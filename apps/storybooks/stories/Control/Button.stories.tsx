import { Button, IButtonBaseProps } from '@repo/ui/Control';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<IButtonBaseProps> = {
  title: 'Design System/Control/Buttons/Base',
  component: Button.Base,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<IButtonBaseProps>;

export const Large: Story = {
  name: 'Large',
  args: {
    variant: 'large',
    children: 'Large',
  },
};

export const Small: Story = {
  name: 'Small',
  args: {
    variant: 'small',
    children: 'Small',
  },
};
