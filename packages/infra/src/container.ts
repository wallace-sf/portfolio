import { Resend } from 'resend';

import { IExperienceRepository } from '@repo/core/portfolio';
import { IProfileRepository } from '@repo/core/portfolio';
import { IProjectRepository } from '@repo/core/portfolio';
import { IEmailService } from '@repo/application/contact';

import { prisma } from './prisma/client';
import { PrismaExperienceRepository } from './repositories/experience/PrismaExperienceRepository';
import { PrismaProfileRepository } from './repositories/profile/PrismaProfileRepository';
import { PrismaProjectRepository } from './repositories/project/PrismaProjectRepository';
import { ResendEmailService } from './services/ResendEmailService';

export interface Container {
  projectRepository: IProjectRepository;
  experienceRepository: IExperienceRepository;
  profileRepository: IProfileRepository;
  emailService: IEmailService;
}

const REQUIRED_ENV_VARS = ['RESEND_API_KEY', 'CONTACT_EMAIL_TO', 'CONTACT_EMAIL_FROM'] as const;

function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Please set them in your .env file.`,
    );
  }
}

export function makeContainer(): Container {
  validateEnv();

  const resend = new Resend(process.env['RESEND_API_KEY']!);

  return {
    projectRepository: new PrismaProjectRepository(prisma),
    experienceRepository: new PrismaExperienceRepository(prisma),
    profileRepository: new PrismaProfileRepository(prisma),
    emailService: new ResendEmailService(resend, {
      recipientEmail: process.env['CONTACT_EMAIL_TO']!,
      senderEmail: process.env['CONTACT_EMAIL_FROM']!,
    }),
  };
}

let containerInstance: Container | null = null;

export function getContainer(): Container {
  if (!containerInstance) {
    containerInstance = makeContainer();
  }
  return containerInstance;
}
