import { Readability } from '@mozilla/readability';
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
  });

  it('should name the trigger after the zoom hint when labels are given', () => {
    render(
      <ZoomableImage
        {...IMAGE}
        labels={{ zoom: 'Ampliar imagem', close: 'Fechar' }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Ampliar imagem' }),
    ).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('should keep every image when a browser reader mode extracts the article', () => {
    const paragraph =
      'A paragraph long enough for the reader mode to treat this as an article. '.repeat(
        4,
      );
    const figure = (n: number) => ({
      ...IMAGE,
      src: `https://example.com/figure-${n}.webp`,
      alt: `Figure ${n}: a long, descriptive alternative text, as real posts have, that describes what the screenshot shows in detail.`,
    });
    render(
      <article>
        <h1>Post title</h1>
        <div className="markdown-body">
          {[1, 2, 3, 4].flatMap((n) => [
            <p key={`text-${n}`}>{paragraph}</p>,
            <p key={`figure-${n}`}>
              <ZoomableImage {...figure(n)} />
            </p>,
          ])}
        </div>
      </article>,
    );

    // Readability (Firefox Reader View) mutates the document it parses.
    const extracted = new Readability(
      document.cloneNode(true) as Document,
    ).parse();
    const content = document.createElement('div');
    content.innerHTML = extracted?.content ?? '';

    expect(content.querySelectorAll('img')).toHaveLength(4);
    expect(content.querySelector('img')).toHaveAttribute('alt', figure(1).alt);
  });

  it('should keep no dialog in the document when the image is not zoomed', () => {
    render(<ZoomableImage {...IMAGE} />);

    expect(document.querySelector('dialog')).toBeNull();
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

  it('should close and return focus to the trigger when the close button is clicked', () => {
    render(<ZoomableImage {...IMAGE} />);
    const trigger = screen.getByRole('button', { name: /Open larger view/ });

    fireEvent.click(trigger);
    fireEvent.click(
      screen.getByRole('button', { name: 'Close', hidden: true }),
    );

    expect(document.querySelector('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('should close when the backdrop is clicked but not when the figure is', () => {
    render(<ZoomableImage {...IMAGE} />);
    fireEvent.click(screen.getByRole('button', { name: /Open larger view/ }));

    fireEvent.click(dialog().querySelector('figure')!);
    expect(dialog()).toHaveAttribute('open');

    fireEvent.click(dialog());
    expect(document.querySelector('dialog')).toBeNull();
  });
});
