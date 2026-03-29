import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail =
    process.env['ADMIN_EMAIL'] ?? 'admin@portfolio.dev';
  const adminName = process.env['ADMIN_NAME'] ?? 'Admin';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: adminName, role: 'ADMIN' },
  });

  console.log(`Admin user seeded: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
