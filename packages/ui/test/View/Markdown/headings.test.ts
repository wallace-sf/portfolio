import { markdownHeadings } from '~/View/Markdown';

describe('markdownHeadings', () => {
  it('should list h2 and h3 headings in document order with their rendered ids', async () => {
    const markdown = [
      '# Title',
      '## Why Either?',
      'Some text.',
      '### The `Left` side',
      '#### Too deep',
      '## Usage',
    ].join('\n\n');

    expect(await markdownHeadings(markdown)).toEqual([
      { id: 'why-either', text: 'Why Either?', depth: 2 },
      { id: 'the-left-side', text: 'The Left side', depth: 3 },
      { id: 'usage', text: 'Usage', depth: 2 },
    ]);
  });
});
