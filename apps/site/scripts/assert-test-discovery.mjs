import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, '..');
const requiredTest = path.join('tests', 'config-discovery.test.tsx');

const output = execFileSync('pnpm', ['exec', 'vitest', 'list'], {
  cwd: appDir,
  encoding: 'utf8',
});

if (!output.includes(requiredTest)) {
  throw new Error(`Expected Vitest to discover ${requiredTest}.`);
}
