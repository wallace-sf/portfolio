import { TextArea, ITextAreaProps } from '@repo/ui/Control';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<ITextAreaProps> = {
  title: 'Design System/Control/TextArea',
  component: TextArea.Base,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<ITextAreaProps>;

export const Standard: Story = {
  name: 'Standard',
  args: {},
};
