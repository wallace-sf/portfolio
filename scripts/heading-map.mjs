#!/usr/bin/env node
/**
 * Extracts and prints the heading hierarchy (h1–h6) for each page.
 * Requires the dev server running at BASE_URL.
 *
 * Usage:
 *   node scripts/heading-map.mjs
 *   BASE_URL=http://localhost:3001 node scripts/heading-map.mjs
 */

import { createRequire } from 'module';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(resolve(__dirname, '../apps/site/package.json'));
const { JSDOM } = require('jsdom');

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

const PAGES = [
  { label: 'Home (en-US)',       path: '/en-US' },
  { label: 'About (en-US)',      path: '/en-US/about' },
  { label: 'Projects (en-US)',   path: '/en-US/projects' },
  { label: 'Home (pt-BR)',       path: '/pt-BR' },
  { label: 'About (pt-BR)',      path: '/pt-BR/about' },
  { label: 'Projects (pt-BR)',   path: '/pt-BR/projects' },
  { label: 'Home (es)',          path: '/es' },
  { label: 'About (es)',         path: '/es/about' },
  { label: 'Projects (es)',      path: '/es/projects' },
];

const INDENT = { h1: 0, h2: 1, h3: 2, h4: 3, h5: 4, h6: 5 };
const COLORS = {
  reset: '\x1b[0m',
  bold:  '\x1b[1m',
  red:   '\x1b[31m',
  yellow:'\x1b[33m',
  cyan:  '\x1b[36m',
  gray:  '\x1b[90m',
};

function validateHierarchy(headings) {
  const issues = [];
  let prev = 0;
  for (const { tag, text } of headings) {
    const level = parseInt(tag[1]);
    if (prev > 0 && level > prev + 1) {
      issues.push(`Skipped level: ${tag} ("${text}") after h${prev}`);
    }
    prev = level;
  }
  return issues;
}

async function fetchPage(path) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractHeadings(html) {
  const dom = new JSDOM(html);
  const nodes = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  return Array.from(nodes).map((el) => ({
    tag: el.tagName.toLowerCase(),
    text: el.textContent.replace(/\s+/g, ' ').trim(),
  }));
}

async function auditPage({ label, path }) {
  let headings;
  try {
    const html = await fetchPage(path);
    headings = extractHeadings(html);
  } catch (err) {
    console.log(`\n${COLORS.bold}── ${label} (${path})${COLORS.reset}`);
    console.log(`  ${COLORS.red}ERROR: ${err.message}${COLORS.reset}`);
    return;
  }

  const issues = validateHierarchy(headings);
  const statusIcon = issues.length === 0 ? '✅' : '⚠️ ';

  console.log(`\n${COLORS.bold}── ${statusIcon} ${label} (${path})${COLORS.reset}`);

  if (headings.length === 0) {
    console.log(`  ${COLORS.gray}(no headings found)${COLORS.reset}`);
  }

  for (const { tag, text } of headings) {
    const indent = '  '.repeat(INDENT[tag] + 1);
    const color = tag === 'h1' ? COLORS.cyan : tag === 'h2' ? COLORS.bold : '';
    console.log(`${indent}${color}<${tag}>${COLORS.reset} ${text}`);
  }

  if (issues.length > 0) {
    console.log(`\n  ${COLORS.yellow}Hierarchy issues:${COLORS.reset}`);
    for (const issue of issues) {
      console.log(`  ${COLORS.red}  ⚠ ${issue}${COLORS.reset}`);
    }
  }
}

console.log(`${COLORS.bold}Heading Map — ${BASE_URL}${COLORS.reset}`);
console.log('='.repeat(60));

for (const page of PAGES) {
  await auditPage(page);
}

console.log('\n' + '='.repeat(60));
console.log(`${COLORS.gray}Done. Fix skipped heading levels before launch.${COLORS.reset}\n`);
