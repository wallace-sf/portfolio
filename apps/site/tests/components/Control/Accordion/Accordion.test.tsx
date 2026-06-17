/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from '@repo/ui/Control';

describe('Accordion', () => {
  function renderAccordion() {
    return render(
      <Accordion.Root>
        <Accordion.Header>Toggle</Accordion.Header>
        <Accordion.Body>Content</Accordion.Body>
      </Accordion.Root>,
    );
  }

  it('should have aria-controls on the button referencing the body panel id', () => {
    renderAccordion();

    const button = screen.getByRole('button', { name: 'Toggle' });
    const panelId = button.getAttribute('aria-controls');

    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toBeInTheDocument();
  });

  it('should generate unique panel ids for each Accordion instance', () => {
    render(
      <>
        <Accordion.Root>
          <Accordion.Header>A</Accordion.Header>
          <Accordion.Body>Content A</Accordion.Body>
        </Accordion.Root>
        <Accordion.Root>
          <Accordion.Header>B</Accordion.Header>
          <Accordion.Body>Content B</Accordion.Body>
        </Accordion.Root>
      </>,
    );

    const [buttonA, buttonB] = screen.getAllByRole('button');
    const id1 = buttonA!.getAttribute('aria-controls');
    const id2 = buttonB!.getAttribute('aria-controls');

    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('should have inert on the panel when collapsed and remove it when expanded', async () => {
    renderAccordion();

    const button = screen.getByRole('button', { name: 'Toggle' });
    const panel = document.getElementById(button.getAttribute('aria-controls')!)!;

    expect(panel).toHaveAttribute('inert');

    await userEvent.click(button);
    expect(panel).not.toHaveAttribute('inert');

    await userEvent.click(button);
    expect(panel).toHaveAttribute('inert');
  });

  it('should toggle aria-expanded when button is clicked', async () => {
    renderAccordion();

    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
