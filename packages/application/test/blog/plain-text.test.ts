import { describe, expect, it } from 'vitest';

import { toPlainText } from '~/blog/use-cases/plain-text';

describe('toPlainText', () => {
  it('should return an empty string when the body is empty', () => {
    expect(toPlainText('')).toBe('');
  });

  it('should drop fenced code entirely when the body has backtick or tilde fences', () => {
    const markdown = [
      'Before.',
      '```ts {2}',
      'const secret = 1;',
      '```',
      '~~~mermaid',
      'graph TD',
      '~~~',
      'After.',
    ].join('\n');

    expect(toPlainText(markdown)).toBe('Before. After.');
  });

  it('should keep the link text and drop the URL when the body has links', () => {
    expect(toPlainText('See [the docs](https://example.com/a) now.')).toBe(
      'See the docs now.',
    );
  });

  it('should drop images when the body has image syntax', () => {
    expect(toPlainText('A ![diagram](/img/a.png) here.')).toBe('A here.');
  });

  it('should drop HTML tags and keep their text when the body has inline HTML', () => {
    expect(toPlainText('Press <kbd>Esc</kbd> to close.<br/>')).toBe(
      'Press Esc to close.',
    );
  });

  it('should keep inline code text without backticks when the body has inline code', () => {
    expect(toPlainText('Call `Validator.of()` first.')).toBe(
      'Call Validator.of() first.',
    );
  });

  it('should strip heading, list and quote markers when the body has block syntax', () => {
    const markdown = [
      '## Why it matters',
      '- first',
      '* second',
      '1. third',
      '> quoted',
    ].join('\n');

    expect(toPlainText(markdown)).toBe(
      'Why it matters first second third quoted',
    );
  });

  it('should strip emphasis and highlight markers when the body has inline formatting', () => {
    expect(
      toPlainText('A **bold**, _italic_, ~~gone~~ and ==marked== word.'),
    ).toBe('A bold, italic, gone and marked word.');
  });

  it('should keep identifiers with underscores when they are not emphasis', () => {
    expect(toPlainText('Set NEXT_PUBLIC_BLOG_NAV_ENABLED to false.')).toBe(
      'Set NEXT_PUBLIC_BLOG_NAV_ENABLED to false.',
    );
  });

  it('should keep cell text and drop pipes and separator rows when the body has a table', () => {
    const markdown = [
      '| Layer | Depends on |',
      '| --- | :-: |',
      '| core | nothing |',
    ].join('\n');

    expect(toPlainText(markdown)).toBe('Layer Depends on core nothing');
  });

  it('should drop thematic breaks when the body has a horizontal rule', () => {
    expect(toPlainText('One.\n\n---\n\nTwo.')).toBe('One. Two.');
  });

  it('should compose decomposed accents into single characters when the body is NFD', () => {
    const decomposed = 'validação';

    expect(toPlainText(decomposed)).toBe('validação');
    expect(toPlainText(decomposed)).toHaveLength(9);
  });
});
