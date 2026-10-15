import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { buildMarkdownTheme } from './markdownTheme.mts';

const require = createRequire(import.meta.url);
const { version } = require('github-markdown-css/package.json') as {
  version: string;
};
const source = readFileSync(
  require.resolve('github-markdown-css/github-markdown.css'),
  'utf8',
);
const output = new URL('../markdown-theme.css', import.meta.url);

writeFileSync(output, buildMarkdownTheme(source, version));
console.log(`markdown-theme.css generated from github-markdown-css@${version}`);
