import { Text, ITextProps } from '@repo/ui/Control';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<ITextProps> = {
  title: 'Design System/Control/Text',
  component: Text.Base,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<ITextProps>;

export const Standard: Story = {
  name: 'Standard',
  args: {},
};
