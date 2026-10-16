import { describe, expect, it } from 'vitest';

import { readingMinutes } from '~/blog/use-cases/reading-time';

const words = (count: number) => Array(count).fill('word').join(' ');

describe('readingMinutes', () => {
  it('should return 1 when the body is empty', () => {
    expect(readingMinutes('')).toBe(1);
  });

  it('should round up at 200 words per minute when the body has 201 words', () => {
    expect(readingMinutes(words(200))).toBe(1);
    expect(readingMinutes(words(201))).toBe(2);
  });

  it('should count the link text but not the URL when the body has links', () => {
    const link = '[read the docs](https://example.com/a/very/long/path)';

    expect(readingMinutes(`${words(197)} ${link}`)).toBe(1);
    expect(readingMinutes(`${words(198)} ${link}`)).toBe(2);
  });

  it('should not count syntax markers as words when the body has Markdown syntax', () => {
    const syntax = '## * - > ``` ** _ | ---';

    expect(readingMinutes(`${words(200)} ${syntax}`)).toBe(1);
  });

  it('should count words inside fenced code when the body has code blocks', () => {
    const code = ['```ts', 'const answer = compute(input);', '```'].join('\n');

    expect(readingMinutes(`${words(199)}\n\n${code}`)).toBe(2);
  });
});
