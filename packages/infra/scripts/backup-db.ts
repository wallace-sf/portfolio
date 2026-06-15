/**
 * Exports all critical tables to a timestamped JSON file in backups/.
 *
 * Usage:
 *   pnpm db:backup
 *
 * Output:
 *   backups/YYYY-MM-DDTHH-mm-ss_backup.json
 */

import { PrismaClient } from '@prisma/client';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backupsDir = resolve(__dirname, '..', 'backups');

const prisma = new PrismaClient({ datasourceUrl: process.env['DIRECT_URL'] });

async function main() {
  console.log('📦 Starting database backup…');

  const [skills, profile, projects, experiences, professionalValues, users] =
    await Promise.all([
      prisma.skill.findMany(),
      prisma.profile.findMany({ include: { stats: true, socialNetworks: true } }),
      prisma.project.findMany(),
      prisma.experience.findMany(),
      prisma.professionalValue.findMany(),
      prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } }),
    ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    counts: {
      skills: skills.length,
      profiles: profile.length,
      projects: projects.length,
      experiences: experiences.length,
      professionalValues: professionalValues.length,
      users: users.length,
    },
    data: { skills, profile, projects, experiences, professionalValues, users },
  };

  mkdirSync(backupsDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${timestamp}_backup.json`;
  const filepath = resolve(backupsDir, filename);

  writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');

  console.log('');
  console.log('✅ Backup complete:');
  console.log(`   File   : backups/${filename}`);
  console.log(`   Skills : ${backup.counts.skills}`);
  console.log(`   Projects: ${backup.counts.projects}`);
  console.log(`   Experiences: ${backup.counts.experiences}`);
  console.log(`   Prof. values: ${backup.counts.professionalValues}`);
  console.log(`   Users  : ${backup.counts.users}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Backup failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
