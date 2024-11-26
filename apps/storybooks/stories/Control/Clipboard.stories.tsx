import { Button, IButtonClipboardProps } from '@repo/ui/Control';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<IButtonClipboardProps> = {
  title: 'Design System/Control/Buttons/Clipboard',
  component: Button.Clipboard,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<IButtonClipboardProps>;

export const Standard: Story = {
  name: 'Standard',
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    tooltip: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    children: 'Clipboard',
  },
};

export const WithDynamicContent: Story = {
  name: 'With Dynamic Content',
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    tooltip: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    children: (copied) => (copied ? 'Copied' : 'Clipboard'),
  },
};
