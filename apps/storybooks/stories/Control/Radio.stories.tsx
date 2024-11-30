import { Radio, IRadioProps } from '@repo/ui/Control';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<IRadioProps> = {
  title: 'Design System/Control/Radio',
  component: Radio,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<IRadioProps>;

export const Standard: Story = {
  name: 'Standard',
  args: {
    option: 'option-1',
    children: 'Option 1',
    name: 'option-1',
  },
};

export const Checked: Story = {
  name: 'Checked',
  args: {
    option: 'option-1',
    children: 'Option 1',
    name: 'option-1',
    value: 'option-1',
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    option: 'option-1',
    children: 'Option 1',
    name: 'option-1',
    value: 'option-1',
    disabled: true,
  },
};

export const Icon: Story = {
  name: 'Icon',
  args: {
    option: 'storybook',
    children: 'Storybook',
    name: 'storybook',
    value: 'storybook',
    icon: 'devicon:storybook',
  },
};
