import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NavExpandable } from '~/Control/Nav/Expandable';

describe('NavExpandable', () => {
  it('should render its title', () => {
    render(
      <NavExpandable title="Language" icon="material-symbols:language">
        <p>body</p>
      </NavExpandable>,
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
  });

  it('should toggle the body open and closed when the header is clicked', async () => {
    render(
      <NavExpandable title="Theme">
        <button type="button">Dark</button>
      </NavExpandable>,
    );

    const header = screen.getByRole('button', { name: /Theme/ });
    expect(header).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });
});
