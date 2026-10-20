import { fireEvent, render, screen } from '@testing-library/react';

import { ZoomableImage } from '~/View/ZoomableImage';

// jsdom has no modal dialog API: a minimal stand-in for the parts we use.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

const IMAGE = {
  src: 'https://example.com/figure.webp',
  alt: 'Lighthouse report',
  loading: 'lazy' as const,
  decoding: 'async' as const,
};

const dialog = () => document.querySelector('dialog')!;

describe('ZoomableImage', () => {
  it('should render the inline image with its lazy-loading hints when mounted', () => {
    render(<ZoomableImage {...IMAGE} />);

    const image = screen.getByRole('img', { name: 'Lighthouse report' });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('should name the trigger after the image and the zoom hint when labels are given', () => {
    render(
      <ZoomableImage
        {...IMAGE}
        labels={{ zoom: 'Ampliar imagem', close: 'Fechar' }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Lighthouse report Ampliar imagem' }),
    ).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('should open the full-size image with the alt text as caption when the image is clicked', () => {
    render(<ZoomableImage {...IMAGE} />);

    fireEvent.click(screen.getByRole('button', { name: /Open larger view/ }));

    expect(dialog()).toHaveAttribute('open');
    expect(dialog().querySelector('img')).toHaveAttribute('src', IMAGE.src);
    expect(dialog().querySelector('figcaption')).toHaveTextContent(
      'Lighthouse report',
    );
  });

  it('should close and return focus to the image when the close button is clicked', () => {
    render(<ZoomableImage {...IMAGE} />);
    const trigger = screen.getByRole('button', { name: /Open larger view/ });

    fireEvent.click(trigger);
    fireEvent.click(
      screen.getByRole('button', { name: 'Close', hidden: true }),
    );

    expect(dialog()).not.toHaveAttribute('open');
    expect(trigger).toHaveFocus();
  });

  it('should close when the backdrop is clicked but not when the figure is', () => {
    render(<ZoomableImage {...IMAGE} />);
    fireEvent.click(screen.getByRole('button', { name: /Open larger view/ }));

    fireEvent.click(dialog().querySelector('figure')!);
    expect(dialog()).toHaveAttribute('open');

    fireEvent.click(dialog());
    expect(dialog()).not.toHaveAttribute('open');
  });
});
