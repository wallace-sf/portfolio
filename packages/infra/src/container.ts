import { Resend } from 'resend';

import { IUserRepository } from '@repo/core/identity';
import { IExperienceRepository } from '@repo/core/portfolio';
import { IProfileRepository } from '@repo/core/portfolio';
import { IProjectRepository } from '@repo/core/portfolio';
import { IEmailService } from '@repo/application/contact';
import { IAuthenticationGateway } from '@repo/application/identity';
import { validateEnv } from '@repo/utils/env';

import { env } from '~/env';
import { prisma } from '~/prisma/client';
import { PrismaExperienceRepository } from '~/repositories/experience/PrismaExperienceRepository';
import { PrismaProfileRepository } from '~/repositories/profile/PrismaProfileRepository';
import { PrismaProjectRepository } from '~/repositories/project/PrismaProjectRepository';
import { PrismaUserRepository } from '~/repositories/user/PrismaUserRepository';
import { SupabaseAuthenticationGateway } from '~/identity/SupabaseAuthenticationGateway';
import { ResendEmailService } from '~/services/ResendEmailService';

export interface Container {
  projectRepository: IProjectRepository;
  experienceRepository: IExperienceRepository;
  profileRepository: IProfileRepository;
  emailService: IEmailService;
  userRepository: IUserRepository;
  authGateway: IAuthenticationGateway;
}

export function makeContainer(): Container {
  validateEnv(Object.keys(env));

  const resend = new Resend(env.RESEND_API_KEY);

  return {
    projectRepository: new PrismaProjectRepository(prisma),
    experienceRepository: new PrismaExperienceRepository(prisma),
    profileRepository: new PrismaProfileRepository(prisma),
    emailService: new ResendEmailService(resend, {
      recipientEmail: env.CONTACT_EMAIL_TO,
      senderEmail: env.CONTACT_EMAIL_FROM,
    }),
    userRepository: new PrismaUserRepository(prisma),
    authGateway: new SupabaseAuthenticationGateway(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
  };
}

let containerInstance: Container | null = null;

export function getContainer(): Container {
  if (!containerInstance) {
    containerInstance = makeContainer();
  }
  return containerInstance;
}
