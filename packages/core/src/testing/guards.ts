import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ENTITY_NAMES } from './entities';

const SOURCE_FILE = /\.(ts|tsx)$/;

/**
 * Every `<Entity>.create(` call in the test sources under `dir`, as
 * `path:line: Entity.create(` (path relative to `dir`). Outside `packages/core`,
 * tests build entities through the builders instead (docs/08-TESTING.md), so a
 * package's guard test expects this to be empty. Node-only, test code only.
 */
export function findDirectEntityCreates(dir: string | URL): string[] {
  const root = dir instanceof URL ? fileURLToPath(dir) : dir;
  const call = new RegExp(`\\b(${ENTITY_NAMES.join('|')})\\.create\\(`, 'g');

  return readdirSync(root, { recursive: true, encoding: 'utf8' })
    .filter((path) => SOURCE_FILE.test(path) && !path.includes('node_modules'))
    .flatMap((path) =>
      readFileSync(join(root, path), 'utf8')
        .split('\n')
        .flatMap((line, index) =>
          [...line.matchAll(call)].map(
            ([, name]) => `${path}:${index + 1}: ${name}.create(`,
          ),
        ),
    );
}
