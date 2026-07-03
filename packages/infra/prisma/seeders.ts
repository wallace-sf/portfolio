import { PrismaClient } from '@prisma/client';

// ---------------------------------------------------------------------------
// Stable seed IDs (v4 format) — ensures idempotent re-runs
// ---------------------------------------------------------------------------

export const ID = {
  profile: '10000000-0000-4000-8000-000000000001',
  stats: {
    experience: '10000000-0000-4000-8000-000000000011',
    projects: '10000000-0000-4000-8000-000000000012',
    technologies: '10000000-0000-4000-8000-000000000013',
    countries: '10000000-0000-4000-8000-000000000014',
  },
  social: {
    github: '10000000-0000-4000-8000-000000000021',
    linkedin: '10000000-0000-4000-8000-000000000022',
  },
  skills: {
    typescript: '20000000-0000-4000-8000-000000000001',
    react: '20000000-0000-4000-8000-000000000002',
    nextjs: '20000000-0000-4000-8000-000000000003',
    nodejs: '20000000-0000-4000-8000-000000000004',
    postgresql: '20000000-0000-4000-8000-000000000005',
    docker: '20000000-0000-4000-8000-000000000006',
    git: '20000000-0000-4000-8000-000000000007',
    communication: '20000000-0000-4000-8000-000000000008',
    leadership: '20000000-0000-4000-8000-000000000009',
    graphql: '20000000-0000-4000-8000-000000000010',
    nestjs: '20000000-0000-4000-8000-000000000011',
    aws: '20000000-0000-4000-8000-000000000012',
    tailwindcss: '20000000-0000-4000-8000-000000000013',
    javascript: '20000000-0000-4000-8000-000000000014',
    accessibility: '20000000-0000-4000-8000-000000000015',
    cicd: '20000000-0000-4000-8000-000000000016',
    designSystems: '20000000-0000-4000-8000-000000000017',
    shopify: '20000000-0000-4000-8000-000000000018',
    framerMotion: '20000000-0000-4000-8000-000000000019',
    vite: '20000000-0000-4000-8000-000000000020',
    prisma: '20000000-0000-4000-8000-000000000021',
    supabase: '20000000-0000-4000-8000-000000000022',
  },
  projects: {
    portfolio: '30000000-0000-4000-8000-000000000001',
    b2bEcommerce: '30000000-0000-4000-8000-000000000002',
    galaxiesSurveyBuilder: '30000000-0000-4000-8000-000000000003',
    mqttClient: '30000000-0000-4000-8000-000000000004',
    buyrShopifyApp: '30000000-0000-4000-8000-000000000005',
    aiGolfAssistant: '30000000-0000-4000-8000-000000000006',
  },
  experiences: {
    fdte_current: '40000000-0000-4000-8000-000000000001',
    wesf: '40000000-0000-4000-8000-000000000002',
    galaxies: '40000000-0000-4000-8000-000000000003',
    fdte_previous: '40000000-0000-4000-8000-000000000004',
  },
  professionalValues: {
    quality: '50000000-0000-4000-8000-000000000001',
    agility: '50000000-0000-4000-8000-000000000002',
    versatility: '50000000-0000-4000-8000-000000000003',
    communication: '50000000-0000-4000-8000-000000000004',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function loc(enUS: string, ptBR: string, es?: string) {
  return { 'en-US': enUS, 'pt-BR': ptBR, ...(es !== undefined && { es }) };
}

// ---------------------------------------------------------------------------
// Seeders
// ---------------------------------------------------------------------------

export async function seedSkills(db: PrismaClient): Promise<void> {
  const skills = [
    {
      id: ID.skills.typescript,
      icon: 'logos:typescript-icon',
      type: 'TECHNOLOGY' as const,
      description: loc('TypeScript', 'TypeScript'),
    },
    {
      id: ID.skills.react,
      icon: 'logos:react',
      type: 'TECHNOLOGY' as const,
      description: loc('React', 'React'),
    },
    {
      id: ID.skills.nextjs,
      icon: 'simple-icons:nextdotjs',
      type: 'TECHNOLOGY' as const,
      description: loc('Next.js', 'Next.js'),
    },
    {
      id: ID.skills.nodejs,
      icon: 'logos:nodejs-icon',
      type: 'TECHNOLOGY' as const,
      description: loc('Node.js', 'Node.js'),
    },
    {
      id: ID.skills.postgresql,
      icon: 'logos:postgresql',
      type: 'TECHNOLOGY' as const,
      description: loc('PostgreSQL', 'PostgreSQL'),
    },
    {
      id: ID.skills.docker,
      icon: 'logos:docker-icon',
      type: 'TECHNOLOGY' as const,
      description: loc('Docker', 'Docker'),
    },
    {
      id: ID.skills.git,
      icon: 'logos:git-icon',
      type: 'TECHNOLOGY' as const,
      description: loc('Git', 'Git'),
    },
    {
      id: ID.skills.tailwindcss,
      icon: 'logos:tailwindcss-icon',
      type: 'TECHNOLOGY' as const,
      description: loc('Tailwind CSS', 'Tailwind CSS'),
    },
    {
      id: ID.skills.graphql,
      icon: 'logos:graphql',
      type: 'TECHNOLOGY' as const,
      description: loc('GraphQL', 'GraphQL'),
    },
    {
      id: ID.skills.nestjs,
      icon: 'logos:nestjs',
      type: 'TECHNOLOGY' as const,
      description: loc('NestJS', 'NestJS'),
    },
    {
      id: ID.skills.aws,
      icon: 'logos:aws',
      type: 'TECHNOLOGY' as const,
      description: loc('AWS', 'AWS'),
    },
    {
      id: ID.skills.javascript,
      icon: 'logos:javascript',
      type: 'TECHNOLOGY' as const,
      description: loc('JavaScript', 'JavaScript'),
    },
    {
      id: ID.skills.accessibility,
      icon: 'material-symbols:accessibility',
      type: 'TECHNOLOGY' as const,
      description: loc('Accessibility', 'Acessibilidade', 'Accesibilidad'),
    },
    {
      id: ID.skills.cicd,
      icon: 'mdi:infinity',
      type: 'TECHNOLOGY' as const,
      description: loc('CI/CD', 'CI/CD'),
    },
    {
      id: ID.skills.designSystems,
      icon: 'mdi:palette-swatch-outline',
      type: 'TECHNOLOGY' as const,
      description: loc('Design Systems', 'Design Systems'),
    },
    {
      id: ID.skills.shopify,
      icon: 'logos:shopify',
      type: 'TECHNOLOGY' as const,
      description: loc('Shopify', 'Shopify'),
    },
    {
      id: ID.skills.framerMotion,
      icon: 'simple-icons:framer',
      type: 'TECHNOLOGY' as const,
      description: loc('Framer Motion', 'Framer Motion'),
    },
    {
      id: ID.skills.vite,
      icon: 'logos:vitejs',
      type: 'TECHNOLOGY' as const,
      description: loc('Vite', 'Vite'),
    },
    {
      id: ID.skills.prisma,
      icon: 'simple-icons:prisma',
      type: 'TECHNOLOGY' as const,
      description: loc('Prisma', 'Prisma'),
    },
    {
      id: ID.skills.supabase,
      icon: 'simple-icons:supabase',
      type: 'TECHNOLOGY' as const,
      description: loc('Supabase', 'Supabase'),
    },
    {
      id: ID.skills.communication,
      icon: 'mdi:comment-text',
      type: 'SOFT' as const,
      description: loc('Communication', 'Comunicação', 'Comunicación'),
    },
    {
      id: ID.skills.leadership,
      icon: 'mdi:account-group',
      type: 'SOFT' as const,
      description: loc('Leadership', 'Liderança', 'Liderazgo'),
    },
  ];

  for (const skill of skills) {
    await db.skill.upsert({
      where: { id: skill.id },
      update: { icon: skill.icon, description: skill.description },
      create: skill,
    });
  }
  console.log(`✔ ${skills.length} skills seeded`);
}

export async function seedProfile(db: PrismaClient): Promise<void> {
  await db.profile.upsert({
    where: { id: ID.profile },
    update: {
      name: 'Wallace Ferreira',
      photoUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/profile/images/hero-landing-page.webp',
      headline: loc(
        'Frontend Engineer · React & Next.js · TypeScript',
        'Engenheiro Frontend · React & Next.js · TypeScript',
        'Ingeniero Frontend · React & Next.js · TypeScript',
      ),
      bio: loc(
        "I'm a Frontend Engineer with over 6 years of experience specialized in building scalable, performant, and accessible web products with React, Next.js, and TypeScript.\n\nMy experience includes leading frontend design, development and now working for AI-assisted customer platforms and global commerce solutions, serving over 800 clients worldwide.\n\nPassionate about product-oriented environments, I focus on architecture, UX, and quality to deliver impactful results.\n\nCurrently seeking international roles to contribute to high-quality digital products and grow my engineering skills.",
        'Sou Engenheiro Frontend com mais de 6 anos de experiência especializado em criar produtos web escaláveis, performáticos e acessíveis com React, Next.js e TypeScript.\n\nMinha experiência inclui liderar design e desenvolvimento frontend, e atualmente trabalho em plataformas de atendimento ao cliente com IA e soluções de comércio global, atendendo mais de 800 clientes no mundo.\n\nApaixonado por ambientes orientados a produto, foco em arquitetura, UX e qualidade para entregar resultados de impacto.\n\nAtualmente em busca de oportunidades internacionais para contribuir com produtos digitais de alta qualidade e evoluir minhas habilidades como engenheiro.',
        'Soy Ingeniero Frontend con más de 6 años de experiencia especializado en crear productos web escalables, de alto rendimiento y accesibles con React, Next.js y TypeScript.\n\nMi experiencia incluye liderar el diseño y desarrollo frontend, y actualmente trabajo en plataformas de atención al cliente con IA y soluciones de comercio global, sirviendo a más de 800 clientes en todo el mundo.\n\nApasionado por los entornos orientados al producto, me enfoco en arquitectura, UX y calidad para entregar resultados de impacto.\n\nActualmente en búsqueda de oportunidades internacionales para contribuir a productos digitales de alta calidad y crecer como ingeniero.',
      ),
      photoAlt: loc('Professional Picture 1 of Wallace Ferreira', 'Foto profissional 1 de Wallace Ferreira', 'Foto profesional 1 de Wallace Ferreira'),
      stats: {
        deleteMany: {},
        create: [
          {
            id: ID.stats.experience,
            label: loc('Years of experience', 'Anos de experiência', 'Años de experiencia'),
            value: '6+',
            icon: 'mdi:briefcase',
            order: 0,
          },
          {
            id: ID.stats.projects,
            label: loc('Projects delivered', 'Projetos entregues', 'Proyectos entregados'),
            value: '20+',
            icon: 'mdi:folder-multiple',
            order: 1,
          },
          {
            id: ID.stats.technologies,
            label: loc('Technologies', 'Tecnologias', 'Tecnologías'),
            value: '15+',
            icon: 'mdi:code-braces',
            order: 2,
          },
          {
            id: ID.stats.countries,
            label: loc('Countries', 'Países', 'Países'),
            value: '2',
            icon: 'mdi:earth',
            order: 3,
          },
        ],
      },
      socialNetworks: {
        deleteMany: {},
        create: [
          {
            id: ID.social.github,
            name: 'GitHub',
            url: 'https://github.com/wallace-sf',
            icon: 'mdi:github',
          },
          {
            id: ID.social.linkedin,
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/wallace-silva-ferreira/',
            icon: 'mdi:linkedin',
          },
        ],
      },
    },
    create: {
      id: ID.profile,
      name: 'Wallace Ferreira',
      headline: loc(
        'Frontend Engineer · React & Next.js · TypeScript',
        'Engenheiro Frontend · React & Next.js · TypeScript',
        'Ingeniero Frontend · React & Next.js · TypeScript',
      ),
      bio: loc(
        "I'm a Frontend Engineer with over 6 years of experience specialized in building scalable, performant, and accessible web products with React, Next.js, and TypeScript.\n\nMy experience includes leading frontend design, development and now working for AI-assisted customer platforms and global commerce solutions, serving over 800 clients worldwide.\n\nPassionate about product-oriented environments, I focus on architecture, UX, and quality to deliver impactful results.\n\nCurrently seeking international roles to contribute to high-quality digital products and grow my engineering skills.",
        'Sou Engenheiro Frontend com mais de 6 anos de experiência especializado em criar produtos web escaláveis, performáticos e acessíveis com React, Next.js e TypeScript.\n\nMinha experiência inclui liderar design e desenvolvimento frontend, e atualmente trabalho em plataformas de atendimento ao cliente com IA e soluções de comércio global, atendendo mais de 800 clientes no mundo.\n\nApaixonado por ambientes orientados a produto, foco em arquitetura, UX e qualidade para entregar resultados de impacto.\n\nAtualmente em busca de oportunidades internacionais para contribuir com produtos digitais de alta qualidade e evoluir minhas habilidades como engenheiro.',
        'Soy Ingeniero Frontend con más de 6 años de experiencia especializado en crear productos web escalables, de alto rendimiento y accesibles con React, Next.js y TypeScript.\n\nMi experiencia incluye liderar el diseño y desarrollo frontend, y actualmente trabajo en plataformas de atención al cliente con IA y soluciones de comercio global, sirviendo a más de 800 clientes en todo el mundo.\n\nApasionado por los entornos orientados al producto, me enfoco en arquitectura, UX y calidad para entregar resultados de impacto.\n\nActualmente en búsqueda de oportunidades internacionales para contribuir a productos digitales de alta calidad y crecer como ingeniero.',
      ),
      photoUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/profile/images/hero-landing-page.webp',
      photoAlt: loc('Professional Picture 1 of Wallace Ferreira', 'Foto profissional 1 de Wallace Ferreira', 'Foto profesional 1 de Wallace Ferreira'),
      stats: {
        create: [
          {
            id: ID.stats.experience,
            label: loc('Years of experience', 'Anos de experiência', 'Años de experiencia'),
            value: '6+',
            icon: 'mdi:briefcase',
            order: 0,
          },
          {
            id: ID.stats.projects,
            label: loc('Projects delivered', 'Projetos entregues', 'Proyectos entregados'),
            value: '20+',
            icon: 'mdi:folder-multiple',
            order: 1,
          },
          {
            id: ID.stats.technologies,
            label: loc('Technologies', 'Tecnologias', 'Tecnologías'),
            value: '15+',
            icon: 'mdi:code-braces',
            order: 2,
          },
          {
            id: ID.stats.countries,
            label: loc('Countries', 'Países', 'Países'),
            value: '2',
            icon: 'mdi:earth',
            order: 3,
          },
        ],
      },
      socialNetworks: {
        create: [
          {
            id: ID.social.github,
            name: 'GitHub',
            url: 'https://github.com/wallace-sf',
            icon: 'mdi:github',
          },
          {
            id: ID.social.linkedin,
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/wallace-silva-ferreira/',
            icon: 'mdi:linkedin',
          },
        ],
      },
    },
  });
  console.log('✔ Profile seeded');
}

export async function seedProjects(db: PrismaClient): Promise<void> {
  const projects = [
    {
      id: ID.projects.portfolio,
      slug: 'personal-portfolio',
      coverImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/portfolio/portfolio-cover.webp',
      coverImageAlt: loc(
        'Personal Portfolio repository on GitHub',
        'Repositório do Portfólio Pessoal no GitHub',
        'Repositorio del Portafolio Personal en GitHub',
      ),
      thumbnailImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/portfolio/portfolio-w-symbol.svg',
      thumbnailImageAlt: loc(
        'Personal Portfolio thumbnail',
        'Thumbnail do Portfólio Pessoal',
        'Thumbnail del Portafolio Personal',
      ),
      title: loc('Personal Portfolio', 'Portfólio Pessoal', 'Portafolio Personal'),
      caption: loc(
        'A full-stack portfolio built with Next.js, DDD, and Clean Architecture in a Turborepo monorepo.',
        'Portfólio full-stack construído com Next.js, DDD e Arquitetura Limpa em um monorepo Turborepo.',
        'Portafolio full-stack construido con Next.js, DDD y Arquitectura Limpia en un monorepo Turborepo.',
      ),
      content: loc(
        `After six years in software engineering, this portfolio was my first chance to own an entire product, from architecture to deployment. It goes beyond LinkedIn for an international audience, targets opportunities abroad, and proves that ==Domain-Driven Design and Clean Architecture== hold up on a solo greenfield project, not only in teams where the process is enforced by review.

## The Constraints

The architecture was self-imposed. With no team, no deadline, and no external pressure, the constraint came from a deliberate decision: treat this as a real product with an MVP scope, a post-MVP roadmap, and no shortcuts in the domain layer.

Performance mattered most. The site had to hold up under Lighthouse scrutiny, since a slow portfolio sends the wrong message. Content also had to change without a deploy, so project entries and experience data are ==driven by a seeded database and rendered as markdown== rather than hardcoded into components.

i18n cut across both. Supporting English, Portuguese, and Spanish meant solving internationalization at the domain level instead of patching it into the UI afterward.

The visual design was built entirely in Figma by [Milena Kawai](https://www.instagram.com/miilenamayuri/), a designer friend who delivered the full specification from scratch.

## Engineering Process

Managed the entire backlog with **Task Master**, divided into sprints tracked as GitHub milestones. GitHub Projects provided a Kanban board for issue tracking; each issue followed a structured template with context, acceptance criteria, relevant files, and dependencies. Custom labels organized work by sprint tag, priority, and type.

The project shipped five numbered PRDs, one per architecture layer:

- **Sprint 0**: domain foundation (\`core\`): Either pattern, Value Objects, entities, repository interfaces
- **Sprint 1**: application layer: use cases, ports, DTOs
- **Sprint 2**: infrastructure: Prisma repositories, Supabase gateway, DI container
- **Sprint 3**: public site: Next.js App Router, SSG, i18n routing, UI components
- **Sprint 4**: CI/CD: type checking, linting, and test suite on GitHub Actions

A dedicated accessibility sprint resolved ==88 WCAG issues==, followed by a Lighthouse-driven performance pass that targeted the critical bundle, RSC preload hints, and LCP image loading.

A \`docs/\` folder holds ==12 numbered architecture documents==: bounded contexts, validation strategy, i18n approach, testing strategy, code patterns, and a domain glossary. They were written as the system was built, not after the fact.

## Architecture

\`\`\`mermaid
flowchart TD
  site["apps/site\\n(Next.js 16 — SSG)"]
  admin["apps/admin\\n(Next.js — post-MVP)"]
  app["packages/application\\nuse cases · ports · DTOs"]
  core["packages/core\\nentities · VOs · Either · interfaces"]
  infra["packages/infra\\nPrisma · Supabase · Resend · DI"]
  ui["packages/ui\\nView + Control components"]
  utils["packages/utils\\nValidator · formatters · hooks"]
  db[(Supabase / PostgreSQL)]

  site --> app
  admin --> app
  site --> ui
  admin --> ui
  app --> core
  infra --> app
  infra --> core
  infra --> db
  site --> utils
  app --> utils
  core --> utils
\`\`\`

The domain is organized into three bounded contexts: **portfolio** (projects, experiences, skills, profile), **identity** (authentication and user), and **contact** (message sending). Each has its own entities, value objects, and repository interfaces, sharing only the Shared Kernel.

Each package has a single, enforced responsibility:

- **\`core\`**: domain model; zero framework dependencies; entities, value objects, Either pattern, repository interfaces
- **\`application\`**: use cases and ports; depends only on \`core\`; no Prisma, no HTTP
- **\`infra\`**: concrete implementations; the only layer that imports Prisma and Supabase
- **\`ui\`**: shared React components; split into \`View\` (display) and \`Control\` (interactive) categories
- **\`utils\`**: pure TypeScript utilities: \`Validator\`, formatters, browser hooks; no React dependency

## Portfolio Site

==Server Components call use cases directly at build time==. No REST API layer exists between the domain and the generated HTML; for a content-driven static site, an HTTP boundary would be pure overhead.

\`\`\`mermaid
sequenceDiagram
  participant Build as Next.js Build
  participant SC as Server Component
  participant UC as Use Case
  participant Repo as Repository
  participant DB as Supabase / PostgreSQL

  Build->>SC: generateStaticParams()
  SC->>UC: GetPublishedProjects.execute()
  UC->>Repo: findAll()
  Repo->>DB: query
  DB-->>Repo: rows
  Repo-->>UC: Project[]
  UC-->>SC: Right(ProjectDTO[])
  SC-->>Build: [{ locale, slug }]

  Build->>SC: render page per route
  SC->>UC: GetProjectBySlug.execute({ slug })
  UC->>Repo: findBySlug(slug)
  Repo->>DB: query
  DB-->>Repo: row
  Repo-->>UC: Project entity
  UC-->>SC: Right(ProjectDTO)
  SC-->>Build: static HTML
\`\`\`

Internationalization is a ==domain concern==: \`LocalizedText\` is a value object in \`core\`. The site renders in English, Portuguese, and Spanish, all resolved at the domain layer before any React component touches the data.

Every page has a \`generateMetadata\` export with localized \`title\`, \`description\`, and \`openGraph\` fields. Project pages derive their OG data directly from domain entities: title, caption, cover image. Metadata is never out of sync with content. A custom ==OG image route== built with \`next/og\` on the Edge Runtime generates branded 1200×630 cards per page, locale, and project.

Project detail routes are driven by \`Slug\`, a value object in \`core\`, with \`generateStaticParams\` resolving every published project slug across all three locales at build time. No slug, no route.

The contact form runs against rate limiting via Upstash Redis and delivers email through Resend, both behind port interfaces that keep them ==swappable and testable without touching infrastructure==.

This portfolio is the first public technical presence I've built and owned entirely, from domain model to deployment pipeline. The admin app for content management and the blog are scoped as post-MVP, keeping the current site focused and shippable.

## Technical Highlights

- **No API layer**: Server Components consume use cases at build time; a static site doesn't need an HTTP boundary between domain and HTML
- **ESLint-enforced dependency direction**: layer violations are caught at lint time, not in review

Domain errors never throw. The ==Either pattern== propagates \`Left<ValidationError>\` through use cases to the UI, so every error path stays explicit and testable. \`LocalizedText\` follows the same logic as a value object: i18n is a domain concern, so components receive resolved strings, not translation keys.

- **Accessibility as a sprint**: 88 WCAG findings tracked, scoped, and shipped as individual issues with acceptance criteria
- **Lighthouse-driven performance**: critical bundle trimmed by lazy-loading Zod-heavy forms, removing unnecessary \`'use client'\`, and preloading the LCP image with \`fetchpriority=high\`
- **SEO and Open Graph**: every page exports localized \`generateMetadata\`. An Edge Runtime \`/og\` route generates branded 1200×630 cards per page, locale, and project using \`next/og\`, with OG data sourced from domain entities instead of static strings

## Technologies

- [Next.js](https://nextjs.org): App Router with SSG; \`generateStaticParams\` generates all localized routes at build time
- [Turborepo](https://turbo.build): monorepo orchestration with five shared packages and remote caching on Vercel
- [TypeScript](https://www.typescriptlang.org): strict mode across all packages; \`any\` is disallowed
- [Prisma](https://www.prisma.io): ORM and migration layer, isolated to \`packages/infra\`
- [Supabase](https://supabase.com): PostgreSQL database and JWT-based authentication
- [Tailwind CSS](https://tailwindcss.com): shared design tokens via \`packages/tailwind-config\`
- [next-intl](https://next-intl.dev): locale routing and message resolution for EN, PT-BR, and ES
- [Vitest](https://vitest.dev): unit and integration tests across all packages; ~100 test files
- [Upstash Redis](https://upstash.com): serverless rate limiting on the contact form
- [Resend](https://resend.com): transactional email for contact form submissions
- [Vercel](https://vercel.com): deployment with Turborepo remote cache`,
        `Após seis anos em engenharia de software, este portfólio foi minha primeira oportunidade de ser dono de um produto inteiro, da arquitetura ao deploy. Ele vai além do LinkedIn para alcançar um público internacional, busca oportunidades no exterior e demonstra que ==Domain-Driven Design e Arquitetura Limpa== se sustentam em um projeto solo do zero, não apenas em times onde o processo é imposto por revisão.

## As Restrições

A arquitetura foi autoimposta. Sem equipe, sem prazo e sem pressão externa, a restrição veio de uma decisão deliberada: tratar o projeto como um produto real com escopo de MVP, um roadmap pós-MVP e nenhum atalho na camada de domínio.

Performance foi o que mais pesou. O site precisava aguentar o escrutínio do Lighthouse, porque um portfólio lento passa a mensagem errada. O conteúdo também precisava mudar sem deploy, então entradas de projetos e experiências são ==orientadas por um banco de dados seedado e renderizadas como markdown== em vez de fixas no código.

O i18n atravessou as duas frentes. Suportar inglês, português e espanhol significava resolver internacionalização na camada de domínio, não remendá-la na UI depois.

O design visual foi criado inteiramente no Figma por [Milena Kawai](https://www.instagram.com/miilenamayuri/), uma amiga designer que entregou a especificação completa do zero.

## Processo de Engenharia

O backlog foi gerenciado com **Task Master**, dividido em sprints rastreadas como milestones do GitHub. O GitHub Projects forneceu um quadro Kanban para acompanhamento; cada issue seguia um template estruturado com contexto, critérios de aceitação, arquivos relevantes e dependências. Labels customizadas organizaram o trabalho por sprint, prioridade e tipo.

O projeto foi estruturado em cinco PRDs numerados, um por camada de arquitetura:

- **Sprint 0**: fundação do domínio (\`core\`): padrão Either, Value Objects, entidades, interfaces de repositório
- **Sprint 1**: camada de aplicação: use cases, ports, DTOs
- **Sprint 2**: infraestrutura: repositórios Prisma, gateway Supabase, contêiner de DI
- **Sprint 3**: site público: Next.js App Router, SSG, roteamento i18n, componentes de UI
- **Sprint 4**: CI/CD: verificação de tipos, lint e suite de testes no GitHub Actions

Uma sprint dedicada à acessibilidade resolveu ==88 problemas de WCAG==, seguida por uma passagem orientada pelo Lighthouse que focou no bundle crítico, hints de preload de RSC e carregamento da imagem LCP.

A pasta \`docs/\` contém ==12 documentos de arquitetura numerados==: contextos delimitados, estratégia de validação, abordagem de i18n, estratégia de testes, padrões de código e glossário de domínio. Foram escritos conforme o sistema era construído, não depois.

## Arquitetura

\`\`\`mermaid
flowchart TD
  site["apps/site\\n(Next.js 16 — SSG)"]
  admin["apps/admin\\n(Next.js — post-MVP)"]
  app["packages/application\\nuse cases · ports · DTOs"]
  core["packages/core\\nentities · VOs · Either · interfaces"]
  infra["packages/infra\\nPrisma · Supabase · Resend · DI"]
  ui["packages/ui\\nView + Control components"]
  utils["packages/utils\\nValidator · formatters · hooks"]
  db[(Supabase / PostgreSQL)]

  site --> app
  admin --> app
  site --> ui
  admin --> ui
  app --> core
  infra --> app
  infra --> core
  infra --> db
  site --> utils
  app --> utils
  core --> utils
\`\`\`

O domínio é organizado em três contextos delimitados: **portfolio** (projetos, experiências, skills, perfil), **identity** (autenticação e usuário) e **contact** (envio de mensagens). Cada um tem suas próprias entidades, value objects e interfaces de repositório, compartilhando apenas o Shared Kernel.

Cada pacote tem uma única responsabilidade aplicada mecanicamente:

- **\`core\`**: modelo de domínio; zero dependências de framework; entidades, value objects, padrão Either, interfaces de repositório
- **\`application\`**: use cases e ports; depende apenas de \`core\`; sem Prisma, sem HTTP
- **\`infra\`**: implementações concretas; única camada que importa Prisma e Supabase
- **\`ui\`**: biblioteca de componentes React; dividida em \`View\` (exibição) e \`Control\` (interatividade)
- **\`utils\`**: utilitários TypeScript puros: \`Validator\`, formatadores, hooks de browser; sem dependência de React

## Site do Portfólio

==Server Components chamam use cases diretamente no build time==. Não existe nenhuma camada REST entre o domínio e o HTML gerado; para um site estático orientado a conteúdo, uma fronteira HTTP seria overhead puro.

\`\`\`mermaid
sequenceDiagram
  participant Build as Next.js Build
  participant SC as Server Component
  participant UC as Use Case
  participant Repo as Repository
  participant DB as Supabase / PostgreSQL

  Build->>SC: generateStaticParams()
  SC->>UC: GetPublishedProjects.execute()
  UC->>Repo: findAll()
  Repo->>DB: query
  DB-->>Repo: rows
  Repo-->>UC: Project[]
  UC-->>SC: Right(ProjectDTO[])
  SC-->>Build: [{ locale, slug }]

  Build->>SC: render page per route
  SC->>UC: GetProjectBySlug.execute({ slug })
  UC->>Repo: findBySlug(slug)
  Repo->>DB: query
  DB-->>Repo: row
  Repo-->>UC: Project entity
  UC-->>SC: Right(ProjectDTO)
  SC-->>Build: static HTML
\`\`\`

A internacionalização é uma ==preocupação de domínio==: \`LocalizedText\` é um value object em \`core\`. O site renderiza em inglês, português e espanhol, tudo resolvido na camada de domínio antes que qualquer componente React toque os dados.

Cada página exporta \`generateMetadata\` com \`title\`, \`description\` e campos \`openGraph\` localizados. Páginas de projetos derivam os dados de OG diretamente das entidades de domínio: título, caption, imagem de capa. Os metadados nunca ficam fora de sincronia com o conteúdo. Uma ==rota de imagem OG== personalizada, construída com \`next/og\` no Edge Runtime, gera cards 1200×630 com identidade visual por página, locale e projeto.

As rotas de detalhe de projeto são orientadas pelo \`Slug\`, um value object em \`core\`, com \`generateStaticParams\` resolvendo cada slug de projeto publicado nas três locales no build time. Sem slug, sem rota.

O formulário de contato passa por rate limiting via Upstash Redis e entrega e-mail pelo Resend, ambos por trás de interfaces de porta que os mantêm ==substituíveis e testáveis sem tocar a infraestrutura==.

Este portfólio é a primeira presença técnica pública que construí e possuo por completo, do modelo de domínio ao pipeline de deploy. O app admin para gerenciamento de conteúdo e o blog estão escopados como pós-MVP, mantendo o site atual focado e publicável.

## Destaques Técnicos

- **Sem camada de API**: Server Components consomem use cases no build time; um site estático não precisa de uma fronteira HTTP entre domínio e HTML
- **Direção de dependência aplicada pelo ESLint**: violações de camada são detectadas no lint time, não no code review

Erros de domínio nunca lançam exceção. O ==padrão Either== propaga \`Left<ValidationError>\` pelos use cases até a UI, mantendo todos os caminhos de erro explícitos e testáveis. O \`LocalizedText\` segue a mesma lógica como value object: i18n é uma preocupação de domínio, então componentes recebem strings já resolvidas, não chaves de tradução.

- **Acessibilidade como sprint**: 88 problemas de WCAG rastreados, escopados e entregues como issues individuais com critérios de aceitação
- **Performance orientada pelo Lighthouse**: bundle crítico enxugado com lazy-loading de formulários pesados, remoção de \`'use client'\` desnecessários e preload da imagem LCP com \`fetchpriority=high\`
- **SEO e Open Graph**: cada página exporta \`generateMetadata\` localizado. Uma rota \`/og\` no Edge Runtime gera cards 1200×630 por página, locale e projeto usando \`next/og\`, com dados de OG derivados das entidades de domínio em vez de strings estáticas

## Tecnologias

- [Next.js](https://nextjs.org): App Router com SSG; \`generateStaticParams\` gera todas as rotas localizadas no build time
- [Turborepo](https://turbo.build): orquestração de monorepo com cinco pacotes compartilhados e cache remoto no Vercel
- [TypeScript](https://www.typescriptlang.org): modo strict em todos os pacotes; \`any\` é proibido
- [Prisma](https://www.prisma.io): ORM e camada de migrations, isolado em \`packages/infra\`
- [Supabase](https://supabase.com): banco de dados PostgreSQL e autenticação baseada em JWT
- [Tailwind CSS](https://tailwindcss.com): tokens de design compartilhados via \`packages/tailwind-config\`
- [next-intl](https://next-intl.dev): roteamento de locale e resolução de mensagens para EN, PT-BR e ES
- [Vitest](https://vitest.dev): testes unitários e de integração em todos os pacotes; ~100 arquivos de teste
- [Upstash Redis](https://upstash.com): rate limiting serverless no formulário de contato
- [Resend](https://resend.com): e-mail transacional para envios do formulário de contato
- [Vercel](https://vercel.com): deployment com cache remoto do Turborepo`,
        `Tras seis años en ingeniería de software, este portafolio fue mi primera oportunidad de ser dueño de un producto completo, desde la arquitectura hasta el deploy. Va más allá de LinkedIn hacia una audiencia internacional, busca oportunidades en el exterior y demuestra que ==Domain-Driven Design y Arquitectura Limpia== se sostienen en un proyecto solo desde cero, no solo en equipos donde el proceso se impone por revisión.

## Las Restricciones

La arquitectura fue autoimpuesta. Sin equipo, sin plazo y sin presión externa, la restricción vino de una decisión deliberada: tratar el proyecto como un producto real con un alcance de MVP, un roadmap post-MVP y sin atajos en la capa de dominio.

El rendimiento fue lo que más pesó. El sitio tenía que resistir el escrutinio de Lighthouse, porque un portafolio lento envía el mensaje equivocado. El contenido también tenía que cambiar sin un deploy, así que las entradas de proyectos y experiencias están ==impulsadas por una base de datos con seed y renderizadas como markdown== en lugar de fijas en el código.

El i18n atravesó ambos frentes. Soportar inglés, portugués y español significaba resolver la internacionalización en la capa de dominio, no parcharla en la UI después.

El diseño visual fue creado íntegramente en Figma por [Milena Kawai](https://www.instagram.com/miilenamayuri/), una amiga diseñadora que entregó la especificación completa desde cero.

## Proceso de Ingeniería

El backlog fue gestionado con **Task Master**, dividido en sprints rastreados como milestones de GitHub. GitHub Projects proporcionó un tablero Kanban para el seguimiento; cada issue seguía un template estructurado con contexto, criterios de aceptación, archivos relevantes y dependencias. Labels personalizadas organizaron el trabajo por sprint, prioridad y tipo.

El proyecto se estructuró en cinco PRDs numerados, uno por capa de arquitectura:

- **Sprint 0**: fundación del dominio (\`core\`): patrón Either, Value Objects, entidades, interfaces de repositorio
- **Sprint 1**: capa de aplicación: use cases, ports, DTOs
- **Sprint 2**: infraestructura: repositorios Prisma, gateway Supabase, contenedor de DI
- **Sprint 3**: sitio público: Next.js App Router, SSG, enrutamiento i18n, componentes de UI
- **Sprint 4**: CI/CD: verificación de tipos, linting y suite de pruebas en GitHub Actions

Un sprint dedicado a accesibilidad resolvió ==88 problemas de WCAG==, seguido de un paso orientado por Lighthouse que apuntó al bundle crítico, hints de preload de RSC y carga de la imagen LCP.

La carpeta \`docs/\` contiene ==12 documentos de arquitectura numerados==: contextos delimitados, estrategia de validación, enfoque de i18n, estrategia de pruebas, patrones de código y glosario de dominio. Se escribieron a medida que el sistema se construía, no después.

## Arquitectura

\`\`\`mermaid
flowchart TD
  site["apps/site\\n(Next.js 16 — SSG)"]
  admin["apps/admin\\n(Next.js — post-MVP)"]
  app["packages/application\\nuse cases · ports · DTOs"]
  core["packages/core\\nentities · VOs · Either · interfaces"]
  infra["packages/infra\\nPrisma · Supabase · Resend · DI"]
  ui["packages/ui\\nView + Control components"]
  utils["packages/utils\\nValidator · formatters · hooks"]
  db[(Supabase / PostgreSQL)]

  site --> app
  admin --> app
  site --> ui
  admin --> ui
  app --> core
  infra --> app
  infra --> core
  infra --> db
  site --> utils
  app --> utils
  core --> utils
\`\`\`

El dominio está organizado en tres contextos delimitados: **portfolio** (proyectos, experiencias, skills, perfil), **identity** (autenticación y usuario) y **contact** (envío de mensajes). Cada uno tiene sus propias entidades, value objects e interfaces de repositorio, compartiendo solo el Shared Kernel.

Cada paquete tiene una única responsabilidad aplicada mecánicamente:

- **\`core\`**: modelo de dominio; cero dependencias de framework; entidades, value objects, patrón Either, interfaces de repositorio
- **\`application\`**: use cases y ports; depende solo de \`core\`; sin Prisma, sin HTTP
- **\`infra\`**: implementaciones concretas; única capa que importa Prisma y Supabase
- **\`ui\`**: biblioteca de componentes React; dividida en \`View\` (visualización) y \`Control\` (interactividad)
- **\`utils\`**: utilidades TypeScript puras: \`Validator\`, formateadores, hooks de browser; sin dependencia de React

## Sitio del Portafolio

==Los Server Components llaman a use cases directamente en el build time==. No existe ninguna capa REST entre el dominio y el HTML generado; para un sitio estático orientado a contenido, un límite HTTP sería overhead puro.

\`\`\`mermaid
sequenceDiagram
  participant Build as Next.js Build
  participant SC as Server Component
  participant UC as Use Case
  participant Repo as Repository
  participant DB as Supabase / PostgreSQL

  Build->>SC: generateStaticParams()
  SC->>UC: GetPublishedProjects.execute()
  UC->>Repo: findAll()
  Repo->>DB: query
  DB-->>Repo: rows
  Repo-->>UC: Project[]
  UC-->>SC: Right(ProjectDTO[])
  SC-->>Build: [{ locale, slug }]

  Build->>SC: render page per route
  SC->>UC: GetProjectBySlug.execute({ slug })
  UC->>Repo: findBySlug(slug)
  Repo->>DB: query
  DB-->>Repo: row
  Repo-->>UC: Project entity
  UC-->>SC: Right(ProjectDTO)
  SC-->>Build: static HTML
\`\`\`

La internacionalización es una ==preocupación de dominio==: \`LocalizedText\` es un value object en \`core\`. El sitio renderiza en inglés, portugués y español, todo resuelto en la capa de dominio antes de que cualquier componente React toque los datos.

Cada página exporta \`generateMetadata\` con campos \`title\`, \`description\` y \`openGraph\` localizados. Las páginas de proyectos derivan los datos de OG directamente de las entidades de dominio: título, caption, imagen de portada. Los metadatos nunca quedan desincronizados con el contenido. Una ==ruta de imagen OG== personalizada, construida con \`next/og\` en el Edge Runtime, genera cards 1200×630 con identidad visual por página, locale y proyecto.

Las rutas de detalle de proyecto están impulsadas por \`Slug\`, un value object en \`core\`, con \`generateStaticParams\` resolviendo cada slug de proyecto publicado en las tres locales en build time. Sin slug, sin ruta.

El formulario de contacto pasa por rate limiting via Upstash Redis y entrega correo electrónico a través de Resend, ambos detrás de interfaces de puerto que los mantienen ==intercambiables y testeables sin tocar la infraestructura==.

Este portafolio es la primera presencia técnica pública que construí y poseo completamente, desde el modelo de dominio hasta el pipeline de deploy. La app admin para gestión de contenido y el blog están previstos como post-MVP, manteniendo el sitio actual enfocado y publicable.

## Aspectos Destacados

- **Sin capa de API**: los Server Components consumen use cases en build time; un sitio estático no necesita un límite HTTP entre dominio y HTML
- **Dirección de dependencia aplicada por ESLint**: las violaciones de capa se detectan en lint time, no en code review

Los errores de dominio nunca lanzan excepción. El ==patrón Either== propaga \`Left<ValidationError>\` por los use cases hasta la UI, manteniendo todos los caminos de error explícitos y testeables. \`LocalizedText\` sigue la misma lógica como value object: i18n es una preocupación de dominio, así que los componentes reciben strings ya resueltos, no claves de traducción.

- **Accesibilidad como sprint**: 88 problemas de WCAG rastreados, acotados y entregados como issues individuales con criterios de aceptación
- **Performance orientada por Lighthouse**: bundle crítico reducido con lazy-loading de formularios pesados, eliminación de \`'use client'\` innecesarios y preload de la imagen LCP con \`fetchpriority=high\`
- **SEO y Open Graph**: cada página exporta \`generateMetadata\` localizado. Una ruta \`/og\` en Edge Runtime genera cards 1200×630 por página, locale y proyecto usando \`next/og\`, con datos de OG derivados de las entidades de dominio en lugar de strings estáticos

## Tecnologías

- [Next.js](https://nextjs.org): App Router con SSG; \`generateStaticParams\` genera todas las rutas localizadas en build time
- [Turborepo](https://turbo.build): orquestación de monorepo con cinco paquetes compartidos y caché remoto en Vercel
- [TypeScript](https://www.typescriptlang.org): modo strict en todos los paquetes; \`any\` está prohibido
- [Prisma](https://www.prisma.io): ORM y capa de migraciones, aislado en \`packages/infra\`
- [Supabase](https://supabase.com): base de datos PostgreSQL y autenticación basada en JWT
- [Tailwind CSS](https://tailwindcss.com): tokens de diseño compartidos via \`packages/tailwind-config\`
- [next-intl](https://next-intl.dev): enrutamiento de locale y resolución de mensajes para EN, PT-BR y ES
- [Vitest](https://vitest.dev): pruebas unitarias e integración en todos los paquetes; ~100 archivos de prueba
- [Upstash Redis](https://upstash.com): rate limiting serverless en el formulario de contacto
- [Resend](https://resend.com): correo electrónico transaccional para envíos del formulario de contacto
- [Vercel](https://vercel.com): deployment con caché remoto de Turborepo`,
      ),
      featured: true,
      status: 'PUBLISHED' as const,
      weight: 90,
      repositoryUrl: 'https://github.com/wallace-sf/portfolio',
      periodStart: new Date('2024-01-01'),
      periodEnd: null,
      skillIds: [
        ID.skills.typescript,
        ID.skills.react,
        ID.skills.nextjs,
        ID.skills.nodejs,
        ID.skills.postgresql,
        ID.skills.tailwindcss,
        ID.skills.cicd,
        ID.skills.prisma,
        ID.skills.supabase,
      ],
      relatedProjectSlugs: ['b2b-ecommerce-platform'],
    },
    {
      id: ID.projects.b2bEcommerce,
      slug: 'b2b-ecommerce-platform',
      coverImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-cover.webp',
      coverImageAlt: loc(
        'TC Representações home: public landing page and gated login portal',
        'Home da TC Representações: landing page pública e portal de acesso restrito',
        'Home de TC Representações: landing page pública y portal de acceso restringido',
      ),
      thumbnailImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-thumbnail.webp',
      thumbnailImageAlt: loc(
        'TC Representações B2B platform: gated wholesale storefront for construction materials',
        'Plataforma B2B TC Representações: loja atacadista restrita para materiais de construção',
        'Plataforma B2B TC Representações: tienda mayorista restringida para materiales de construcción',
      ),
      title: loc('B2B E-Commerce Platform', 'Plataforma B2B de E-Commerce', 'Plataforma B2B de E-Commerce'),
      caption: loc(
        'Full-stack B2B platform for construction materials, built with Clean Architecture, React, and Node.js, from greenfield to production.',
        'Plataforma B2B full-stack para materiais de construção, com Arquitetura Limpa, React e Node.js, do zero à produção.',
        'Plataforma B2B full-stack para materiales de construcción, con Arquitectura Limpia, React y Node.js, de cero a producción.',
      ),
      content: loc(
        `[TC Representações](https://tcrepresentacoes.com.br) is a B2B wholesale platform for construction materials, built for Thiago Carvalho, an independent commercial representative from Mococa, SP who manages partnerships with six brands: Avant, Colson, Irwin, Kalipso EPI, Marluvas, and Termolar. The platform is a deliberate hybrid: a public institutional site for any visitor, and a ==gated private storefront== where access to pricing requires owner approval.

## The Constraints

- Solo greenfield project with no design system, no existing codebase, and a strict infrastructure budget
- B2B pricing carries business rules more complex than a standard e-commerce model, requiring a purpose-built pricing engine
- The catalog spans ~2,000 SKUs across multiple brands and must support large bulk updates
- Retailer access is intentionally restricted, protecting negotiated prices from competitor visibility

## Storefront

Built the complete SPA with React 18 and Vite:

- Public side: landing page, brand showcase, and contact form, visible to any visitor

![TC Representações home: public landing page and gated login portal](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-hero.webp)

*Home page: institutional content for public visitors, login for approved retailers*

![The six represented brands, listed on the public institutional site](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-representadas.webp)

*Brand showcase: public page listing the six represented brands, open to any visitor*

- Gated side: registration with email confirmation, manual owner activation, then access to the full catalog

![Three-step retailer registration form requiring business credentials and owner approval](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-cadastro.webp)

*Retailer registration: business credentials collected up front, activation held for owner approval*

- Infinite-scroll product catalog segmented by brand, restricted to authenticated and approved retailers
- Cart → Quote → Order flow with per-brand separation and automatic quote expiration

## API & Backend

Designed the REST API following ==Clean Architecture== with a DDD-inspired domain layer:

- Custom pricing engine built to reflect the business's specific B2B rules; prices are computed at quote time from per-customer configurations
- Reliable bulk product import pipeline built to handle large catalog updates
- Deployed on AWS with Docker, product images served through CloudFront CDN

## Technologies

- [React](https://react.dev) + [Vite](https://vitejs.dev): SPA storefront and gated customer portal
- [Redux Toolkit](https://redux-toolkit.js.org) + [React Query](https://tanstack.com/query/latest): auth state and server-state management with caching
- [Node.js](https://nodejs.org) + [Express](https://expressjs.com): REST API with Clean Architecture layering
- [TypeORM](https://typeorm.io) + [PostgreSQL](https://www.postgresql.org): persistence with repository pattern
- [AWS S3](https://aws.amazon.com/s3/) + [CloudFront](https://aws.amazon.com/cloudfront/): product image storage and CDN delivery
- [Docker](https://www.docker.com): containerized deployment on EC2
- [Sentry](https://sentry.io): production error tracking`,
        `[TC Representações](https://tcrepresentacoes.com.br) é uma plataforma B2B de materiais de construção para Thiago Carvalho, representante comercial independente de Mococa, SP, com parcerias em seis marcas: Avant, Colson, Irwin, Kalipso EPI, Marluvas e Termolar. A plataforma é um híbrido intencional: um site institucional público para qualquer visitante, e uma ==loja privada restrita== onde o acesso aos preços depende de aprovação do dono.

## As Restrições

- Projeto greenfield solo sem design system, sem base de código existente e com orçamento de infraestrutura restrito
- A precificação B2B carrega regras de negócio mais complexas do que um e-commerce convencional, exigindo um motor de precificação sob medida
- O catálogo abrange ~2.000 SKUs em múltiplas marcas e precisa suportar atualizações em massa de grande volume
- O acesso de lojistas é intencionalmente restrito, protegendo os preços negociados da visibilidade de concorrentes

## Vitrine

Construí o SPA completo com React 18 e Vite:

- Lado público: landing page, vitrine de marcas e formulário de contato, visível para qualquer visitante

![Home da TC Representações: landing page pública e portal de acesso restrito](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-hero.webp)

*Página inicial: conteúdo institucional para visitantes públicos, login para lojistas aprovados*

![As seis marcas representadas, listadas no site institucional público](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-representadas.webp)

*Vitrine de marcas: página pública que lista as seis marcas representadas, aberta a qualquer visitante*

- Lado restrito: cadastro com confirmação por e-mail, ativação manual pelo dono e acesso ao catálogo completo

![Formulário de cadastro de lojista em três etapas com dados empresariais e aprovação manual](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-cadastro.webp)

*Cadastro de lojista: dados empresariais coletados no início, ativação pendente de aprovação do dono*

- Catálogo com scroll infinito segmentado por marca, restrito a lojistas autenticados e aprovados
- Fluxo Carrinho → Orçamento → Pedido com separação por marca e expiração automática do orçamento

## API & Backend

Projetei a API REST seguindo ==Arquitetura Limpa== com camada de domínio inspirada em DDD:

- Motor de precificação sob medida que reflete as regras B2B do negócio; preços calculados no momento do orçamento a partir de configurações por cliente
- Pipeline de importação em massa construído para suportar atualizações de catálogo de grande volume com confiabilidade
- Implantado na AWS com Docker, imagens de produtos servidas via CloudFront CDN

## Tecnologias

- [React](https://react.dev) + [Vite](https://vitejs.dev): vitrine SPA e portal restrito para clientes
- [Redux Toolkit](https://redux-toolkit.js.org) + [React Query](https://tanstack.com/query/latest): estado de autenticação e estado de servidor com cache
- [Node.js](https://nodejs.org) + [Express](https://expressjs.com): API REST com camadas de Arquitetura Limpa
- [TypeORM](https://typeorm.io) + [PostgreSQL](https://www.postgresql.org): persistência com padrão repository
- [AWS S3](https://aws.amazon.com/s3/) + [CloudFront](https://aws.amazon.com/cloudfront/): armazenamento de imagens e CDN
- [Docker](https://www.docker.com): implantação containerizada no EC2
- [Sentry](https://sentry.io): rastreamento de erros em produção`,
        `[TC Representações](https://tcrepresentacoes.com.br) es una plataforma B2B de materiales de construcción para Thiago Carvalho, representante comercial independiente de Mococa, SP, con alianzas en seis marcas: Avant, Colson, Irwin, Kalipso EPI, Marluvas y Termolar. La plataforma es un híbrido intencional: un sitio institucional público para cualquier visitante, y una ==tienda privada restringida== donde el acceso a los precios requiere aprobación del dueño.

## Las Restricciones

- Proyecto greenfield en solitario sin design system, sin base de código existente y con un presupuesto de infraestructura ajustado
- La tarificación B2B lleva reglas de negocio más complejas que un e-commerce convencional, requiriendo un motor de precios a medida
- El catálogo abarca ~2.000 SKUs en múltiples marcas y debe soportar actualizaciones masivas de gran volumen
- El acceso de minoristas es intencionalmente restringido, protegiendo los precios negociados de la visibilidad de la competencia

## Vitrina

Construí el SPA completo con React 18 y Vite:

- Lado público: landing page, vitrina de marcas y formulario de contacto, visible para cualquier visitante

![Home de TC Representações: landing page pública y portal de acceso restringido](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-hero.webp)

*Página de inicio: contenido institucional para visitantes públicos, login para minoristas aprobados*

![Las seis marcas representadas, listadas en el sitio institucional público](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-representadas.webp)

*Vitrina de marcas: página pública que lista las seis marcas representadas, abierta a cualquier visitante*

- Lado restringido: registro con confirmación por correo, activación manual por el dueño y acceso al catálogo completo

![Formulario de registro de minoristas en tres pasos con datos empresariales y aprobación manual](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/b2b-ecommerce/b2b-cadastro.webp)

*Registro de minoristas: datos empresariales recogidos al inicio, activación pendiente de aprobación del dueño*

- Catálogo con scroll infinito segmentado por marca, restringido a minoristas autenticados y aprobados
- Flujo Carrito → Presupuesto → Pedido con separación por marca y vencimiento automático del presupuesto

## API & Backend

Diseñé la API REST siguiendo ==Arquitectura Limpia== con una capa de dominio inspirada en DDD:

- Motor de precios a medida que refleja las reglas B2B del negocio; precios calculados al generar el presupuesto a partir de configuraciones por cliente
- Pipeline de importación masiva construido para soportar actualizaciones de catálogo de gran volumen con confiabilidad
- Desplegado en AWS con Docker, imágenes de productos servidas vía CloudFront CDN

## Tecnologías

- [React](https://react.dev) + [Vite](https://vitejs.dev): SPA de vitrina y portal restringido para clientes
- [Redux Toolkit](https://redux-toolkit.js.org) + [React Query](https://tanstack.com/query/latest): estado de autenticación y estado de servidor con caché
- [Node.js](https://nodejs.org) + [Express](https://expressjs.com): API REST con capas de Arquitectura Limpia
- [TypeORM](https://typeorm.io) + [PostgreSQL](https://www.postgresql.org): persistencia con patrón repository
- [AWS S3](https://aws.amazon.com/s3/) + [CloudFront](https://aws.amazon.com/cloudfront/): almacenamiento de imágenes y CDN
- [Docker](https://www.docker.com): despliegue en contenedor en EC2
- [Sentry](https://sentry.io): seguimiento de errores en producción`,
      ),
      featured: true,
      status: 'PUBLISHED' as const,
      weight: 80,
      projectUrl: 'https://tcrepresentacoes.com.br',
      periodStart: new Date('2021-12-01'),
      periodEnd: new Date('2024-08-31'),
      skillIds: [
        ID.skills.typescript,
        ID.skills.react,
        ID.skills.vite,
        ID.skills.nodejs,
        ID.skills.postgresql,
        ID.skills.aws,
        ID.skills.docker,
        ID.skills.tailwindcss,
      ],
      relatedProjectSlugs: ['personal-portfolio'],
    },
    {
      id: ID.projects.galaxiesSurveyBuilder,
      slug: 'galaxies-survey-builder',
      coverImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/game-intelligence-platform/game-intelligence-platform-cover.svg?v=2',
      coverImageAlt: loc(
        'Galaxies Survey Builder: backoffice survey builder, built with React, Material UI and GraphQL',
        'Galaxies Survey Builder: construtor de pesquisas no backoffice da Galaxies, com React, Material UI e GraphQL',
        'Galaxies Survey Builder: constructor de encuestas en el backoffice de Galaxies, con React, Material UI y GraphQL',
      ),
      thumbnailImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/game-intelligence-platform/game-intelligence-platform-thumbnail.svg?v=2',
      thumbnailImageAlt: loc(
        'Galaxies Survey Builder thumbnail: backoffice survey builder rewrite',
        'Thumbnail do Galaxies Survey Builder: reescrita do construtor de pesquisas',
        'Thumbnail de Galaxies Survey Builder: reescritura del constructor de encuestas',
      ),
      title: loc(
        'Galaxies Survey Builder',
        'Galaxies Survey Builder',
        'Galaxies Survey Builder',
      ),
      caption: loc(
        'A game research platform backoffice rebuilt from scratch in three weeks: full schema compatibility, surgical state management, and admins who no longer needed a developer to do their job.',
        'Backoffice de uma plataforma de pesquisa de games reescrito do zero em três semanas: compatibilidade total de schema, gerenciamento de estado cirúrgico e administradores que pararam de depender do desenvolvedor.',
        'Backoffice de una plataforma de investigación de videojuegos reescrito desde cero en tres semanas: compatibilidad total de esquema, gestión de estado quirúrgica y administradores que dejaron de depender del desarrollador.',
      ),
      content: loc(
        `Galaxies was building a research intelligence platform for the Brazilian gaming industry, aggregating survey responses from gamers and turning them into market insights for studios and publishers. The backoffice that powered that research depended on a survey builder that had grown fragile: administrators had to guess at the interface or loop in the original developer to understand how it worked.

I was brought in to own the full rewrite of that survey builder, from v1 to v2, against a ==three-week deadline== with a fully remote team of five.

## The Constraints

The v1 builder had an established schema already in use across every existing survey. Any rewrite had to maintain ==full backward compatibility==: forms already saved in the database had to load correctly in the new UI, and anything new had to remain parseable by the same downstream form renderer. Changing the schema was off the table.

The v1 implementation also loaded and tracked too much state in bulk, which caused performance issues as forms grew. That had to be solved without breaking anything upstream or downstream.

## Backoffice

### Rebuilding the survey builder

Designed and built the v2 survey builder from scratch. The page let administrators configure every aspect of a research question dynamically: category, image, caption, question type (free text, multi-select, and others), accessibility metadata, and i18n strings, all in a single interface.

==I redesigned the state model to be surgical==, tracking only what was actively being edited rather than holding the entire form in memory. The architecture drew from patterns built at FDTE for similar form-heavy interfaces. It favored simplicity and predictability over generality.

The hardest constraint was schema compatibility: new output had to be parseable by the existing renderer, while every form already in the database loaded correctly without migration.

The v2 shipped to production within the deadline. The most meaningful outcome was usability: ==administrators could configure surveys independently== without asking the developer who wrote v1 what the fields meant.

## Technologies

- [React](https://react.dev): component tree for the dynamic survey builder
- [Material UI](https://mui.com): design system used throughout the backoffice UI
- [GraphQL](https://graphql.org): queries and mutations for loading and persisting survey configurations
- [TypeScript](https://www.typescriptlang.org): end-to-end type safety across the form schema

## Technical Highlights

Backward compatibility was the main design driver: the new UI had to produce output parseable by the existing renderer and load every legacy form without migration. On top of that, ==v1 held the entire form in memory==; the rewrite tracked only the active edit scope, which is what actually fixed the performance issues that made the old builder slow on complex surveys.

- **Architecture from prior patterns**: modeled after form systems built at FDTE, favoring a simple, predictable structure over a generic one`,
        `A Galaxies construía uma plataforma de inteligência de dados para a indústria brasileira de games, agregando respostas de gamers e transformando-as em insights de mercado para estúdios e publishers. O backoffice que sustentava essa pesquisa dependia de um construtor de formulários que havia se tornado frágil: administradores precisavam adivinhar o comportamento da interface ou consultar o desenvolvedor original para entender como funcionava.

Entrei no projeto para assumir a reescrita completa desse construtor, da v1 para a v2, com um ==prazo de três semanas== e um time completamente remoto de cinco pessoas.

## Os Desafios

O construtor v1 tinha um schema já em uso em todas as pesquisas existentes. Qualquer reescrita precisava manter ==compatibilidade total com versões anteriores==: formulários já salvos no banco deveriam carregar corretamente na nova UI, e tudo que fosse gerado precisava continuar sendo lido pelo mesmo renderizador de formulários. Alterar o schema estava fora de cogitação.

A implementação v1 também carregava e rastreava estado em massa, o que causava problemas de performance conforme os formulários cresciam. Isso precisava ser resolvido sem quebrar nada upstream ou downstream.

## Backoffice

### Reconstruindo o construtor de pesquisas

Projetei e construí o construtor v2 do zero. A página permitia que administradores configurassem dinamicamente cada aspecto de uma pergunta de pesquisa: categoria, imagem, caption, tipo de pergunta (texto corrido, multi seleção e outros), metadados de acessibilidade e strings de i18n, tudo em uma única interface.

==Redesenhei o modelo de estado para ser cirúrgico==, rastreando apenas o que estava sendo ativamente editado em vez de manter o formulário inteiro em memória. A arquitetura foi baseada em padrões construídos na FDTE para interfaces de formulários dinâmicos similares. Priorizou simplicidade e previsibilidade em vez de generalidade.

O desafio mais difícil foi a compatibilidade de schema: o output gerado pela nova UI precisava ser parseável pelo renderizador existente, enquanto todos os formulários já no banco carregavam corretamente sem migração.

A v2 foi para produção dentro do prazo. O resultado mais significativo foi a usabilidade: ==administradores passaram a configurar pesquisas de forma independente==, sem precisar perguntar ao desenvolvedor que escreveu a v1 o que cada campo significava.

## Tecnologias

- [React](https://react.dev): árvore de componentes do construtor de pesquisas dinâmico
- [Material UI](https://mui.com): sistema de design usado na UI do backoffice
- [GraphQL](https://graphql.org): queries e mutations para carregar e persistir configurações de pesquisa
- [TypeScript](https://www.typescriptlang.org): tipagem fim a fim em todo o schema de formulários

## Destaques Técnicos

A compatibilidade retroativa foi o principal driver de design: a nova UI precisava produzir output parseável pelo renderizador existente e carregar todos os formulários legados sem migração. Além disso, ==a v1 mantinha o formulário inteiro em memória==; a reescrita passou a rastrear apenas o escopo de edição ativo, o que resolveu de fato os problemas de performance que tornavam o construtor antigo lento em pesquisas complexas.

- **Arquitetura baseada em padrões anteriores**: modelada a partir de sistemas de formulários construídos na FDTE, priorizando uma estrutura simples e previsível`,
        `Galaxies construía una plataforma de inteligencia de datos para la industria brasileña de videojuegos, agregando respuestas de gamers y convirtiéndolas en insights de mercado para estudios y publishers. El backoffice que sustentaba esa investigación dependía de un constructor de formularios que se había vuelto frágil: los administradores tenían que adivinar el comportamiento de la interfaz o consultar al desarrollador original para entender cómo funcionaba.

Me incorporé al proyecto para asumir la reescritura completa de ese constructor, de v1 a v2, con un ==plazo de tres semanas== y un equipo completamente remoto de cinco personas.

## Las Restricciones

El constructor v1 tenía un esquema ya en uso en todas las encuestas existentes. Cualquier reescritura debía mantener ==compatibilidad total con versiones anteriores==: los formularios ya guardados en la base de datos debían cargarse correctamente en la nueva UI, y todo lo generado debía seguir siendo legible por el mismo renderizador de formularios. Cambiar el esquema no era una opción.

La implementación v1 también cargaba y rastreaba estado en masa, lo que causaba problemas de performance a medida que los formularios crecían. Eso debía resolverse sin romper nada upstream ni downstream.

## Backoffice

### Reconstruyendo el constructor de encuestas

Diseñé y construí el constructor v2 desde cero. La página permitía a los administradores configurar dinámicamente cada aspecto de una pregunta de investigación: categoría, imagen, caption, tipo de pregunta (texto libre, selección múltiple y otros), metadatos de accesibilidad y strings de i18n, todo en una sola interfaz.

==Rediseñé el modelo de estado para ser quirúrgico==, rastreando solo lo que se estaba editando activamente en lugar de mantener el formulario entero en memoria. La arquitectura se basó en patrones construidos en FDTE para interfaces de formularios dinámicos similares. Priorizó simplicidad y previsibilidad sobre generalidad.

El desafío más difícil fue la compatibilidad de esquema: el output generado por la nueva UI debía ser parseable por el renderizador existente, mientras que todos los formularios ya en la base de datos se cargaban correctamente sin migración.

La v2 llegó a producción dentro del plazo. El resultado más significativo fue la usabilidad: ==los administradores podían configurar encuestas de forma independiente==, sin necesidad de preguntar al desarrollador que escribió la v1 qué significaba cada campo.

## Tecnologías

- [React](https://react.dev): árbol de componentes para el constructor de encuestas dinámico
- [Material UI](https://mui.com): sistema de diseño usado en la UI del backoffice
- [GraphQL](https://graphql.org): queries y mutations para cargar y persistir configuraciones de encuestas
- [TypeScript](https://www.typescriptlang.org): tipado de extremo a extremo en todo el esquema de formularios

## Aspectos Técnicos Destacados

La compatibilidad retroactiva fue el principal driver de diseño: la nueva UI debía producir output parseable por el renderizador existente y cargar todos los formularios legados sin migración. Además, ==la v1 mantenía el formulario entero en memoria==; la reescritura pasó a rastrear solo el alcance de edición activo, lo que resolvió de verdad los problemas de performance que hacían lento al constructor antiguo en encuestas complejas.

- **Arquitectura basada en patrones anteriores**: modelada a partir de sistemas de formularios construidos en FDTE, priorizando una estructura simple y predecible`,
      ),
      featured: false,
      status: 'PUBLISHED' as const,
      weight: 50,
      projectUrl: 'https://www.galaxies.com.br/',
      periodStart: new Date('2023-10-01'),
      periodEnd: new Date('2023-12-31'),
      skillIds: [ID.skills.typescript, ID.skills.react, ID.skills.graphql],
      relatedProjectSlugs: [],
    },
    {
      id: ID.projects.buyrShopifyApp,
      slug: 'buyr-shopify-app',
      coverImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/buyr-cover.webp',
      coverImageAlt: loc(
        'Buyr Shopify app: interactive pricing and AI offer negotiation',
        'App Buyr para Shopify: precificação interativa e negociação de ofertas por IA',
        'App Buyr para Shopify: precios interactivos y negociación de ofertas por IA',
      ),
      thumbnailImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/buyr-thumbnail.webp',
      thumbnailImageAlt: loc(
        'Buyr Shopify app thumbnail',
        'Thumbnail do app Buyr para Shopify',
        'Thumbnail de la app Buyr para Shopify',
      ),
      title: loc('Buyr: Shopify App', 'Buyr: App para Shopify', 'Buyr: App para Shopify'),
      caption: loc(
        'A public Shopify app with AI-powered offer negotiation, built across storefront and merchant admin with a focus on performance, isolation, and polish.',
        'App público da Shopify com negociação de ofertas por IA, construído no storefront e no admin do merchant com foco em performance, isolamento e polimento.',
        'App público de Shopify con negociación de ofertas por IA, construido en el storefront y el admin del merchant con foco en performance, aislamiento y polish.',
      ),
      content: loc(
        `[Buyr](https://apps.shopify.com/buyr) is a public Shopify app that lets shoppers set their own price or negotiate with an AI agent, ==capturing orders that would otherwise be lost at full price==. Merchants configure profitability thresholds; Buyr handles the negotiation automatically.

I was brought in to solve an animation problem no one on the team had tackled before, and ended up contributing across both sides of the product: the storefront experience buyers see and the merchant admin dashboard. Working with a distributed team across Brazil and the United States, we delivered the MVP against a fixed deadline, followed by a post-MVP improvement phase.

## The Constraints

The app runs embedded inside any Shopify storefront theme, with no control over the host's CSS, JavaScript environment, or component structure. A merchant running a minimalist theme and another running a custom brand theme would silently break the same widget in different ways.

On top of that, ==Shopify's own acceptance criteria imposed strict performance thresholds the app had to meet to stay listed in the App Store==. Performance wasn't optional.

![Interactive price input and AI negotiation chat interface](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/storefront-widget.webp)

*The storefront widget: interactive price input with AI negotiation chat.*

## Storefront

### Rebuilding the animation system

The storefront widget had an animation system, but only as compiled vanilla JavaScript with no readable source. ==I reverse-engineered the behavior visually and rebuilt it from scratch using **Framer Motion**==, making it a proper state-driven system connected to the offer lifecycle:

- **Idle**: ambient animated circles while the shopper browses
- **In progress**: active animation while the offer is being created
- **Success**: confetti burst with a yellow checkmark circle
- **Existing offer**: distinct animation state for returning shoppers

State was managed via React Context API, flowing through the entire storefront component tree.

### Solving CSS isolation with Shadow DOM

While testing across different Shopify themes, I found that merchant CSS would leak into the widget and break the layout in unpredictable ways. ==I investigated the root cause, identified Shadow DOM as the right boundary, and implemented it to fully isolate the app's styles== from whatever the host storefront was doing. Nobody asked for that fix. I made the call myself after diagnosing the problem.

### Performance improvements

Meeting Shopify's App Store performance requirements meant treating performance as a deliverable, not an afterthought. I studied comparable apps in the store, tracked metrics in a spreadsheet, and drove the following improvements:

- **On-demand rendering**: only mount the widget when it's actually needed
- **Dead code removal**: stripped unused dependencies and unreachable branches
- **Offer flow simplification**: reduced steps and component depth in the critical path
- **Refactoring**: replaced inefficient loops, over-engineered hooks, and global state misuse

## Merchant Admin

![Real-time offer management dashboard for merchants](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/offer-management-dashboard.webp)

*Real-time offer management: merchants see and act on incoming offers as they arrive.*

On the merchant side, I built the offer acceptance flow first: a pixel-perfect implementation of how merchants review and accept incoming offers. Two more screens followed using **Shopify Polaris**:

- **Analytics screen**: dashboard giving merchants visibility into received vs. accepted offers over time
- **Onboarding / welcome screen**: guided setup experience for merchants installing the app for the first time

![Custom pricing models configuration screen](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/custom-pricing-models.webp)

*Custom pricing models: merchants define thresholds and discount rules per product.*

## Technical Highlights

The storefront and merchant admin live in one monorepo built with npm workspaces, kept as fully separate apps (Vite + Tailwind on one side, Shopify Polaris on the other). ==Framer Motion== drives a multi-state, choreographed animation system through React Context API, while Shadow DOM keeps CSS isolated across unpredictable storefront host environments.

- **Shopify App Bridge**, **Theme App Extensions**, and **Storefront API**, learned and applied in full across both contexts
- **Fixed deadline** delivery with a structured post-MVP improvement phase

## Technologies

- [React](https://react.dev): storefront widget and merchant admin UI; state managed via Context API across both apps
- [Framer Motion](https://www.framer.com/motion/): multi-state animation system for the offer lifecycle (idle, in progress, success, existing offer)
- [Shopify Polaris](https://polaris.shopify.com): component library for the three merchant admin screens
- [Tailwind CSS](https://tailwindcss.com): storefront widget styling, scoped inside Shadow DOM
- [Vite](https://vitejs.dev): storefront bundler; critical for the performance optimizations that met App Store requirements
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge): session management and Shopify admin integration
- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions): delivery mechanism for the storefront widget into merchant themes
- [Storefront API](https://shopify.dev/docs/api/storefront): Shopify product and cart data access
- [TypeScript](https://www.typescriptlang.org): type safety across both apps
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces): monorepo keeping storefront and admin as separate packages`,
        `[Buyr](https://apps.shopify.com/buyr) é um app público da Shopify que permite compradores definir seu próprio preço ou negociar com um agente de IA, ==capturando pedidos que de outra forma seriam perdidos ao preço cheio==. Merchants configuram limites de lucratividade; o Buyr cuida da negociação automaticamente.

Fui convidado para resolver um problema de animação que ninguém no time havia enfrentado antes, e acabei contribuindo nos dois lados do produto: a experiência do storefront vista pelos compradores e o painel de administração dos merchants. Trabalhando com um time distribuído entre Brasil e Estados Unidos, entregamos o MVP dentro de um prazo fixo, seguido por uma fase de melhorias pós-MVP.

## As Restrições

O app roda incorporado dentro de qualquer tema de storefront da Shopify, sem controle sobre o CSS, o ambiente JavaScript ou a estrutura de componentes do host. Um merchant usando um tema minimalista e outro com um tema de marca customizado poderiam quebrar o mesmo widget de formas silenciosas e diferentes.

Além disso, ==os próprios critérios de aceitação da Shopify impõem limites rígidos de performance que o app precisava atingir para permanecer listado na App Store==. Performance não era opcional.

![Interface de entrada de preço interativa e chat de negociação por IA](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/storefront-widget.webp)

*O widget do storefront: entrada de preço interativa com chat de negociação por IA.*

## Storefront

### Reconstruindo o sistema de animações

O widget do storefront tinha um sistema de animações, mas apenas como JavaScript vanilla compilado, sem código-fonte legível. ==Fiz engenharia reversa do comportamento visualmente e o reconstruí do zero usando **Framer Motion**==, transformando-o em um sistema orientado a estado conectado ao ciclo de vida das ofertas:

- **Idle**: círculos animados em segundo plano enquanto o comprador navega
- **Em andamento**: animação ativa enquanto a oferta é criada
- **Sucesso**: explosão de confetes com um círculo de marcação amarela
- **Oferta existente**: estado de animação distinto para compradores que retornam

O estado era gerenciado via React Context API, fluindo por toda a árvore de componentes do storefront.

### Resolvendo o isolamento de CSS com Shadow DOM

Ao testar em diferentes temas da Shopify, descobri que o CSS dos merchants vazava para dentro do widget e quebrava o layout de formas imprevisíveis. ==Investiguei a causa raiz, identifiquei o Shadow DOM como o limite correto e o implementei para isolar completamente os estilos do app== de qualquer coisa que o storefront host estivesse fazendo. Ninguém pediu esse ajuste. Tomei a decisão sozinho depois de diagnosticar o problema.

### Melhorias de performance

Atender aos requisitos de performance da App Store da Shopify significou tratar performance como um entregável, não como um detalhe. Estudei apps comparáveis na loja, rastreei métricas em uma planilha e conduzi as seguintes melhorias:

- **Renderização sob demanda**: montar o widget apenas quando realmente necessário
- **Remoção de código morto**: eliminação de dependências não utilizadas e ramificações inacessíveis
- **Simplificação do fluxo de oferta**: redução de etapas e profundidade de componentes no caminho crítico
- **Refatoração**: substituição de loops ineficientes, hooks super-engenheirados e uso indevido de estado global

## Administração dos Merchants

![Painel de gerenciamento de ofertas em tempo real para merchants](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/offer-management-dashboard.webp)

*Gerenciamento de ofertas em tempo real: merchants veem e agem sobre as ofertas recebidas conforme chegam.*

No lado dos merchants, construí primeiro o fluxo de aceitação de ofertas: uma implementação pixel-perfect de como merchants revisam e aceitam ofertas recebidas. Depois vieram mais duas telas usando **Shopify Polaris**:

- **Tela de analytics**: painel que dá aos merchants visibilidade sobre ofertas recebidas vs. aceitas ao longo do tempo
- **Tela de onboarding / boas-vindas**: experiência guiada de configuração para merchants instalando o app pela primeira vez

![Tela de configuração de modelos de precificação personalizados](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/custom-pricing-models.webp)

*Modelos de precificação personalizados: merchants definem limites e regras de desconto por produto.*

## Destaques Técnicos

O storefront e o admin dos merchants vivem em um único monorepo com npm workspaces, mantidos como apps completamente separados (Vite + Tailwind de um lado, Shopify Polaris do outro). O ==Framer Motion== conduz um sistema de animação com múltiplos estados e coreografia via React Context API, enquanto o Shadow DOM mantém o CSS isolado em ambientes de storefront imprevisíveis.

- **Shopify App Bridge**, **Theme App Extensions** e **Storefront API**, aprendidos e aplicados integralmente em ambos os contextos
- **Entrega dentro do prazo fixo** com uma fase estruturada de melhorias pós-MVP

## Tecnologias

- [React](https://react.dev): widget do storefront e UI do admin dos merchants; estado gerenciado via Context API em ambos os apps
- [Framer Motion](https://www.framer.com/motion/): sistema de animação com múltiplos estados para o ciclo de vida das ofertas (idle, em andamento, sucesso, oferta existente)
- [Shopify Polaris](https://polaris.shopify.com): biblioteca de componentes para as três telas do admin dos merchants
- [Tailwind CSS](https://tailwindcss.com): estilização do widget do storefront, escopada dentro do Shadow DOM
- [Vite](https://vitejs.dev): bundler do storefront; decisivo para as otimizações de performance que atenderam os requisitos da App Store
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge): gerenciamento de sessão e integração com o admin da Shopify
- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions): mecanismo de entrega do widget do storefront nos temas dos merchants
- [Storefront API](https://shopify.dev/docs/api/storefront): acesso a dados de produtos e carrinho da Shopify
- [TypeScript](https://www.typescriptlang.org): tipagem estática em ambos os apps
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces): monorepo mantendo storefront e admin como pacotes separados`,
        `[Buyr](https://apps.shopify.com/buyr) es una app pública de Shopify que permite a los compradores fijar su propio precio o negociar con un agente de IA, ==capturando pedidos que de otro modo se perderían al precio completo==. Los merchants configuran umbrales de rentabilidad; Buyr gestiona la negociación automáticamente.

Fui convocado para resolver un problema de animación que nadie en el equipo había abordado antes, y terminé contribuyendo en ambos lados del producto: la experiencia del storefront que ven los compradores y el panel de administración de merchants. Trabajando con un equipo distribuido entre Brasil y Estados Unidos, entregamos el MVP en un plazo fijo, seguido de una fase de mejoras post-MVP.

## Las Restricciones

La app se ejecuta integrada dentro de cualquier tema de storefront de Shopify, sin control sobre el CSS, el entorno JavaScript o la estructura de componentes del host. Un merchant con un tema minimalista y otro con un tema de marca personalizado podrían romper el mismo widget de formas silenciosas y distintas.

Además, ==los propios criterios de aceptación de Shopify imponen umbrales de rendimiento estrictos que la app debía cumplir para mantenerse en la App Store==. El rendimiento no era opcional.

![Interfaz de entrada de precio interactiva y chat de negociación con IA](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/storefront-widget.webp)

*El widget del storefront: entrada de precio interactiva con chat de negociación por IA.*

## Storefront

### Reconstruyendo el sistema de animaciones

El widget del storefront tenía un sistema de animaciones, pero solo como JavaScript vanilla compilado, sin código fuente legible. ==Realicé ingeniería inversa del comportamiento visualmente y lo reconstruí desde cero usando **Framer Motion**==, convirtiéndolo en un sistema orientado a estados conectado al ciclo de vida de las ofertas:

- **Idle**: círculos animados en segundo plano mientras el comprador navega
- **En progreso**: animación activa mientras se crea la oferta
- **Éxito**: explosión de confeti con un círculo de verificación amarillo
- **Oferta existente**: estado de animación distinto para compradores que regresan

El estado se gestionó mediante React Context API, fluyendo por todo el árbol de componentes del storefront.

### Resolviendo el aislamiento de CSS con Shadow DOM

Al probar en distintos temas de Shopify, descubrí que el CSS de los merchants se filtraba al widget y rompía el diseño de formas impredecibles. ==Investigué la causa raíz, identifiqué Shadow DOM como el límite correcto y lo implementé para aislar completamente los estilos de la app== de lo que hiciera el storefront anfitrión. Nadie pidió ese ajuste. Tomé la decisión yo mismo tras diagnosticar el problema.

### Mejoras de rendimiento

Cumplir los requisitos de rendimiento de la App Store de Shopify significó tratar el rendimiento como un entregable, no como un detalle. Estudié apps comparables en la tienda, rastreé métricas en una hoja de cálculo e impulsé las siguientes mejoras:

- **Renderizado bajo demanda**: montar el widget solo cuando realmente se necesita
- **Eliminación de código muerto**: eliminación de dependencias no utilizadas y ramas inalcanzables
- **Simplificación del flujo de oferta**: reducción de pasos y profundidad de componentes en el camino crítico
- **Refactorización**: reemplazo de bucles ineficientes, hooks sobre-diseñados y mal uso del estado global

## Administración de Merchants

![Panel de gestión de ofertas en tiempo real para merchants](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/offer-management-dashboard.webp)

*Gestión de ofertas en tiempo real: los merchants ven y actúan sobre las ofertas entrantes a medida que llegan.*

En el lado de los merchants, construí primero el flujo de aceptación de ofertas: una implementación pixel-perfect de cómo los merchants revisan y aceptan las ofertas entrantes. Luego llegaron dos pantallas más usando **Shopify Polaris**:

- **Pantalla de analytics**: panel que da a los merchants visibilidad sobre las ofertas recibidas vs. aceptadas a lo largo del tiempo
- **Pantalla de onboarding / bienvenida**: experiencia guiada de configuración para merchants que instalan la app por primera vez

![Pantalla de configuración de modelos de precios personalizados](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/buyr/custom-pricing-models.webp)

*Modelos de precios personalizados: los merchants definen umbrales y reglas de descuento por producto.*

## Aspectos Técnicos Destacados

El storefront y el admin de merchants viven en un único monorepo con npm workspaces, mantenidos como apps completamente separadas (Vite + Tailwind de un lado, Shopify Polaris del otro). ==Framer Motion== impulsa un sistema de animación con múltiples estados y coreografía vía React Context API, mientras Shadow DOM mantiene el CSS aislado en entornos de storefront impredecibles.

- **Shopify App Bridge**, **Theme App Extensions** y **Storefront API**, aprendidos y aplicados íntegramente en ambos contextos
- **Entrega en plazo fijo** con una fase estructurada de mejoras post-MVP

## Tecnologías

- [React](https://react.dev): widget del storefront y UI del admin de merchants; estado gestionado via Context API en ambas apps
- [Framer Motion](https://www.framer.com/motion/): sistema de animación con múltiples estados para el ciclo de vida de las ofertas (idle, en progreso, éxito, oferta existente)
- [Shopify Polaris](https://polaris.shopify.com): biblioteca de componentes para las tres pantallas del admin de merchants
- [Tailwind CSS](https://tailwindcss.com): estilos del widget del storefront, encapsulados dentro del Shadow DOM
- [Vite](https://vitejs.dev): bundler del storefront; clave para las optimizaciones de performance que cumplieron los requisitos de la App Store
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge): gestión de sesión e integración con el admin de Shopify
- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions): mecanismo de entrega del widget del storefront en los temas de los merchants
- [Storefront API](https://shopify.dev/docs/api/storefront): acceso a datos de productos y carrito de Shopify
- [TypeScript](https://www.typescriptlang.org): tipado estático en ambas apps
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces): monorepo manteniendo storefront y admin como paquetes separados`,
      ),
      featured: false,
      status: 'PUBLISHED' as const,
      weight: 70,
      projectUrl: 'https://apps.shopify.com/buyr',
      periodStart: new Date('2024-10-01'),
      periodEnd: new Date('2025-02-28'),
      skillIds: [
        ID.skills.typescript,
        ID.skills.react,
        ID.skills.tailwindcss,
        ID.skills.shopify,
        ID.skills.framerMotion,
        ID.skills.vite,
      ],
      relatedProjectSlugs: [],
    },
    {
      id: ID.projects.aiGolfAssistant,
      slug: 'ai-golf-assistant',
      coverImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/ai-golf-assistant-cover.webp',
      coverImageAlt: loc(
        'Noteefy platform: dashboard, mobile app, and AI Pro Shop Assistant',
        'Plataforma Noteefy: dashboard, app mobile e AI Pro Shop Assistant',
        'Plataforma Noteefy: dashboard, app móvil y AI Pro Shop Assistant',
      ),
      thumbnailImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/noteefy-thumbnail.webp',
      thumbnailImageAlt: loc(
        'Noteefy logo',
        'Logo da Noteefy',
        'Logo de Noteefy',
      ),
      title: loc(
        'AI Pro Shop Assistant',
        'AI Pro Shop Assistant',
        'AI Pro Shop Assistant',
      ),
      caption: loc(
        'An embeddable AI chatbot for golf courses, built with React and Vite and delivered as a script-tag widget live across 800+ Noteefy clients.',
        'Um chatbot de IA incorporável para campos de golf, construído com React e Vite e entregue como widget via script tag, em produção para mais de 800 clientes da Noteefy.',
        'Un chatbot de IA embebible para campos de golf, construido con React y Vite y entregado como widget via script tag, en producción para más de 800 clientes de Noteefy.',
      ),
      content: loc(
        `[Noteefy](https://www.noteefy.com) is a revenue management platform serving ==800+ golf courses== worldwide, automating waitlists, reducing no-shows, and capturing booking demand. The [AI Pro Shop Assistant](https://www.noteefy.com/products/ai-pro-shop-assistant) is an embeddable chatbot that course operators add to their websites via a script tag, giving golfers 24/7 access to tee time bookings, waitlist enrollment, and course FAQs without involving pro shop staff.

I joined with a fixed deadline already set and ==defined the frontend architecture and implementation plan== before writing a line of code. Then I built the widget from scratch: UI, integration layer, and embed packaging, all in a sprint-based cycle with a distributed international team.

![AI Pro Shop Assistant chat interface on a golf course website](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/ai-pro-assistant-widget.webp)

*The AI Pro Shop Assistant interface: golfers ask questions and book tee times directly in the chat.*

## The Constraints

The widget runs inside any golf course website with no control over the host's CSS or JavaScript environment. Hundreds of different sites, each with its own theme and stylesheet, could silently break the same widget in different ways.

Delivery had a ==fixed deadline from day one==. Before implementation could start, the team required a frontend architecture proposal covering component structure, styling strategy, embed mechanism, and integration approach, which I drafted and presented to align everyone on the plan.

Integration against Noteefy's own backend, which manages the AI conversation engine and connects to tee sheet systems, added coordination overhead across time zones throughout the sprint.

## AI Pro Shop Assistant

Built the complete widget using **React** and **Vite**, with **Material UI** providing the component system for the chat interface and UI elements.

Style isolation came from CSS Modules scoped via Vite: hash-based class names prevented collisions between the widget and host sites, so rendering stayed correct regardless of the host theme. Delivery followed the same self-contained logic. The widget ships as a bundle injected via a JavaScript snippet clients add to their site's \`<head>\`, with no assumptions about the host's framework or toolchain.

- **Noteefy API integration**: the widget communicates with Noteefy's backend for AI-powered responses, live tee time availability, and waitlist enrollment

The assistant is ==live in production== across Noteefy's client network of golf courses.

![AI Pro Shop Assistant live on a client golf course website](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/ai-pro-assistant-live.webp)

*The widget embedded and live on a Noteefy client's website.*

## Technologies

- [React](https://react.dev): widget UI and component architecture
- [Vite](https://vitejs.dev): bundler; enabled CSS Modules scoping for style isolation across host environments
- [Material UI](https://mui.com): component library for the chat interface and UI elements
- [CSS Modules](https://github.com/css-modules/css-modules): scoped class names preventing style collisions with host site themes

## Technical Highlights

CSS Modules scoped through Vite isolated widget styles from any host theme without pulling in the overhead of Shadow DOM, and the resulting bundle carried no dependency on the host site's framework, build tools, or CSS reset. Delivery ran in fixed sprints with a distributed international team spread across time zones.`,
        `[Noteefy](https://www.noteefy.com) é uma plataforma de gestão de receita para ==mais de 800 campos de golf== ao redor do mundo, automatizando listas de espera, reduzindo no-shows e capturando demanda de reservas. O [AI Pro Shop Assistant](https://www.noteefy.com/products/ai-pro-shop-assistant) é um chatbot incorporável que os operadores de campos adicionam aos seus sites via script tag, oferecendo aos golfistas acesso 24/7 a reservas de horários, inscrição em lista de espera e perguntas frequentes, sem envolver a equipe da loja.

Entrei no projeto com um prazo já definido e ==elaborei o plano de implementação e a arquitetura de frontend== antes de escrever uma linha de código. Depois construí o widget do zero: UI, camada de integração e empacotamento para embed, tudo em ciclos de sprint com um time internacional distribuído.

![Interface do AI Pro Shop Assistant em um site de campo de golf](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/ai-pro-assistant-widget.webp)

*A interface do AI Pro Shop Assistant: golfistas fazem perguntas e reservam horários diretamente no chat.*

## As Restrições

O widget roda dentro de qualquer site de campo de golf sem controle sobre o CSS ou o ambiente JavaScript do host. Centenas de sites diferentes, cada um com seu próprio tema e folha de estilos, podiam quebrar o mesmo widget de formas silenciosas e distintas.

A entrega tinha ==prazo fixo desde o primeiro dia==. Antes de iniciar a implementação, o time exigiu uma proposta de arquitetura de frontend cobrindo estrutura de componentes, estratégia de estilos, mecanismo de embed e abordagem de integração, que elaborei e apresentei para alinhar o time no plano.

A integração com o backend próprio da Noteefy, que gerencia o motor de conversação com IA e conecta com os sistemas de tee sheet, adicionou overhead de coordenação entre fusos horários ao longo do sprint.

## AI Pro Shop Assistant

Construí o widget completo com **React** e **Vite**, usando **Material UI** como sistema de componentes para a interface de chat e os elementos de UI.

O isolamento de estilos veio de CSS Modules com escopo via Vite: nomes de classe com hash impediram colisões entre o widget e os sites host, então a renderização se mantinha correta independentemente do tema. A entrega seguiu a mesma lógica autocontida. O widget é empacotado como bundle, injetado via snippet JavaScript que os clientes adicionam ao \`<head>\` do site, sem suposições sobre o framework ou toolchain do host.

- **Integração com a API da Noteefy**: o widget se comunica com o backend da Noteefy para respostas com IA, disponibilidade de horários em tempo real e inscrição em lista de espera

O assistente está ==em produção== na rede de campos de golf clientes da Noteefy.

![AI Pro Shop Assistant em produção no site de um campo de golf cliente](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/ai-pro-assistant-live.webp)

*O widget incorporado e em produção no site de um cliente da Noteefy.*

## Tecnologias

- [React](https://react.dev): UI e arquitetura de componentes do widget
- [Vite](https://vitejs.dev): bundler; habilitou o escopo de CSS Modules para isolamento de estilos entre ambientes host
- [Material UI](https://mui.com): biblioteca de componentes para a interface de chat e elementos de UI
- [CSS Modules](https://github.com/css-modules/css-modules): nomes de classe com escopo impedindo colisões com os temas dos sites host

## Destaques Técnicos

CSS Modules com escopo via Vite isolou os estilos do widget de qualquer tema host sem trazer o overhead do Shadow DOM, e o bundle resultante ficou sem dependência do framework, toolchain ou reset CSS do site host. A entrega rodou em sprints fixos com um time internacional distribuído em diferentes fusos horários.`,
        `[Noteefy](https://www.noteefy.com) es una plataforma de gestión de ingresos para ==más de 800 campos de golf== en todo el mundo, automatizando listas de espera, reduciendo no-shows y capturando demanda de reservas. El [AI Pro Shop Assistant](https://www.noteefy.com/products/ai-pro-shop-assistant) es un chatbot embebible que los operadores de campos añaden a sus sitios web mediante una script tag, dando a los golfistas acceso 24/7 a reservas de horarios, inscripción en lista de espera y preguntas frecuentes, sin intervención del personal de la tienda.

Me incorporé al proyecto con un plazo ya definido y ==elaboré el plan de implementación y la arquitectura de frontend== antes de escribir una línea de código. Luego construí el widget desde cero: UI, capa de integración y empaquetado para embed, todo en ciclos de sprint con un equipo internacional distribuido.

![Interfaz del AI Pro Shop Assistant en un sitio web de campo de golf](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/ai-pro-assistant-widget.webp)

*La interfaz del AI Pro Shop Assistant: los golfistas hacen preguntas y reservan horarios directamente en el chat.*

## Las Restricciones

El widget se ejecuta dentro de cualquier sitio web de campo de golf sin control sobre el CSS o el entorno JavaScript del host. Cientos de sitios diferentes, cada uno con su propio tema y hoja de estilos, podían romper el mismo widget de formas silenciosas y distintas.

La entrega tenía ==plazo fijo desde el primer día==. Antes de iniciar la implementación, el equipo requirió una propuesta de arquitectura de frontend cubriendo estructura de componentes, estrategia de estilos, mecanismo de embed y enfoque de integración, que elaboré y presenté para alinear al equipo en el plan.

La integración contra el backend propio de Noteefy, que gestiona el motor de conversación con IA y conecta con los sistemas de tee sheet, añadió overhead de coordinación entre zonas horarias a lo largo del sprint.

## AI Pro Shop Assistant

Construí el widget completo con **React** y **Vite**, usando **Material UI** como sistema de componentes para la interfaz de chat y los elementos de UI.

El aislamiento de estilos vino de CSS Modules con alcance via Vite: nombres de clase con hash previnieron colisiones entre el widget y los sitios host, así que la renderización se mantuvo correcta independientemente del tema. La entrega siguió la misma lógica autocontenida. El widget se empaqueta como bundle, inyectado via snippet JavaScript que los clientes añaden al \`<head>\` de su sitio, sin suposiciones sobre el framework o toolchain del host.

- **Integración con la API de Noteefy**: el widget se comunica con el backend de Noteefy para respuestas con IA, disponibilidad de horarios en tiempo real e inscripción en lista de espera

El asistente está ==en producción== en la red de campos de golf clientes de Noteefy.

![AI Pro Shop Assistant en producción en el sitio web de un campo de golf cliente](https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/noteefy/ai-pro-assistant-live.webp)

*El widget embebido y en producción en el sitio web de un cliente de Noteefy.*

## Tecnologías

- [React](https://react.dev): UI y arquitectura de componentes del widget
- [Vite](https://vitejs.dev): bundler; habilitó el alcance de CSS Modules para aislamiento de estilos entre entornos host
- [Material UI](https://mui.com): biblioteca de componentes para la interfaz de chat y elementos de UI
- [CSS Modules](https://github.com/css-modules/css-modules): nombres de clase con alcance previniendo colisiones con los temas de los sitios host

## Aspectos Técnicos Destacados

CSS Modules con alcance via Vite aisló los estilos del widget de cualquier tema host sin traer el overhead de Shadow DOM, y el bundle resultante quedó sin dependencia del framework, toolchain o reset CSS del sitio host. La entrega corrió en sprints fijos con un equipo internacional distribuido en diferentes zonas horarias.`,
      ),
      featured: false,
      status: 'PUBLISHED' as const,
      weight: 60,
      projectUrl: 'https://www.noteefy.com/products/ai-pro-shop-assistant',
      periodStart: new Date('2025-01-01'),
      periodEnd: new Date('2025-03-31'),
      skillIds: [ID.skills.react, ID.skills.vite, ID.skills.typescript],
      relatedProjectSlugs: [],
    },
    {
      id: ID.projects.mqttClient,
      slug: 'react-mqtt-workflow-manager',
      coverImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/react-mqtt/mqtt-cover.svg',
      coverImageAlt: loc(
        'React logo and MQTT logo side by side: React MQTT Workflow Manager library',
        'Logo do React e logo do MQTT lado a lado: biblioteca React MQTT Workflow Manager',
        'Logo de React y logo de MQTT uno al lado del otro: biblioteca React MQTT Workflow Manager',
      ),
      thumbnailImageUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/projects/react-mqtt/mqtt-thumbnail.svg',
      thumbnailImageAlt: loc(
        'React MQTT Workflow Manager: open-source library for the Flow Build ecosystem',
        'React MQTT Workflow Manager: biblioteca open-source para o ecossistema Flow Build',
        'React MQTT Workflow Manager: biblioteca de código abierto para el ecosistema Flow Build',
      ),
      title: loc('React MQTT Workflow Manager', 'React MQTT Workflow Manager', 'React MQTT Workflow Manager'),
      caption: loc(
        'Open-source React library built for the Flow Build ecosystem, wrapping MQTT event subscriptions behind a hooks-based API and published to npm.',
        'Biblioteca React open-source construída para o ecossistema Flow Build, encapsulando assinaturas de eventos MQTT em uma API baseada em hooks publicada no npm.',
        'Biblioteca React de código abierto construida para el ecosistema Flow Build, encapsulando suscripciones de eventos MQTT en una API basada en hooks publicada en npm.',
      ),
      content: loc(
        `[Flow Build](https://github.com/flow-build) is an open-source JSON-based workflow engine created by [FDTE](https://www.fdte.org.br/) (Fundação para o Desenvolvimento Tecnológico da Engenharia), a São Paulo engineering foundation. React applications that participate in a Flow Build workflow (a multi-step form, an approval process, any event-driven sequence) must subscribe to events the engine publishes on an MQTT broker. \`@flowbuild/react-mqtt-workflow-manager\` packages all that integration logic into a ==single reusable library== so any client project in the ecosystem can connect without reimplementing it from scratch.

## The Constraints

MQTT connections are stateful and long-lived, which sits awkwardly against React's component lifecycle of mounting and unmounting freely. Without a shared abstraction, every Flow Build client project would reimplement broker connection, subscription management, and Redux state wiring on its own.

- Redux state had to be injectable before the React tree mounts, requiring a bridge between imperative configuration and declarative rendering

## The Library

Built and ==published to npm== as the single MQTT integration point for React frontends in the Flow Build ecosystem:

- **\`WorkflowManager\`**: context provider that owns the broker connection lifecycle and wraps the application
- **\`WorkflowManagerConfig\`**: static utility class for use outside component scope: \`setStore\`, \`subscribe\`, \`unsubscribe\`
- **\`useMqtt()\`**: returns \`{ client, status, error }\` for connection awareness inside components
- **\`useSubscribe()\` / \`useUnsubscribe()\`**: hooks that expose topic subscription management following React idioms

## Technologies

- [TypeScript](https://www.typescriptlang.org): full type coverage including MQTT client options and hook return shapes
- [React 18](https://react.dev) + Context API: provider pattern for connection lifecycle management
- [MQTT.js](https://github.com/mqttjs/MQTT.js): underlying WebSocket/WSS broker client
- [Redux Toolkit](https://redux-toolkit.js.org): \`workflowManagerReducer\` slice shared across the host application`,
        `[Flow Build](https://github.com/flow-build) é um motor de workflows de código aberto baseado em JSON, criado pela [FDTE](https://www.fdte.org.br/) (Fundação para o Desenvolvimento Tecnológico da Engenharia), uma fundação de engenharia de São Paulo. Aplicações React que participam de um workflow do Flow Build (um formulário multi-step, um processo de aprovação, qualquer sequência orientada a eventos) precisam assinar eventos que o motor publica em um broker MQTT. O \`@flowbuild/react-mqtt-workflow-manager\` empacota toda essa lógica de integração em uma ==biblioteca reutilizável== para que qualquer projeto cliente do ecossistema possa se conectar sem reimplementá-la.

## As Restrições

Conexões MQTT são stateful e de longa duração, o que fica em atrito com o ciclo de vida de componentes React, que montam e desmontam livremente. Sem uma abstração compartilhada, cada projeto cliente do Flow Build reimplementaria por conta própria a conexão ao broker, o gerenciamento de assinaturas e a integração com Redux.

- O estado do Redux precisava ser injetável antes da árvore React montar, exigindo uma ponte entre configuração imperativa e renderização declarativa

## A Biblioteca

Construída e ==publicada no npm== como o único ponto de integração MQTT para frontends React no ecossistema Flow Build:

- **\`WorkflowManager\`**: provider de contexto que gerencia o ciclo de vida da conexão ao broker e envolve a aplicação
- **\`WorkflowManagerConfig\`**: classe utilitária estática para uso fora do escopo de componentes: \`setStore\`, \`subscribe\`, \`unsubscribe\`
- **\`useMqtt()\`**: retorna \`{ client, status, error }\` para visibilidade da conexão dentro de componentes
- **\`useSubscribe()\` / \`useUnsubscribe()\`**: hooks que expõem o gerenciamento de assinaturas de tópicos seguindo os idiomas do React

## Tecnologias

- [TypeScript](https://www.typescriptlang.org): cobertura completa de tipos, incluindo opções do cliente MQTT e formatos de retorno dos hooks
- [React 18](https://react.dev) + Context API: padrão provider para gerenciamento do ciclo de vida da conexão
- [MQTT.js](https://github.com/mqttjs/MQTT.js): cliente de broker WebSocket/WSS subjacente
- [Redux Toolkit](https://redux-toolkit.js.org): slice \`workflowManagerReducer\` compartilhado em toda a aplicação hospedeira`,
        `[Flow Build](https://github.com/flow-build) es un motor de flujos de trabajo de código abierto basado en JSON, creado por [FDTE](https://www.fdte.org.br/) (Fundação para o Desenvolvimento Tecnológico da Engenharia), una fundación de ingeniería de São Paulo. Las aplicaciones React que participan en un workflow de Flow Build (un formulario de múltiples pasos, un proceso de aprobación, cualquier secuencia orientada a eventos) deben suscribirse a los eventos que el motor publica en un broker MQTT. \`@flowbuild/react-mqtt-workflow-manager\` empaqueta toda esa lógica de integración en una ==biblioteca reutilizable== para que cualquier proyecto cliente del ecosistema pueda conectarse sin reimplementarla.

## Las Restricciones

Las conexiones MQTT son stateful y de larga duración, lo que choca con el ciclo de vida de los componentes React, que montan y desmontan libremente. Sin una abstracción compartida, cada proyecto cliente de Flow Build reimplementaría por su cuenta la conexión al broker, la gestión de suscripciones y la integración con Redux.

- El estado de Redux debía ser inyectable antes de que el árbol React se monte, requiriendo un puente entre la configuración imperativa y el renderizado declarativo

## La Biblioteca

Construida y ==publicada en npm== como el único punto de integración MQTT para frontends React en el ecosistema Flow Build:

- **\`WorkflowManager\`**: provider de contexto que gestiona el ciclo de vida de la conexión al broker y envuelve la aplicación
- **\`WorkflowManagerConfig\`**: clase utilitaria estática para uso fuera del ámbito de los componentes: \`setStore\`, \`subscribe\`, \`unsubscribe\`
- **\`useMqtt()\`**: devuelve \`{ client, status, error }\` para visibilidad de la conexión dentro de los componentes
- **\`useSubscribe()\` / \`useUnsubscribe()\`**: hooks que exponen la gestión de suscripciones de tópicos siguiendo los idiomas de React

## Tecnologías

- [TypeScript](https://www.typescriptlang.org): cobertura completa de tipos, incluyendo opciones del cliente MQTT y formas de retorno de los hooks
- [React 18](https://react.dev) + Context API: patrón provider para la gestión del ciclo de vida de la conexión
- [MQTT.js](https://github.com/mqttjs/MQTT.js): cliente de broker WebSocket/WSS subyacente
- [Redux Toolkit](https://redux-toolkit.js.org): slice \`workflowManagerReducer\` compartido en toda la aplicación anfitriona`,
      ),
      featured: false,
      status: 'PUBLISHED' as const,
      weight: 40,
      repositoryUrl: 'https://github.com/flow-build/react-mqtt-workflow-manager',
      periodStart: new Date('2023-02-01'),
      periodEnd: new Date('2023-03-01'),
      skillIds: [ID.skills.typescript, ID.skills.react],
      relatedProjectSlugs: [],
    },
  ];

  for (const project of projects) {
    await db.project.upsert({
      where: { id: project.id },
      update: {
        slug: project.slug,
        title: project.title,
        caption: project.caption,
        content: project.content,
        coverImageUrl: project.coverImageUrl,
        coverImageAlt: project.coverImageAlt,
        thumbnailImageUrl: project.thumbnailImageUrl,
        thumbnailImageAlt: project.thumbnailImageAlt,
        featured: project.featured,
        status: project.status,
        weight: project.weight,
        repositoryUrl: project.repositoryUrl ?? null,
        projectUrl: project.projectUrl ?? null,
        periodStart: project.periodStart,
        periodEnd: project.periodEnd,
        skillIds: project.skillIds,
        relatedProjectSlugs: project.relatedProjectSlugs,
      },
      create: project,
    });
  }
  console.log(`✔ ${projects.length} projects seeded`);
}

export async function seedExperiences(db: PrismaClient): Promise<void> {
  const experiences = [
    {
      id: ID.experiences.fdte_current,
      company: loc(
        'FDTE - Fundação para o Desenvolvimento Tecnológico da Engenharia',
        'FDTE - Fundação para o Desenvolvimento Tecnológico da Engenharia',
      ),
      position: loc('Frontend Software Engineer', 'Frontend Software Engineer'),
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil', 'São Paulo, Brasil'),
      description: loc(
        '- Built and evolved frontend solutions for internal operations, AI-powered customer experiences, and Shopify-based commerce products.\n- Owned the frontend implementation of an internal timesheet platform, contributing to architecture decisions, scalability, and product foundations for future ERP evolution.\n- Developed an embeddable AI assistant widget for a golf revenue management platform serving over 800 golf courses, collaborating with an international team.\n- Worked across sprint and Kanban environments with a focus on performance, accessibility, security, and maintainable frontend architecture.',
        '- Desenvolveu e evoluiu soluções frontend para operações internas, experiências de cliente com IA e produtos baseados em Shopify.\n- Liderou a implementação frontend de uma plataforma interna de timesheet, contribuindo para decisões de arquitetura, escalabilidade e fundações de produto.\n- Desenvolveu um widget de assistente de IA incorporável para uma plataforma de gestão de receita de golf com mais de 800 campos, colaborando com um time internacional.\n- Trabalhou em ambientes de sprint e Kanban com foco em performance, acessibilidade, segurança e arquitetura frontend sustentável.',
        '- Desarrolló y evolucionó soluciones frontend para operaciones internas, experiencias de cliente con IA y productos basados en Shopify.\n- Lideró la implementación frontend de una plataforma interna de registro de horas, contribuyendo a decisiones de arquitectura, escalabilidad y fundamentos del producto.\n- Desarrolló un widget de asistente de IA embebible para una plataforma de gestión de ingresos de golf con más de 800 campos, colaborando con un equipo internacional.\n- Trabajó en entornos de sprint y Kanban con enfoque en rendimiento, accesibilidad, seguridad y arquitectura frontend sostenible.',
      ),
      logoUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/experiences/fdte_logo.webp',
      logoAlt: loc('FDTE logo', 'Logo da FDTE', 'Logo de FDTE'),
      employmentType: 'FULL_TIME' as const,
      locationType: 'REMOTE' as const,
      startAt: new Date('2024-10-01'),
      endAt: new Date('2026-05-31'),
      skillIds: [
        ID.skills.typescript,
        ID.skills.react,
        ID.skills.nextjs,
        ID.skills.tailwindcss,
        ID.skills.accessibility,
        ID.skills.shopify,
        ID.skills.leadership,
      ],
    },
    {
      id: ID.experiences.wesf,
      company: loc('WESF IT Services', 'WESF IT Services'),
      position: loc(
        'Fullstack Software Engineer',
        'Fullstack Software Engineer',
      ),
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil', 'São Paulo, Brasil'),
      description: loc(
        '- Engineered a B2B e-commerce platform for construction materials, taking the product from planning to delivery.\n- Built scalable frontend and backend solutions aligned with brand consistency and regional sales requirements.\n- Designed and implemented RESTful APIs applying DDD and Clean Architecture principles.\n- Owned the frontend development of a phone management and VoIP portal with ACL-based permissions.\n- Improved usability and maintainability across key user journeys in a Kanban-based delivery environment.',
        '- Desenvolveu uma plataforma B2B de e-commerce para materiais de construção, do planejamento à entrega.\n- Construiu soluções frontend e backend escaláveis alinhadas com consistência de marca e requisitos regionais.\n- Projetou e implementou APIs RESTful com DDD e Arquitetura Limpa.\n- Liderou o frontend de um portal de gestão de telefonia e VoIP com permissões baseadas em ACL.\n- Melhorou a usabilidade e manutenibilidade em jornadas-chave em um ambiente de entrega baseado em Kanban.',
        '- Desarrolló una plataforma B2B de e-commerce para materiales de construcción, del planteamiento a la entrega.\n- Construyó soluciones frontend y backend escalables alineadas con la consistencia de marca y los requisitos de ventas regionales.\n- Diseñó e implementó APIs RESTful aplicando DDD y principios de Arquitectura Limpia.\n- Lideró el desarrollo frontend de un portal de gestión telefónica y VoIP con permisos basados en ACL.\n- Mejoró la usabilidad y mantenibilidad en los recorridos clave de usuario en un entorno de entrega basado en Kanban.',
      ),
      logoUrl: 'https://placehold.co/80x80/1e293b/34d399?text=WESF',
      logoAlt: loc('WESF IT Services logo', 'Logo da WESF IT Services', 'Logo de WESF IT Services'),
      employmentType: 'FULL_TIME' as const,
      locationType: 'ONSITE' as const,
      startAt: new Date('2023-09-01'),
      endAt: new Date('2024-04-30'),
      skillIds: [
        ID.skills.typescript,
        ID.skills.react,
        ID.skills.nodejs,
        ID.skills.nestjs,
        ID.skills.postgresql,
        ID.skills.aws,
        ID.skills.tailwindcss,
        ID.skills.designSystems,
      ],
    },
    {
      id: ID.experiences.galaxies,
      company: loc('Galaxies', 'Galaxies'),
      position: loc('Frontend Software Engineer', 'Frontend Software Engineer'),
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil', 'São Paulo, Brasil'),
      description: loc(
        '- Developed a game research and data intelligence platform focused on making insights more accessible and actionable.\n- Rebuilt a back-office page from scratch to support dynamic question creation for synthetic research form workflows.\n- Adapted the product for mobile devices, improving usability across different screen sizes.\n- Enhanced the overall user experience through better interfaces and more intuitive user flows.',
        '- Desenvolveu uma plataforma de pesquisa de games e inteligência de dados focada em tornar insights mais acessíveis e acionáveis.\n- Reconstruiu uma página de back-office do zero para suportar criação dinâmica de questões em fluxos de formulários de pesquisa sintética.\n- Adaptou o produto para dispositivos móveis, melhorando a usabilidade em diferentes tamanhos de tela.\n- Aprimorou a experiência do usuário com interfaces melhores e fluxos mais intuitivos.',
        '- Desarrolló una plataforma de investigación de videojuegos e inteligencia de datos orientada a hacer los insights más accesibles y accionables.\n- Reconstruyó una página de back-office desde cero para soportar la creación dinámica de preguntas en flujos de formularios de investigación sintética.\n- Adaptó el producto para dispositivos móviles, mejorando la usabilidad en diferentes tamaños de pantalla.\n- Mejoró la experiencia general del usuario con mejores interfaces y flujos más intuitivos.',
      ),
      logoUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/experiences/galaxy_logo.webp',
      logoAlt: loc('Galaxies logo', 'Logo da Galaxies', 'Logo de Galaxies'),
      employmentType: 'PART_TIME' as const,
      locationType: 'REMOTE' as const,
      startAt: new Date('2023-10-01'),
      endAt: new Date('2023-12-31'),
      skillIds: [ID.skills.typescript, ID.skills.react, ID.skills.graphql],
    },
    {
      id: ID.experiences.fdte_previous,
      company: loc(
        'FDTE - Fundação para o Desenvolvimento Tecnológico da Engenharia',
        'FDTE - Fundação para o Desenvolvimento Tecnológico da Engenharia',
      ),
      position: loc('Frontend Software Engineer', 'Frontend Software Engineer'),
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil', 'São Paulo, Brasil'),
      description: loc(
        '- Contributed to complex web platforms involving custom forms, workflow management, and operational systems.\n- Built frontend solutions for a public bidding evaluation platform with advanced forms, file uploads, and browser-based document handling.\n- Architected the frontend foundation and design system for an e-commerce platform, improving structure, consistency, and maintainability.\n- Strengthened engineering quality through CI/CD practices, end-to-end testing, and cross-team collaboration.\n- Created a public open-source MQTT/WebSocket library and mentored junior developers.',
        '- Contribuiu para plataformas web complexas envolvendo formulários customizados, gestão de workflows e sistemas operacionais.\n- Construiu soluções frontend para uma plataforma de avaliação de licitações públicas com formulários avançados e upload de arquivos.\n- Arquitetou a fundação frontend e o design system de uma plataforma de e-commerce, melhorando estrutura, consistência e manutenibilidade.\n- Fortaleceu a qualidade de engenharia com práticas de CI/CD e testes end-to-end.\n- Criou uma biblioteca open-source de MQTT/WebSocket e mentorou desenvolvedores juniores.',
        '- Contribuyó a plataformas web complejas con formularios personalizados, gestión de flujos de trabajo y sistemas operacionales.\n- Desarrolló soluciones frontend para una plataforma de evaluación de licitaciones públicas con formularios avanzados y carga de archivos.\n- Diseñó la base frontend y el design system de una plataforma de e-commerce, mejorando estructura, consistencia y mantenibilidad.\n- Fortaleció la calidad de ingeniería con prácticas de CI/CD, pruebas end-to-end y colaboración entre equipos.\n- Creó una biblioteca open-source de MQTT/WebSocket y mentorizó a desarrolladores junior.',
      ),
      logoUrl:
        'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/site/experiences/fdte_logo.webp',
      logoAlt: loc('FDTE logo', 'Logo da FDTE', 'Logo de FDTE'),
      employmentType: 'FULL_TIME' as const,
      locationType: 'HYBRID' as const,
      startAt: new Date('2020-03-01'),
      endAt: new Date('2023-05-31'),
      skillIds: [
        ID.skills.typescript,
        ID.skills.react,
        ID.skills.nodejs,
        ID.skills.cicd,
        ID.skills.designSystems,
        ID.skills.accessibility,
        ID.skills.leadership,
        ID.skills.communication,
      ],
    },
  ];

  for (const exp of experiences) {
    await db.experience.upsert({
      where: { id: exp.id },
      update: {
        company: exp.company,
        position: exp.position,
        location: exp.location,
        description: exp.description,
        logoUrl: exp.logoUrl,
        logoAlt: exp.logoAlt,
        employmentType: exp.employmentType,
        locationType: exp.locationType,
        startAt: exp.startAt,
        endAt: exp.endAt,
        skillIds: exp.skillIds,
      },
      create: exp,
    });
  }
  console.log(`✔ ${experiences.length} experiences seeded`);
}

export async function seedProfessionalValues(db: PrismaClient): Promise<void> {
  const values = [
    {
      id: ID.professionalValues.quality,
      icon: 'material-symbols:diamond',
      content: loc(
        'Delivering high-quality software through clean architecture, thorough testing, and disciplined code review.',
        'Entrega de software de alta qualidade por meio de arquitetura limpa, testes rigorosos e revisão de código disciplinada.',
        'Entrega de software de alta calidad mediante arquitectura limpia, pruebas exhaustivas y revisión de código disciplinada.',
      ),
      order: 0,
    },
    {
      id: ID.professionalValues.agility,
      icon: 'material-symbols:acute-rounded',
      content: loc(
        'Shipping solutions quickly and iteratively while maintaining quality and architectural integrity.',
        'Entregar soluções de forma rápida e iterativa, mantendo qualidade e integridade arquitetural.',
        'Entregar soluciones de forma rápida e iterativa, manteniendo la calidad y la integridad arquitectural.',
      ),
      order: 1,
    },
    {
      id: ID.professionalValues.versatility,
      icon: 'material-symbols:sdk-rounded',
      content: loc(
        'Comfortable across the full stack, from domain modeling and APIs to UI, accessibility, and performance.',
        'Confortável em todo o stack, do modelamento de domínio e APIs até UI, acessibilidade e performance.',
        'Cómodo en todo el stack, desde el modelado de dominio y APIs hasta UI, accesibilidad y rendimiento.',
      ),
      order: 2,
    },
    {
      id: ID.professionalValues.communication,
      icon: 'material-symbols:3p-rounded',
      content: loc(
        'Clear communication with teammates and stakeholders to align expectations and deliver with confidence.',
        'Comunicação clara com o time e stakeholders para alinhar expectativas e entregar com confiança.',
        'Comunicación clara con el equipo y stakeholders para alinear expectativas y entregar con confianza.',
      ),
      order: 3,
    },
  ];

  for (const value of values) {
    await db.professionalValue.upsert({
      where: { id: value.id },
      update: { content: value.content, order: value.order },
      create: value,
    });
  }
  console.log(`✔ ${values.length} professional values seeded`);
}
