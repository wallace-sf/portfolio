#!/usr/bin/env node
/**
 * Migrates intra-package relative imports to absolute ~/... imports.
 *
 * PREREQUISITE — TypeScript project references:
 *   This script produces correct results only when each package compiles
 *   to its own d.ts declarations (composite: true + declarationDir). In the
 *   current setup all packages expose raw TypeScript source via `exports`
 *   in package.json. TypeScript resolves path aliases (~/...) using the
 *   COMPILING project's tsconfig, not the imported package's tsconfig.
 *   This means ~/foo in package A fails when read by package B.
 *
 *   Until project references are configured, run this script ONLY on
 *   packages that are not transitively imported by any other TypeScript
 *   project in the monorepo.
 *
 * Usage:
 *   node scripts/migrate-to-absolute-imports.js
 *
 * Requirements per package:
 *   - tsconfig.json: baseUrl:"src", paths:{ "~/*": ["*"] }
 *   - vitest.config.ts: resolve.alias:{ "~": path.resolve(__dirname, "./src") }
 *   - (Jest) jest.config.ts: moduleNameMapper:{ "^~/(.*)$": "<rootDir>/src/$1" }
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');

// [label, srcDir] pairs — order: fewest deps first
const PACKAGES = [
  ['utils', path.join(ROOT, 'packages/utils/src')],
  ['core', path.join(ROOT, 'packages/core/src')],
  ['application', path.join(ROOT, 'packages/application/src')],
  ['infra', path.join(ROOT, 'packages/infra/src')],
];

// Matches: from './foo', from '../foo/bar', from "../../baz"
const RELATIVE_IMPORT_RE = /\bfrom\s+(['"])(\.\.?\/[^'"]+)\1/g;

function getAllTsFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...getAllTsFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

function migrateFile(file, srcDir) {
  const original = fs.readFileSync(file, 'utf8');
  const fileDir = path.dirname(file);

  const updated = original.replace(
    RELATIVE_IMPORT_RE,
    (match, quote, specifier) => {
      const absolute = path.resolve(fileDir, specifier);
      const fromSrc = path.relative(srcDir, absolute).split(path.sep).join('/');
      return `from ${quote}~/${fromSrc}${quote}`;
    },
  );

  if (updated === original) return false;
  fs.writeFileSync(file, updated);
  return true;
}

let totalFiles = 0;

for (const [label, srcDir] of PACKAGES) {
  if (!fs.existsSync(srcDir)) {
    console.log(`[${label}] src dir not found, skipping`);
    continue;
  }

  const files = getAllTsFiles(srcDir);
  let changed = 0;

  for (const file of files) {
    if (migrateFile(file, srcDir)) {
      console.log(`  ${path.relative(ROOT, file)}`);
      changed++;
    }
  }

  console.log(`[${label}] ${changed}/${files.length} files updated`);
  totalFiles += changed;
}

console.log(`\nDone. ${totalFiles} files updated total.`);
