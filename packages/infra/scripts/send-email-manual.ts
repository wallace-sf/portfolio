import { Resend } from 'resend';

import { ResendEmailService } from '../src/services/ResendEmailService';

const requiredVars = ['RESEND_API_KEY', 'CONTACT_EMAIL_TO', 'CONTACT_EMAIL_FROM'] as const;
for (const key of requiredVars) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
}

async function main() {
  const client = new Resend(process.env.RESEND_API_KEY!);
  const service = new ResendEmailService(client, {
    recipientEmail: process.env.CONTACT_EMAIL_TO!,
    senderEmail: process.env.CONTACT_EMAIL_FROM!,
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

  console.log('SUCCESS: email sent to', process.env.CONTACT_EMAIL_TO);
}

main();
