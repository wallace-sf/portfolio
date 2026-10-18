import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { findDirectEntityCreates } from '~/testing';

let dir: string;

const write = (path: string, source: string) => {
  mkdirSync(join(dir, path, '..'), { recursive: true });
  writeFileSync(join(dir, path), source);
};

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'entity-guard-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('findDirectEntityCreates', () => {
  it('should report each entity create call with its file and line', () => {
    write('a.test.ts', 'const post = 1;\nBlogPost.create({});\n');
    write('nested/b.test.tsx', 'const p = Profile.create(props);\n');

    expect(findDirectEntityCreates(dir).sort()).toEqual([
      'a.test.ts:2: BlogPost.create(',
      'nested/b.test.tsx:1: Profile.create(',
    ]);
  });

  it('should ignore value objects and builder chains', () => {
    write(
      'ok.test.ts',
      "Slug.create('a');\nBlogPostBuilder.build().now();\nBlogPostBuilder.published('a');\n",
    );

    expect(findDirectEntityCreates(dir)).toEqual([]);
  });

  it('should skip non-TypeScript files and node_modules', () => {
    write('notes.md', 'BlogPost.create(');
    write('node_modules/pkg/index.ts', 'BlogPost.create(');

    expect(findDirectEntityCreates(dir)).toEqual([]);
  });

  it('should accept a file URL for the directory', () => {
    write('a.test.ts', 'User.create(props);\n');

    expect(findDirectEntityCreates(pathToFileURL(`${dir}/`))).toEqual([
      'a.test.ts:1: User.create(',
    ]);
  });
});
