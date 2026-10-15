type Scheme = 'dark' | 'light';

/** `.light` follows the site's theme toggle; dark is the pre-hydration default. */
const SELECTORS: Record<Scheme, string> = {
  dark: '.markdown-body',
  light: '.light .markdown-body',
};

const paletteOf = (css: string, scheme: Scheme): string[] => {
  const block = new RegExp(
    String.raw`@media \(prefers-color-scheme: ${scheme}\) \{\s*\.markdown-body, \[data-theme="${scheme}"\] \{([\s\S]*?)\}\s*\}`,
  ).exec(css);
  if (!block?.[1]) {
    throw new Error(`github-markdown-css: no ${scheme} palette block found`);
  }

  return block[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('/*'));
};

const rule = (css: string, scheme: Scheme): string =>
  [
    `${SELECTORS[scheme]} {`,
    ...paletteOf(css, scheme).map((line) => `  ${line}`),
    '}',
  ].join('\n');

/**
 * `github-markdown.css` styles everything through CSS variables, but switches
 * its two palettes on `prefers-color-scheme` (the OS). This re-keys those
 * palettes to the site's theme class, straight from the installed package, so
 * GitHub's light palette is used whenever the site is in light mode.
 */
export const buildMarkdownTheme = (css: string, version: string): string =>
  [
    `/* Generated from github-markdown-css@${version} by scripts/generate-markdown-theme.mts. Do not edit. */`,
    rule(css, 'dark'),
    rule(css, 'light'),
    '',
  ].join('\n\n');
