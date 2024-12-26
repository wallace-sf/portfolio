import { useCallback } from 'react';

import { RadioGroup, RadioGroupProps, Radio } from '@repo/ui/Control';
import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<RadioGroupProps> = {
  title: 'Design System/Control/RadioGroup',
  component: RadioGroup,
  tags: ['audocs'],
};
export default meta;

type Story = StoryObj<RadioGroupProps>;

export const Standard: Story = {
  name: 'Standard',
  args: {
    name: 'technology',
    containerElementType: 'ul',
    value: '',
    className: '',
  },
  render: function Render(args) {
    const [_, updateArgs] = useArgs<RadioGroupProps>();

    const onChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        updateArgs({ value: event.target.value });
      },
      [updateArgs],
    );

    return (
      <RadioGroup {...args}>
        {({ name, value }) => (
          <li>
            <Radio
              id="react"
              option="react"
              name={name}
              value={value}
              onChange={onChange}
            >
              React.js
            </Radio>
            <Radio
              id="vue"
              option="vue"
              name={name}
              value={value}
              onChange={onChange}
            >
              Vue
            </Radio>
            <Radio
              id="angular"
              option="angular"
              name={name}
              value={value}
              onChange={onChange}
            >
              Angular
            </Radio>
            <Radio
              id="typescript"
              option="typescript"
              name={name}
              value={value}
              onChange={onChange}
            >
              TypeScript
            </Radio>
          </li>
        )}
      </RadioGroup>
    );
  },
};
