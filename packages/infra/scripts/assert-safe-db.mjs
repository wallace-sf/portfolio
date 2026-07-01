/**
 * Safety guard for destructive Prisma operations (migrate dev, db push).
 *
 * Reads DIRECT_URL from the local .env file and aborts if it points to a
 * database that is neither localhost nor DB_SAFE_REMOTE_REF (also read from
 * .env — e.g. your dev project's ref), unless DB_ALLOW_DESTRUCTIVE=1 is
 * explicitly set.
 *
 * Usage (called automatically by db:migrate and db:push scripts):
 *   node scripts/assert-safe-db.mjs
 *
 * To intentionally run a destructive operation against another database
 * (e.g. production):
 *   DB_ALLOW_DESTRUCTIVE=1 pnpm db:migrate
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');

function parseEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf-8');
  const result = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    result[key] = value;
  }
  return result;
}

const env = parseEnv(envPath);
const directUrl = process.env.DIRECT_URL ?? env['DIRECT_URL'] ?? '';
const allowDestructive = process.env.DB_ALLOW_DESTRUCTIVE === '1';
const safeRemoteRef = process.env.DB_SAFE_REMOTE_REF ?? env['DB_SAFE_REMOTE_REF'] ?? '';

const isLocal =
  directUrl.includes('localhost') ||
  directUrl.includes('127.0.0.1') ||
  directUrl.includes('0.0.0.0');

const isSafeRemote = safeRemoteRef !== '' && directUrl.includes(safeRemoteRef);

if (!isLocal && !isSafeRemote && !allowDestructive) {
  console.error('');
  console.error('🚨  DESTRUCTIVE OPERATION BLOCKED');
  console.error('');
  console.error('   DIRECT_URL points to a non-local database.');
  console.error('   Running "prisma migrate dev" or "prisma db push" against');
  console.error('   a cloud database can cause irreversible data loss.');
  console.error('');
  console.error('   If you are CERTAIN this is intentional, re-run with:');
  console.error('');
  console.error('     DB_ALLOW_DESTRUCTIVE=1 pnpm db:migrate');
  console.error('');
  console.error('   For production migrations, prefer:');
  console.error('');
  console.error('     pnpm db:migrate:deploy   (safe — no interactive reset)');
  console.error('');
  process.exit(1);
}

if (!isLocal && isSafeRemote) {
  console.log('');
  console.log('ℹ️   DIRECT_URL matches DB_SAFE_REMOTE_REF — proceeding.');
  console.log('');
}

if (!isLocal && !isSafeRemote && allowDestructive) {
  console.warn('');
  console.warn('⚠️   DB_ALLOW_DESTRUCTIVE=1 — proceeding against cloud database.');
  console.warn('    Make sure you have a recent backup (pnpm db:backup).');
  console.warn('');
}
