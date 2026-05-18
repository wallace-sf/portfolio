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
    graphql:       '20000000-0000-4000-8000-000000000010',
    nestjs:        '20000000-0000-4000-8000-000000000011',
    aws:           '20000000-0000-4000-8000-000000000012',
  },
  projects: {
    portfolio:    '30000000-0000-4000-8000-000000000001',
    ecommerce:    '30000000-0000-4000-8000-000000000002',
    taskManager:  '30000000-0000-4000-8000-000000000003',
    designSystem: '30000000-0000-4000-8000-000000000004',
  },
  experiences: {
    fdte_current:  '40000000-0000-4000-8000-000000000001',
    wesf:          '40000000-0000-4000-8000-000000000002',
    galaxies:      '40000000-0000-4000-8000-000000000003',
    fdte_previous: '40000000-0000-4000-8000-000000000004',
  },
  professionalValues: {
    quality:       '50000000-0000-4000-8000-000000000001',
    agility:       '50000000-0000-4000-8000-000000000002',
    versatility:   '50000000-0000-4000-8000-000000000003',
    communication: '50000000-0000-4000-8000-000000000004',
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
    { id: ID.skills.typescript,    icon: 'logos:typescript-icon',  type: 'TECHNOLOGY' as const, description: loc('TypeScript', 'TypeScript') },
    { id: ID.skills.react,         icon: 'logos:react',            type: 'TECHNOLOGY' as const, description: loc('React',      'React') },
    { id: ID.skills.nextjs,        icon: 'simple-icons:nextdotjs', type: 'TECHNOLOGY' as const, description: loc('Next.js',    'Next.js') },
    { id: ID.skills.nodejs,        icon: 'logos:nodejs-icon',      type: 'TECHNOLOGY' as const, description: loc('Node.js',    'Node.js') },
    { id: ID.skills.postgresql,    icon: 'logos:postgresql',       type: 'TECHNOLOGY' as const, description: loc('PostgreSQL', 'PostgreSQL') },
    { id: ID.skills.docker,        icon: 'logos:docker-icon',      type: 'TECHNOLOGY' as const, description: loc('Docker',     'Docker') },
    { id: ID.skills.git,           icon: 'logos:git-icon',         type: 'TECHNOLOGY' as const, description: loc('Git',        'Git') },
    { id: ID.skills.communication, icon: 'mdi:comment-text',       type: 'SOFT' as const,       description: loc('Communication', 'Comunicação') },
    { id: ID.skills.leadership,    icon: 'mdi:account-group',      type: 'SOFT' as const,       description: loc('Leadership',    'Liderança') },
    { id: ID.skills.graphql,       icon: 'logos:graphql',          type: 'TECHNOLOGY' as const, description: loc('GraphQL',    'GraphQL') },
    { id: ID.skills.nestjs,        icon: 'logos:nestjs',           type: 'TECHNOLOGY' as const, description: loc('NestJS',     'NestJS') },
    { id: ID.skills.aws,           icon: 'logos:aws',              type: 'TECHNOLOGY' as const, description: loc('AWS',        'AWS') },
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
      id: ID.experiences.fdte_current,
      company:        loc('FDTE — Fundação para o Desenvolvimento Tecnológico da Engenharia', 'FDTE — Fundação para o Desenvolvimento Tecnológico da Engenharia'),
      position:       loc('Front-end Developer', 'Desenvolvedor Front-end'),
      location:       loc('São Paulo, Brazil', 'São Paulo, Brasil'),
      description:    loc(
        'Developing scalable web platforms at INOVATA, a nonprofit organization focused on engineering technology for public agencies and enterprises. Contributing to high-impact applications using modern React ecosystem.',
        'Desenvolvendo plataformas web escaláveis na INOVATA, organização sem fins lucrativos focada em tecnologia de engenharia para órgãos públicos e empresas. Contribuindo para aplicações de alto impacto com o ecossistema moderno do React.',
      ),
      logoUrl:        img('80x80/1e3a5f/60a5fa?text=FDTE'),
      logoAlt:        loc('FDTE logo', 'Logo da FDTE'),
      employmentType: 'FULL_TIME' as const,
      locationType:   'HYBRID' as const,
      startAt:        new Date('2024-10-01'),
      endAt:          null,
      skillIds:       [ID.skills.typescript, ID.skills.react, ID.skills.nextjs, ID.skills.leadership],
    },
    {
      id: ID.experiences.wesf,
      company:        loc('WESF IT Services', 'WESF Serviços de TI'),
      position:       loc('Full-Stack Developer', 'Desenvolvedor Full-Stack'),
      location:       loc('Remote', 'Remoto'),
      description:    loc(
        'Engineered a B2B e-commerce platform for construction materials from planning to delivery. Designed scalable RESTful APIs using DDD and Clean Architecture with AWS, React.js, Vite.js, NestJS, and PostgreSQL.',
        'Desenvolveu uma plataforma B2B de e-commerce para materiais de construção, do planejamento à entrega. Projetou APIs RESTful escaláveis usando DDD e Arquitetura Limpa com AWS, React.js, Vite.js, NestJS e PostgreSQL.',
      ),
      logoUrl:        img('80x80/1e293b/34d399?text=WESF'),
      logoAlt:        loc('WESF IT Services logo', 'Logo da WESF Serviços de TI'),
      employmentType: 'FREELANCE' as const,
      locationType:   'REMOTE' as const,
      startAt:        new Date('2023-05-01'),
      endAt:          new Date('2024-06-30'),
      skillIds:       [ID.skills.typescript, ID.skills.react, ID.skills.nodejs, ID.skills.nestjs, ID.skills.postgresql, ID.skills.aws],
    },
    {
      id: ID.experiences.galaxies,
      company:        loc('Galaxies', 'Galaxies'),
      position:       loc('Front-end Developer', 'Desenvolvedor Front-end'),
      location:       loc('São Paulo, Brazil', 'São Paulo, Brasil'),
      description:    loc(
        'Developed an innovative game research and data intelligence platform using React.js, Material UI, and GraphQL. Adapted the entire platform for mobile devices, delivering 200% faster applicable intelligence than research institutes.',
        'Desenvolveu uma plataforma inovadora de pesquisa de games e inteligência de dados com React.js, Material UI e GraphQL. Adaptou toda a plataforma para dispositivos móveis, entregando inteligência aplicável 200% mais rápida que institutos de pesquisa.',
      ),
      logoUrl:        img('80x80/0f0f1a/818cf8?text=GAL'),
      logoAlt:        loc('Galaxies logo', 'Logo da Galaxies'),
      employmentType: 'FULL_TIME' as const,
      locationType:   'ONSITE' as const,
      startAt:        new Date('2023-10-01'),
      endAt:          new Date('2023-12-31'),
      skillIds:       [ID.skills.typescript, ID.skills.react, ID.skills.graphql],
    },
    {
      id: ID.experiences.fdte_previous,
      company:        loc('FDTE — Fundação para o Desenvolvimento Tecnológico da Engenharia', 'FDTE — Fundação para o Desenvolvimento Tecnológico da Engenharia'),
      position:       loc('Front-end Developer', 'Desenvolvedor Front-end'),
      location:       loc('São Paulo, Brazil', 'São Paulo, Brasil'),
      description:    loc(
        'Contributed to multiple high-impact platforms: a Fastshop e-commerce redesign (+46% performance), custom form and Kanban management systems, and a public bidding evaluation tool. Created an open-source MQTT library for React.js and mentored junior developers improving delivery speed by 15%.',
        'Contribuiu para múltiplas plataformas de alto impacto: redesign do e-commerce Fastshop (+46% de performance), sistemas de formulários e Kanban, e ferramenta de avaliação de licitações públicas. Criou biblioteca open-source MQTT para React.js e mentorou desenvolvedores juniores, aumentando a velocidade de entrega em 15%.',
      ),
      logoUrl:        img('80x80/1e3a5f/60a5fa?text=FDTE'),
      logoAlt:        loc('FDTE logo', 'Logo da FDTE'),
      employmentType: 'FULL_TIME' as const,
      locationType:   'HYBRID' as const,
      startAt:        new Date('2020-03-01'),
      endAt:          new Date('2023-05-31'),
      skillIds:       [ID.skills.typescript, ID.skills.react, ID.skills.nodejs, ID.skills.leadership, ID.skills.communication],
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: {
        company:        exp.company,
        position:       exp.position,
        location:       exp.location,
        description:    exp.description,
        logoUrl:        exp.logoUrl,
        logoAlt:        exp.logoAlt,
        employmentType: exp.employmentType,
        locationType:   exp.locationType,
        startAt:        exp.startAt,
        endAt:          exp.endAt,
        skillIds:       exp.skillIds,
      },
      create: exp,
    });
  }
  console.log(`✔ ${experiences.length} experiences seeded`);
}

async function seedProfessionalValues() {
  const values = [
    {
      id: ID.professionalValues.quality,
      icon: 'material-symbols:diamond',
      content: loc(
        'Delivering high-quality products that meet client requirements',
        'Entrega de produtos de alta qualidade que atendam aos requisitos do cliente',
      ),
      order: 0,
    },
    {
      id: ID.professionalValues.agility,
      icon: 'material-symbols:acute-rounded',
      content: loc(
        'Delivering solutions quickly and efficiently while maintaining quality',
        'Agilidade na entrega de soluções de forma rápida e eficiente, mantendo a qualidade',
      ),
      order: 1,
    },
    {
      id: ID.professionalValues.versatility,
      icon: 'material-symbols:sdk-rounded',
      content: loc(
        'Ability to handle a variety of projects and technologies',
        'Capacidade para lidar com uma variedade de projetos e tecnologias',
      ),
      order: 2,
    },
    {
      id: ID.professionalValues.communication,
      icon: 'material-symbols:3p-rounded',
      content: loc(
        'Clear and effective communication to ensure client expectations are met',
        'Comunicação clara e eficaz para garantir que as expectativas do cliente sejam atendidas',
      ),
      order: 3,
    },
  ];

  for (const value of values) {
    await prisma.professionalValue.upsert({
      where: { id: value.id },
      update: { content: value.content, order: value.order },
      create: value,
    });
  }
  console.log(`✔ ${values.length} professional values seeded`);
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
  await seedProfessionalValues();
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
