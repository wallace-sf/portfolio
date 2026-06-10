/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid="icon" data-icon={icon} />
  ),
}));

vi.mock('usehooks-ts', () => ({
  useOnClickOutside: vi.fn(),
  useEventListener: vi.fn(),
}));

async function importModal() {
  const mod = await import('@repo/ui/Control');
  return mod.Modal;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('should render children and title when open', async () => {
    const Modal = await importModal();
    render(
      <Modal open onClose={vi.fn()} closeLabel="Close modal" title="Test Title">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when open is false', async () => {
    const Modal = await importModal();
    render(
      <Modal
        open={false}
        onClose={vi.fn()}
        closeLabel="Close modal"
        title="Test Title"
      >
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const Modal = await importModal();
    render(
      <Modal open onClose={onClose} closeLabel="Close modal" title="Test Title">
        <p>content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render with role dialog and aria-modal when open', async () => {
    const Modal = await importModal();
    render(
      <Modal open onClose={vi.fn()} closeLabel="Close modal" title="Test Title">
        <p>content</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should render title with aria-labelledby linked to dialog', async () => {
    const Modal = await importModal();
    render(
      <Modal
        open
        onClose={vi.fn()}
        closeLabel="Close modal"
        title="Accessible Title"
      >
        <p>content</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleEl = document.getElementById(labelledById!);
    expect(titleEl).toHaveTextContent('Accessible Title');
  });

  it('should omit aria-labelledby when no title is provided', async () => {
    const Modal = await importModal();
    render(
      <Modal open onClose={vi.fn()} closeLabel="Close modal">
        <p>content</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('should render overlay with fixed positioning when open', async () => {
    const Modal = await importModal();
    render(
      <Modal open onClose={vi.fn()} closeLabel="Close modal">
        <p>content</p>
      </Modal>,
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay).toHaveClass('fixed');
  });
});
