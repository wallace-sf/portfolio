import { Divider, IDividerProps } from '@repo/ui/View';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<IDividerProps> = {
  title: 'Design System/View/Divider',
  component: Divider,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<IDividerProps>;

export const Standard: Story = {
  name: 'Standard',
  args: {},
};
