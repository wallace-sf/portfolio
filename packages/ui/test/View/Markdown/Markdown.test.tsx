import { render, screen, waitFor } from '@testing-library/react';

import { Markdown } from '~/View/Markdown';

async function renderMarkdown(content: string, className?: string) {
  return render(<>{await Markdown({ content, className })}</>);
}

afterEach(() => {
  delete window.mermaid;
});

describe('Markdown', () => {
  it('should render inside the markdown-body container with the given classes', async () => {
    await renderMarkdown('Some *text*.', 'text-content-disabled');

    const container = screen.getByText('text').closest('.markdown-body');
    expect(container).toHaveClass('text-content-disabled');
  });

  it('should render GFM headings, lists, tables and links when the content is Markdown', async () => {
    await renderMarkdown(
      [
        '## Section',
        '',
        '- first item',
        '- second item',
        '',
        '| Name | Value |',
        '| ---- | ----- |',
        '| slug | kebab |',
        '',
        'Read [the docs](https://example.com/docs).',
      ].join('\n'),
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Section' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('cell', { name: 'kebab' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'the docs' })).toHaveAttribute(
      'href',
      'https://example.com/docs',
    );
  });

  it('should render a mark element when text is wrapped in double equals', async () => {
    const { container } = await renderMarkdown('A ==highlighted== word.');

    expect(container.querySelector('mark')).toHaveTextContent('highlighted');
  });

  it('should highlight fenced code blocks when a language is given', async () => {
    const { container } = await renderMarkdown(
      ['```ts', 'const answer: number = 42;', '```'].join('\n'),
    );

    const figure = container.querySelector(
      'figure[data-rehype-pretty-code-figure]',
    );
    expect(figure?.querySelector('code[data-language="ts"]')).not.toBeNull();
    expect(figure?.querySelector('span[style]')).not.toBeNull();
  });

  it('should emit both the light and dark palettes when a fenced block is highlighted', async () => {
    const { container } = await renderMarkdown(
      ['```ts', 'const answer = 42;', '```'].join('\n'),
    );

    const pre = container.querySelector<HTMLElement>(
      'figure[data-rehype-pretty-code-figure] pre',
    );
    const token = pre?.querySelector<HTMLElement>('[data-line] span[style]');
    expect(pre?.style.getPropertyValue('--shiki-light-bg')).not.toBe('');
    expect(pre?.style.getPropertyValue('--shiki-dark-bg')).not.toBe('');
    expect(token?.style.getPropertyValue('--shiki-light')).not.toBe('');
    expect(token?.style.getPropertyValue('--shiki-dark')).not.toBe('');
  });

  it('should mark added and removed lines when the fence uses diff notation', async () => {
    const { container } = await renderMarkdown(
      [
        '```ts',
        'const kept = 1;',
        'const added = 2; // [!code ++]',
        'const removed = 3; // [!code --]',
        '```',
      ].join('\n'),
    );

    const lines = [...container.querySelectorAll('[data-line]')];
    expect(lines.map((line) => line.className)).toEqual([
      '',
      'diff add',
      'diff remove',
    ]);
    expect(container.textContent).not.toContain('[!code');
  });

  it('should mark highlighted lines when the fence meta lists line numbers', async () => {
    const { container } = await renderMarkdown(
      ['```ts {2}', 'const a = 1;', 'const b = 2;', '```'].join('\n'),
    );

    const lines = [...container.querySelectorAll('[data-line]')];
    expect(
      lines.map((line) => line.hasAttribute('data-highlighted-line')),
    ).toEqual([false, true]);
  });

  it('should render a mermaid diagram instead of a highlighted block when the fence is mermaid', async () => {
    const render = vi.fn(async () => ({
      svg: '<svg data-testid="diagram"></svg>',
    }));
    window.mermaid = { initialize: vi.fn(), render };

    const { container } = await renderMarkdown(
      ['```mermaid', 'graph TD; A-->B', '```'].join('\n'),
    );

    expect(await screen.findByTestId('diagram')).toBeInTheDocument();
    expect(
      screen.getByTestId('diagram').closest('pre > [data-mermaid]'),
    ).toBeInTheDocument();
    expect(render).toHaveBeenCalledWith(expect.any(String), 'graph TD; A-->B');
    expect(
      container.querySelector('figure[data-rehype-pretty-code-figure]'),
    ).toBeNull();
  });

  it('should not render raw HTML when the content contains a script tag', async () => {
    const { container } = await renderMarkdown(
      'Before\n\n<script>alert("x")</script>\n\nAfter',
    );

    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('should render a lazy, zoomable image when the content has an image', async () => {
    await renderMarkdown('![A figure](https://example.com/figure.webp)');

    const image = screen.getByRole('img', { name: 'A figure' });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(image.closest('button')).toHaveAccessibleName(
      'A figure Open larger view',
    );
  });

  it('should use the given labels for the zoom hint when imageLabels is set', async () => {
    render(
      <>
        {await Markdown({
          content: '![Uma figura](https://example.com/figure.webp)',
          imageLabels: { zoom: 'Ampliar imagem', close: 'Fechar' },
        })}
      </>,
    );

    expect(
      screen.getByRole('button', { name: 'Uma figura Ampliar imagem' }),
    ).toBeInTheDocument();
  });

  it('should keep a linked image a plain link when the image is inside a link', async () => {
    await renderMarkdown(
      '[![A badge](https://example.com/badge.svg)](https://example.com)',
    );

    expect(screen.getByRole('link', { name: 'A badge' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should drop the href when a link uses the javascript: protocol', async () => {
    await renderMarkdown('[click me](javascript:alert(1))');

    expect(screen.getByText('click me')).not.toHaveAttribute('href');
  });

  it('should render angle brackets and braces as text when the prose contains them', async () => {
    await renderMarkdown('Use Either<L, R> when { errors } are values.');

    await waitFor(() =>
      expect(
        screen.getByText('Use Either<L, R> when { errors } are values.'),
      ).toBeInTheDocument(),
    );
  });

  it('should give h2 and h3 slug ids when the content has headings', async () => {
    await renderMarkdown(
      ['## Why Either?', '', '### The `Left` side'].join('\n'),
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute(
      'id',
      'why-either',
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute(
      'id',
      'the-left-side',
    );
  });

  it('should link each h2 and h3 to its own id when the content has headings', async () => {
    await renderMarkdown(
      ['## Why Either?', '', '### The `Left` side'].join('\n'),
    );

    expect(screen.getByRole('link', { name: 'Why Either?' })).toHaveAttribute(
      'href',
      '#why-either',
    );
    expect(screen.getByRole('link', { name: 'The Left side' })).toHaveAttribute(
      'href',
      '#the-left-side',
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Why Either?' }),
    ).toBeInTheDocument();
  });

  it('should not link headings deeper than h3 when the content has them', async () => {
    await renderMarkdown('#### Fine print');

    expect(
      screen.getByRole('heading', { level: 4, name: 'Fine print' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should suffix the id when two headings share the same text', async () => {
    await renderMarkdown(['## Usage', '', '## Usage'].join('\n'));

    expect(
      screen.getAllByRole('heading', { level: 2 }).map(({ id }) => id),
    ).toEqual(['usage', 'usage-1']);
  });
});
