import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostBody } from '~features/blog/PostBody';

async function renderBody(content: string) {
  return render(await PostBody({ content }));
}

describe('PostBody', () => {
  it('should render GFM headings, lists, tables and links when the body is Markdown', async () => {
    await renderBody(
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
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'kebab' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'the docs' })).toHaveAttribute(
      'href',
      'https://example.com/docs',
    );
  });

  it('should highlight fenced code blocks when a language is given', async () => {
    const { container } = await renderBody(
      ['```ts', 'const answer: number = 42;', '```'].join('\n'),
    );

    const figure = container.querySelector(
      'figure[data-rehype-pretty-code-figure]',
    );
    expect(figure).not.toBeNull();
    expect(figure?.querySelector('code[data-language="ts"]')).not.toBeNull();
    expect(figure?.querySelector('span[style]')).not.toBeNull();
  });

  it('should not render raw HTML when the body contains a script tag', async () => {
    const { container } = await renderBody(
      'Before\n\n<script>alert("x")</script>\n\nAfter',
    );

    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('should drop the href when a link uses the javascript: protocol', async () => {
    await renderBody('[click me](javascript:alert(1))');

    expect(screen.getByText('click me')).not.toHaveAttribute('href');
  });

  it('should render angle brackets and braces as text when the prose contains them', async () => {
    await renderBody('Use Either<L, R> when { errors } are values.');

    expect(
      screen.getByText('Use Either<L, R> when { errors } are values.'),
    ).toBeInTheDocument();
  });
});
