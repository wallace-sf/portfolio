/**
 * Custom Jest resolver for the monorepo.
 *
 * Handles `~/` path aliases used inside workspace packages (packages/core,
 * packages/application, packages/infra) and apps/web itself. Each package
 * uses `~/*` mapped to its own `src/` directory, which Jest cannot resolve
 * with a single global moduleNameMapper rule.
 */

const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '../..');
const PACKAGES_ROOT = path.resolve(REPO_ROOT, 'packages');
const WEB_SRC = path.join(__dirname, 'src');

/**
 * Returns the `src` directory for the package that owns `filePath`.
 * Falls back to apps/web/src for files not inside a packages/* directory.
 */
function packageSrcDir(basedir) {
  const match = basedir.match(/\/packages\/([^/]+)\//);
  if (match) return path.join(PACKAGES_ROOT, match[1], 'src');
  return WEB_SRC;
}

function tryResolve(resolver, candidate, options) {
  try {
    return resolver(candidate, options);
  } catch {
    return null;
  }
}

module.exports = function resolver(moduleName, options) {
  if (moduleName.startsWith('~/')) {
    const srcDir = packageSrcDir(options.basedir || '');
    const relative = moduleName.slice(2); // strip ~/
    const base = path.join(srcDir, relative);

    const result =
      tryResolve(options.defaultResolver, base, options) ||
      tryResolve(options.defaultResolver, base + '.ts', options) ||
      tryResolve(options.defaultResolver, base + '.tsx', options) ||
      tryResolve(options.defaultResolver, path.join(base, 'index.ts'), options) ||
      tryResolve(options.defaultResolver, path.join(base, 'index.tsx'), options);

    if (result) return result;
  }

  return options.defaultResolver(moduleName, options);
};
