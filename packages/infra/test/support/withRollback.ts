import { PrismaClient } from '@prisma/client';

const TRANSACTION_TIMEOUT_MS = 15_000;

class Rollback extends Error {
  constructor() {
    super('withRollback: intentional rollback');
  }
}

/**
 * Runs `fn` inside an interactive transaction that is always rolled back, so
 * an integration test can write to (or empty) shared tables without ever
 * committing — the dev database the suites run against stays untouched, even
 * when the run is interrupted (an uncommitted transaction dies with its
 * connection). Errors thrown by `fn` propagate unchanged.
 *
 * The transaction client is handed out as a `PrismaClient` so it can be
 * injected into repositories; it is only valid for the duration of `fn`.
 */
export async function withRollback(
  db: PrismaClient,
  fn: (tx: PrismaClient) => Promise<void>,
): Promise<void> {
  try {
    await db.$transaction(
      async (tx) => {
        await fn(tx as unknown as PrismaClient);
        throw new Rollback();
      },
      { timeout: TRANSACTION_TIMEOUT_MS, maxWait: TRANSACTION_TIMEOUT_MS },
    );
  } catch (error) {
    if (!(error instanceof Rollback)) throw error;
  }
}
