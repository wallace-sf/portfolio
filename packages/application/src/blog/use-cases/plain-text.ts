type Rewrite = readonly [pattern: RegExp, replacement: string];

/**
 * Applied in order: blocks that hide everything inside them go first (fences,
 * images, links), then line markers, then inline markers. A heuristic, not a
 * parser: good enough to search prose, not to render it.
 */
const REWRITES: readonly Rewrite[] = [
  // Fenced code, ``` or ~~~, with any info string (`ts {2}`, `mermaid`).
  [/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*$/gm, ' '],
  [/!\[[^\]]*\]\([^)]*\)/g, ''],
  [/\[([^\]]*)\]\([^)]*\)/g, '$1'],
  [/<\/?[a-zA-Z][^>]*>/g, ''],
  // Thematic breaks and table separator rows (`---`, `| --- | :-: |`).
  [/^ {0,3}([-*_])( *\1){2,} *$/gm, ''],
  [/^(?=[^\n]*\|)(?=[^\n]*-)[ :|-]+$/gm, ''],
  [/^ {0,3}#{1,6} +/gm, ''],
  [/^ *>+ ?/gm, ''],
  [/^ *(?:[-*+]|\d+[.)]) +/gm, ''],
  [/\|/g, ' '],
  [/(\*{1,3})(\S(?:[\s\S]*?\S)?)\1/g, '$2'],
  // `_` only counts as emphasis at word edges, so `NEXT_PUBLIC_X` survives.
  [/(^|\W)(_{1,3})(\S(?:[\s\S]*?\S)?)\2(?=\W|$)/g, '$1$3'],
  [/~~(\S(?:[\s\S]*?\S)?)~~/g, '$1'],
  [/==(\S(?:[\s\S]*?\S)?)==/g, '$1'],
  [/`([^`]*)`/g, '$1'],
  [/\s+/g, ' '],
];

/** The readable text of a Markdown body: no syntax, no fenced code. */
export function toPlainText(markdown: string): string {
  return REWRITES.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    markdown.normalize('NFC'),
  ).trim();
}
