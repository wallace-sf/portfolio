import { Resend } from 'resend';

import { validateEnv } from '@repo/utils/env';

import { env } from '../src/env';
import { ResendEmailService } from '../src/services/ResendEmailService';

try {
  validateEnv(Object.keys(env));
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}

async function main() {
  const client = new Resend(env.RESEND_API_KEY);
  const service = new ResendEmailService(client, {
    recipientEmail: env.CONTACT_EMAIL_TO,
    senderEmail: env.CONTACT_EMAIL_FROM,
  });

  const result = await service.send({
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a manual integration test of ResendEmailService.',
  });

  if (result.isLeft()) {
    console.error('FAILED:', result.value.code, '-', result.value.message);
    process.exit(1);
  }

  console.log('SUCCESS: email sent to', env.CONTACT_EMAIL_TO);
}

main();
