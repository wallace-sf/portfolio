import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ datasourceUrl: process.env['DIRECT_URL'] });

// ---------------------------------------------------------------------------
// Stable seed IDs (v4 format) — ensures idempotent re-runs
// ---------------------------------------------------------------------------

const ID = {
  profile: '10000000-0000-4000-8000-000000000001',
  stats: {
    experience:   '10000000-0000-4000-8000-000000000011',
    projects:     '10000000-0000-4000-8000-000000000012',
    technologies: '10000000-0000-4000-8000-000000000013',
    countries:    '10000000-0000-4000-8000-000000000014',
  },
  social: {
    github:   '10000000-0000-4000-8000-000000000021',
    linkedin: '10000000-0000-4000-8000-000000000022',
  },
  skills: {
    typescript:    '20000000-0000-4000-8000-000000000001',
    react:         '20000000-0000-4000-8000-000000000002',
    nextjs:        '20000000-0000-4000-8000-000000000003',
    nodejs:        '20000000-0000-4000-8000-000000000004',
    postgresql:    '20000000-0000-4000-8000-000000000005',
    docker:        '20000000-0000-4000-8000-000000000006',
    git:           '20000000-0000-4000-8000-000000000007',
    communication: '20000000-0000-4000-8000-000000000008',
    leadership:    '20000000-0000-4000-8000-000000000009',
  },
  projects: {
    portfolio:    '30000000-0000-4000-8000-000000000001',
    ecommerce:    '30000000-0000-4000-8000-000000000002',
    taskManager:  '30000000-0000-4000-8000-000000000003',
    designSystem: '30000000-0000-4000-8000-000000000004',
  },
  experiences: {
    current:   '40000000-0000-4000-8000-000000000001',
    previous:  '40000000-0000-4000-8000-000000000002',
    freelance: '40000000-0000-4000-8000-000000000003',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loc(enUS: string, ptBR: string) {
  return { 'en-US': enUS, 'pt-BR': ptBR };
}

function img(path: string) {
  return `https://placehold.co/${path}`;
}

// ---------------------------------------------------------------------------
// Seeders
// ---------------------------------------------------------------------------

async function seedSkills() {
  const skills = [
    { id: ID.skills.typescript,    icon: 'logos:typescript-icon', type: 'TECHNOLOGY' as const, description: loc('TypeScript', 'TypeScript') },
    { id: ID.skills.react,         icon: 'logos:react',           type: 'TECHNOLOGY' as const, description: loc('React',      'React') },
    { id: ID.skills.nextjs,        icon: 'simple-icons:nextdotjs',type: 'TECHNOLOGY' as const, description: loc('Next.js',    'Next.js') },
    { id: ID.skills.nodejs,        icon: 'logos:nodejs-icon',     type: 'TECHNOLOGY' as const, description: loc('Node.js',    'Node.js') },
    { id: ID.skills.postgresql,    icon: 'logos:postgresql',      type: 'TECHNOLOGY' as const, description: loc('PostgreSQL', 'PostgreSQL') },
    { id: ID.skills.docker,        icon: 'logos:docker-icon',     type: 'TECHNOLOGY' as const, description: loc('Docker',     'Docker') },
    { id: ID.skills.git,           icon: 'logos:git-icon',        type: 'TECHNOLOGY' as const, description: loc('Git',        'Git') },
    { id: ID.skills.communication, icon: 'mdi:comment-text',      type: 'SOFT' as const,       description: loc('Communication', 'Comunicação') },
    { id: ID.skills.leadership,    icon: 'mdi:account-group',     type: 'SOFT' as const,       description: loc('Leadership',    'Liderança') },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: { icon: skill.icon, description: skill.description },
      create: skill,
    });
  }
  console.log(`✔ ${skills.length} skills seeded`);
}

async function seedProfile() {
  await prisma.profile.upsert({
    where: { id: ID.profile },
    update: {},
    create: {
      id: ID.profile,
      name: 'Dev Name',
      headline: loc(
        'Full Stack Developer · TypeScript · React · Node.js',
        'Desenvolvedor Full Stack · TypeScript · React · Node.js',
      ),
      bio: loc(
        'Passionate software engineer with 5+ years building scalable web applications. I care deeply about clean architecture, developer experience, and shipping things that matter.',
        'Engenheiro de software apaixonado com mais de 5 anos construindo aplicações web escaláveis. Me importo com arquitetura limpa, experiência do desenvolvedor e entregas que fazem diferença.',
      ),
      photoUrl: img('400x400/1e293b/f8fafc?text=Photo'),
      photoAlt: loc('Profile photo', 'Foto de perfil'),
      featuredProjectSlugs: ['personal-portfolio', 'e-commerce-api'],
      stats: {
        create: [
          { id: ID.stats.experience,   label: loc('Years of experience', 'Anos de experiência'), value: '5+',  icon: 'mdi:briefcase',       order: 0 },
          { id: ID.stats.projects,     label: loc('Projects delivered',   'Projetos entregues'),  value: '20+', icon: 'mdi:folder-multiple', order: 1 },
          { id: ID.stats.technologies, label: loc('Technologies',         'Tecnologias'),          value: '15+', icon: 'mdi:code-braces',     order: 2 },
          { id: ID.stats.countries,    label: loc('Countries',            'Países'),               value: '3',   icon: 'mdi:earth',           order: 3 },
        ],
      },
      socialNetworks: {
        create: [
          { id: ID.social.github,   name: 'GitHub',   url: 'https://github.com/your-username',     icon: 'mdi:github'   },
          { id: ID.social.linkedin, name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile', icon: 'mdi:linkedin' },
        ],
      },
    },
  });
  console.log('✔ Profile seeded');
}

async function seedProjects() {
  const techSkills = [
    ID.skills.typescript, ID.skills.react, ID.skills.nextjs, ID.skills.nodejs,
  ];

  const projects = [
    {
      id: ID.projects.portfolio,
      slug: 'personal-portfolio',
      coverImageUrl: img('1200x630/0f172a/38bdf8?text=Portfolio'),
      coverImageAlt: loc('Portfolio website screenshot', 'Screenshot do portfólio'),
      title:   loc('Personal Portfolio', 'Portfólio Pessoal'),
      caption: loc('A full-stack portfolio built with Next.js and Clean Architecture.', 'Portfólio full-stack construído com Next.js e Arquitetura Limpa.'),
      content: 'This portfolio is built with Next.js 16, TypeScript, Prisma, and a Clean Architecture monorepo.',
      featured: true,
      status: 'PUBLISHED' as const,
      periodStart: new Date('2024-01-01'),
      periodEnd: null,
      skillIds: techSkills,
      relatedProjectSlugs: ['e-commerce-api'],
    },
    {
      id: ID.projects.ecommerce,
      slug: 'e-commerce-api',
      coverImageUrl: img('1200x630/0f172a/34d399?text=E-Commerce'),
      coverImageAlt: loc('E-commerce API diagram', 'Diagrama da API de e-commerce'),
      title:   loc('E-Commerce API', 'API de E-Commerce'),
      caption: loc('RESTful API for an e-commerce platform with orders and payments.', 'API RESTful para plataforma de e-commerce com pedidos e pagamentos.'),
      content: 'A Node.js REST API with PostgreSQL, Docker, and full test coverage using Vitest.',
      featured: true,
      status: 'PUBLISHED' as const,
      periodStart: new Date('2023-06-01'),
      periodEnd: new Date('2024-01-01'),
      skillIds: [ID.skills.nodejs, ID.skills.postgresql, ID.skills.docker],
      relatedProjectSlugs: ['personal-portfolio'],
    },
    {
      id: ID.projects.taskManager,
      slug: 'task-management-app',
      coverImageUrl: img('1200x630/0f172a/818cf8?text=Task+Manager'),
      coverImageAlt: loc('Task management app screenshot', 'Screenshot do gerenciador de tarefas'),
      title:   loc('Task Management App', 'App de Gerenciamento de Tarefas'),
      caption: loc('A collaborative task manager with real-time updates.', 'Gerenciador de tarefas colaborativo com atualizações em tempo real.'),
      content: 'Built with React, TypeScript, and WebSockets for real-time collaboration.',
      featured: false,
      status: 'PUBLISHED' as const,
      periodStart: new Date('2023-01-01'),
      periodEnd: new Date('2023-06-01'),
      skillIds: [ID.skills.typescript, ID.skills.react],
      relatedProjectSlugs: [],
    },
    {
      id: ID.projects.designSystem,
      slug: 'ui-component-library',
      coverImageUrl: img('1200x630/0f172a/fb923c?text=Design+System'),
      coverImageAlt: loc('UI component library preview', 'Preview da biblioteca de componentes'),
      title:   loc('UI Component Library', 'Biblioteca de Componentes UI'),
      caption: loc('A reusable component library with Storybook documentation.', 'Biblioteca de componentes reutilizáveis com documentação no Storybook.'),
      content: 'Built with React, TypeScript, and Tailwind CSS, documented in Storybook.',
      featured: false,
      status: 'DRAFT' as const,
      periodStart: new Date('2022-06-01'),
      periodEnd: new Date('2023-01-01'),
      skillIds: [ID.skills.react, ID.skills.typescript],
      relatedProjectSlugs: [],
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: { featured: project.featured, status: project.status },
      create: project,
    });
  }
  console.log(`✔ ${projects.length} projects seeded`);
}

async function seedExperiences() {
  const experiences = [
    {
      id: ID.experiences.current,
      company:        loc('Acme Corp', 'Acme Corp'),
      position:       loc('Senior Full Stack Developer', 'Desenvolvedor Full Stack Sênior'),
      location:       loc('Remote — Worldwide', 'Remoto — Mundial'),
      description:    loc(
        'Leading the frontend guild and building internal tools used by 200+ engineers.',
        'Liderando o guild de frontend e construindo ferramentas internas usadas por 200+ engenheiros.',
      ),
      logoUrl:        img('80x80/1e293b/38bdf8?text=AC'),
      logoAlt:        loc('Acme Corp logo', 'Logo da Acme Corp'),
      employmentType: 'FULL_TIME' as const,
      locationType:   'REMOTE' as const,
      startAt:        new Date('2024-01-01'),
      endAt:          null,
      skillIds:       [ID.skills.typescript, ID.skills.react, ID.skills.nextjs, ID.skills.leadership],
    },
    {
      id: ID.experiences.previous,
      company:        loc('Startup XYZ', 'Startup XYZ'),
      position:       loc('Full Stack Developer', 'Desenvolvedor Full Stack'),
      location:       loc('São Paulo, Brazil (Hybrid)', 'São Paulo, Brasil (Híbrido)'),
      description:    loc(
        'Developed and maintained microservices handling 1M+ daily transactions.',
        'Desenvolveu e manteve microsserviços que processam 1M+ transações diárias.',
      ),
      logoUrl:        img('80x80/1e293b/34d399?text=XYZ'),
      logoAlt:        loc('Startup XYZ logo', 'Logo da Startup XYZ'),
      employmentType: 'FULL_TIME' as const,
      locationType:   'HYBRID' as const,
      startAt:        new Date('2021-03-01'),
      endAt:          new Date('2023-12-31'),
      skillIds:       [ID.skills.nodejs, ID.skills.postgresql, ID.skills.docker],
    },
    {
      id: ID.experiences.freelance,
      company:        loc('Self-employed', 'Autônomo'),
      position:       loc('Freelance Developer', 'Desenvolvedor Freelance'),
      location:       loc('Remote', 'Remoto'),
      description:    loc(
        'Delivered custom web applications and APIs for clients across Brazil and Europe.',
        'Entregou aplicações web e APIs personalizadas para clientes no Brasil e na Europa.',
      ),
      logoUrl:        img('80x80/1e293b/818cf8?text=FL'),
      logoAlt:        loc('Freelance icon', 'Ícone freelance'),
      employmentType: 'FREELANCE' as const,
      locationType:   'REMOTE' as const,
      startAt:        new Date('2019-01-01'),
      endAt:          new Date('2021-02-28'),
      skillIds:       [ID.skills.react, ID.skills.nodejs, ID.skills.communication],
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: {},
      create: exp,
    });
  }
  console.log(`✔ ${experiences.length} experiences seeded`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const adminEmail = process.env['ADMIN_EMAIL'] ?? 'admin@portfolio.dev';
  const adminName  = process.env['ADMIN_NAME']  ?? 'Admin';

  await prisma.user.upsert({
    where:  { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: adminName, role: 'ADMIN' },
  });
  console.log(`✔ Admin user seeded: ${adminEmail}`);

  await seedSkills();
  await seedProfile();
  await seedProjects();
  await seedExperiences();
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
