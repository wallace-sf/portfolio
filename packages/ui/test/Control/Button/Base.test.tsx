import { render, screen } from '@testing-library/react';

import { ButtonBase } from '~/Control/Button/Base';

describe('ButtonBase', () => {
  it('should render its children inside a button when given a label', () => {
    render(<ButtonBase>Click me</ButtonBase>);

    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });
});
