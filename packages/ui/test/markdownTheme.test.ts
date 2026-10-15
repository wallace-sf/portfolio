import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { buildMarkdownTheme } from '../scripts/markdownTheme.mts';

const require = createRequire(import.meta.url);

const SOURCE = `
@media (prefers-color-scheme: dark) {
  .markdown-body, [data-theme="dark"] {
    /*dark */
    color-scheme: dark;
    --fgColor-default: #f0f6fc;
  }
}
@media (prefers-color-scheme: light) {
  .markdown-body, [data-theme="light"] {
    /*light */
    color-scheme: light;
    --fgColor-default: #1f2328;
  }
}`;

describe('buildMarkdownTheme', () => {
  it('should make the dark palette the default and key the light palette to the .light theme class', () => {
    const css = buildMarkdownTheme(SOURCE, '9.9.9');

    expect(css).toMatch(
      /^\.markdown-body \{\n {2}color-scheme: dark;\n {2}--fgColor-default: #f0f6fc;\n\}/m,
    );
    expect(css).toMatch(
      /^\.light \.markdown-body \{\n {2}color-scheme: light;\n {2}--fgColor-default: #1f2328;\n\}/m,
    );
    expect(css).not.toContain('prefers-color-scheme');
    expect(css).toContain('github-markdown-css@9.9.9');
  });

  it('should throw when the source no longer has a palette block', () => {
    expect(() => buildMarkdownTheme('.markdown-body {}', '9.9.9')).toThrow(
      /dark/,
    );
  });

  it('should match the committed markdown-theme.css when generated from the installed package', () => {
    const pkg = require('github-markdown-css/package.json') as {
      version: string;
    };
    const source = readFileSync(
      require.resolve('github-markdown-css/github-markdown.css'),
      'utf8',
    );
    const committed = readFileSync(
      resolve(__dirname, '../markdown-theme.css'),
      'utf8',
    );

    expect(committed).toBe(buildMarkdownTheme(source, pkg.version));
  });
});
