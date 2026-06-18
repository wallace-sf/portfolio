import { PrismaClient } from '@prisma/client';

import {
  seedExperiences,
  seedProfile,
  seedProjects,
  seedProfessionalValues,
  seedSkills,
} from './seeders';

const prisma = new PrismaClient({ datasourceUrl: process.env['DIRECT_URL'] });

async function main() {
  const adminEmail = process.env['ADMIN_EMAIL'] ?? 'admin@portfolio.dev';
  const adminName = process.env['ADMIN_NAME'] ?? 'Admin';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: adminName, role: 'ADMIN' },
  });
  console.log(`✔ Admin user seeded: ${adminEmail}`);

  await seedSkills(prisma);
  await seedProfile(prisma);
  await seedProjects(prisma);
  await seedExperiences(prisma);
  await seedProfessionalValues(prisma);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
