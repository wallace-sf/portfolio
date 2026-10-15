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
});
