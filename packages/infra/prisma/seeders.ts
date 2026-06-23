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
  },
  projects: {
    portfolio: '30000000-0000-4000-8000-000000000001',
    b2bEcommerce: '30000000-0000-4000-8000-000000000002',
    gamePlatform: '30000000-0000-4000-8000-000000000003',
    mqttClient: '30000000-0000-4000-8000-000000000004',
    buyrShopifyApp: '30000000-0000-4000-8000-000000000005',
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
      description: loc('Accessibility', 'Acessibilidade'),
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
      id: ID.skills.communication,
      icon: 'mdi:comment-text',
      type: 'SOFT' as const,
      description: loc('Communication', 'Comunicação'),
    },
    {
      id: ID.skills.leadership,
      icon: 'mdi:account-group',
      type: 'SOFT' as const,
      description: loc('Leadership', 'Liderança'),
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
      stats: {
        deleteMany: {},
        create: [
          {
            id: ID.stats.experience,
            label: loc('Years of experience', 'Anos de experiência'),
            value: '6+',
            icon: 'mdi:briefcase',
            order: 0,
          },
          {
            id: ID.stats.projects,
            label: loc('Projects delivered', 'Projetos entregues'),
            value: '20+',
            icon: 'mdi:folder-multiple',
            order: 1,
          },
          {
            id: ID.stats.technologies,
            label: loc('Technologies', 'Tecnologias'),
            value: '15+',
            icon: 'mdi:code-braces',
            order: 2,
          },
          {
            id: ID.stats.countries,
            label: loc('Countries', 'Países'),
            value: '3',
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
        'Frontend Engineer | React & Next.js | TypeScript | Scalable Web Apps | Web Performance & Accessibility Specialist | International Collaborations',
        'Engenheiro Frontend | React & Next.js | TypeScript | Aplicações Web Escaláveis | Especialista em Performance & Acessibilidade | Colaborações Internacionais',
      ),
      bio: loc(
        "I'm a Frontend Engineer with over 6 years of experience specialized in building scalable, performant, and accessible web products with React, Next.js, and TypeScript. My experience includes leading frontend design, development and now working for AI-assisted customer platforms and global commerce solutions, serving over 800 clients worldwide. Passionate about product-oriented environments, I focus on architecture, UX, and quality to deliver impactful results.",
        'Sou um Engenheiro Frontend com mais de 6 anos de experiência especializado em construir produtos web escaláveis, performáticos e acessíveis com React, Next.js e TypeScript. Minha experiência inclui liderança de design e desenvolvimento frontend, atuando em plataformas de atendimento ao cliente com IA e soluções de comércio global, atendendo mais de 800 clientes no mundo. Apaixonado por ambientes orientados a produto, foco em arquitetura, UX e qualidade para entregar resultados de impacto.',
      ),
      photoUrl:
        'https://wozibwvcepmelpstznic.supabase.co/storage/v1/object/public/portfolio-dev-images/profile/images/hero-landing-page.webp',
      photoAlt: loc('Wallace Ferreira', 'Wallace Ferreira'),
      featuredProjectSlugs: ['personal-portfolio', 'b2b-ecommerce-platform'],
      stats: {
        create: [
          {
            id: ID.stats.experience,
            label: loc('Years of experience', 'Anos de experiência'),
            value: '6+',
            icon: 'mdi:briefcase',
            order: 0,
          },
          {
            id: ID.stats.projects,
            label: loc('Projects delivered', 'Projetos entregues'),
            value: '20+',
            icon: 'mdi:folder-multiple',
            order: 1,
          },
          {
            id: ID.stats.technologies,
            label: loc('Technologies', 'Tecnologias'),
            value: '15+',
            icon: 'mdi:code-braces',
            order: 2,
          },
          {
            id: ID.stats.countries,
            label: loc('Countries', 'Países'),
            value: '3',
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
        'https://opengraph.githubassets.com/1/wallace-sf/portfolio',
      coverImageAlt: loc(
        'Personal Portfolio repository on GitHub',
        'Repositório do Portfólio Pessoal no GitHub',
        'Repositorio del Portafolio Personal en GitHub',
      ),
      title: loc('Personal Portfolio', 'Portfólio Pessoal', 'Portafolio Personal'),
      caption: loc(
        'A full-stack portfolio built with Next.js, DDD, and Clean Architecture in a Turborepo monorepo.',
        'Portfólio full-stack construído com Next.js, DDD e Arquitetura Limpa em um monorepo Turborepo.',
        'Portafolio full-stack construido con Next.js, DDD y Arquitectura Limpia en un monorepo Turborepo.',
      ),
      content: loc(
        `After six years in software engineering, this portfolio was the first chance to own an entire product — from architecture to deployment. Built to go beyond LinkedIn for an international audience, to target opportunities abroad, and to demonstrate that ==Domain-Driven Design and Clean Architecture== hold up on a solo greenfield project — not just in teams where the process is enforced.

## The Constraints

The architecture was self-imposed. With no team, no deadline, and no external pressure, the constraint came from a deliberate decision: treat this as a real product with an MVP scope, a post-MVP roadmap, and no shortcuts in the domain layer.

Three requirements shaped every technical decision:

- **Performance** — the site had to score well on Lighthouse; a slow portfolio sends the wrong message
- **Content without code changes** — updating project entries or experience data couldn't require a deploy; all content is ==driven by a seeded database and rendered as markdown==
- **i18n at every layer** — supporting English, Portuguese, and Spanish meant solving internationalization at the domain level, not patching it into the UI

The visual design was built entirely in Figma by [Milena Kawai](https://www.instagram.com/miilenamayuri/), a designer friend who delivered the full specification from scratch.

## Engineering Process

Managed the entire backlog with **Task Master**, divided into sprints tracked as GitHub milestones. GitHub Projects provided a Kanban board for issue tracking; each issue followed a structured template with context, acceptance criteria, relevant files, and dependencies. Custom labels organized work by sprint tag, priority, and type.

The project shipped five numbered PRDs — one per architecture layer:

- **Sprint 0** — domain foundation (\`core\`): Either pattern, Value Objects, entities, repository interfaces
- **Sprint 1** — application layer: use cases, ports, DTOs
- **Sprint 2** — infrastructure: Prisma repositories, Supabase gateway, DI container
- **Sprint 3** — public site: Next.js App Router, SSG, i18n routing, UI components
- **Sprint 4** — CI/CD: type checking, linting, and test suite on GitHub Actions

A dedicated accessibility sprint resolved ==88 WCAG issues==, followed by a Lighthouse-driven performance pass that targeted the critical bundle, RSC preload hints, and LCP image loading.

A \`docs/\` folder holds ==12 numbered architecture documents== — bounded contexts, validation strategy, i18n approach, testing strategy, code patterns, and a domain glossary — written as the system was built, not after.

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

The domain is organized into three bounded contexts — **portfolio** (projects, experiences, skills, profile), **identity** (authentication and user), and **contact** (message sending) — each with its own entities, value objects, and repository interfaces, sharing only the Shared Kernel.

Each package has a single, enforced responsibility:

- **\`core\`** — domain model; zero framework dependencies; entities, value objects, Either pattern, repository interfaces
- **\`application\`** — use cases and ports; depends only on \`core\`; no Prisma, no HTTP
- **\`infra\`** — concrete implementations; the only layer that imports Prisma and Supabase
- **\`ui\`** — shared React components; split into \`View\` (display) and \`Control\` (interactive) categories
- **\`utils\`** — pure TypeScript utilities: \`Validator\`, formatters, browser hooks; no React dependency

## Portfolio Site

==Server Components call use cases directly at build time== — no REST API layer exists between the domain and the generated HTML. For a content-driven static site, an HTTP boundary would be pure overhead.

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

Internationalization is a ==domain concern==: \`LocalizedText\` is a value object in \`core\`. The site renders in English, Portuguese, and Spanish — resolved at the domain layer before any React component touches the data.

Every page has a \`generateMetadata\` export with localized \`title\`, \`description\`, and \`openGraph\` fields. Project pages derive their OG data directly from domain entities — title, caption, and cover image — so metadata is never out of sync with content. A custom ==OG image route== built with \`next/og\` on the Edge Runtime generates branded 1200×630 cards per page, locale, and project.

Project detail routes are driven by \`Slug\` — a value object in \`core\` — with \`generateStaticParams\` resolving every published project slug across all three locales at build time. No slug, no route.

The contact form runs against rate limiting via Upstash Redis and delivers email through Resend — both behind port interfaces, ==swappable and testable without touching infrastructure==.

This portfolio is the first public technical presence I've built and owned entirely — from domain model to deployment pipeline. The admin app for content management and the blog are scoped as post-MVP, keeping the current site focused and shippable.

## Technical Highlights

- **No API layer** — Server Components consume use cases at build time; a static site has no need for an HTTP boundary between domain and HTML
- **ESLint-enforced dependency direction** — layer violations are caught at lint time, not review time; the boundary is mechanical, not a convention
- **Either pattern** — no exceptions thrown for domain errors; \`Left<ValidationError>\` propagates through use cases to the UI, making all error paths explicit and testable
- **LocalizedText as a VO** — i18n is a domain concern; components receive resolved strings, not translation keys
- **Accessibility as a sprint** — 88 WCAG findings tracked, scoped, and shipped as individual issues with acceptance criteria
- **Lighthouse-driven performance** — critical bundle trimmed by lazy-loading Zod-heavy forms, removing unnecessary \`'use client'\`, and preloading the LCP image with \`fetchpriority=high\`
- **SEO and Open Graph** — every page exports localized \`generateMetadata\`; an Edge Runtime \`/og\` route generates branded 1200×630 cards per page, locale, and project using \`next/og\`; OG data is sourced from domain entities, never from static strings

## Technologies

- [Next.js](https://nextjs.org) — App Router with SSG; \`generateStaticParams\` generates all localized routes at build time
- [Turborepo](https://turbo.build) — monorepo orchestration with five shared packages and remote caching on Vercel
- [TypeScript](https://www.typescriptlang.org) — strict mode across all packages; \`any\` is disallowed
- [Prisma](https://www.prisma.io) — ORM and migration layer, isolated to \`packages/infra\`
- [Supabase](https://supabase.com) — PostgreSQL database and JWT-based authentication
- [Tailwind CSS](https://tailwindcss.com) — shared design tokens via \`packages/tailwind-config\`
- [next-intl](https://next-intl.dev) — locale routing and message resolution for EN, PT-BR, and ES
- [Vitest](https://vitest.dev) — unit and integration tests across all packages; ~100 test files
- [Upstash Redis](https://upstash.com) — serverless rate limiting on the contact form
- [Resend](https://resend.com) — transactional email for contact form submissions
- [Vercel](https://vercel.com) — deployment with Turborepo remote cache`,
        `Após seis anos em engenharia de software, este portfólio foi a primeira oportunidade de ser dono de um produto inteiro — da arquitetura ao deploy. Construído para ir além do LinkedIn e alcançar um público internacional, para buscar oportunidades no exterior e para demonstrar que ==Domain-Driven Design e Arquitetura Limpa== se sustentam em um projeto solo do zero — não apenas em times onde o processo é imposto.

## As Restrições

A arquitetura foi autoimposta. Sem equipe, sem prazo e sem pressão externa, a restrição veio de uma decisão deliberada: tratar o projeto como um produto real com escopo de MVP, um roadmap pós-MVP e nenhum atalho na camada de domínio.

Três requisitos moldaram cada decisão técnica:

- **Performance** — o site precisava pontuar bem no Lighthouse; um portfólio lento passa a mensagem errada
- **Conteúdo sem alterar código** — atualizar entradas de projetos ou experiências não poderia exigir um deploy; todo o conteúdo é ==orientado por um banco de dados seedado e renderizado como markdown==
- **i18n em todas as camadas** — suportar inglês, português e espanhol significava resolver internacionalização na camada de domínio, não apenas remendá-la na UI

O design visual foi criado inteiramente no Figma por [Milena Kawai](https://www.instagram.com/miilenamayuri/), uma amiga designer que entregou a especificação completa do zero.

## Processo de Engenharia

O backlog foi gerenciado com **Task Master**, dividido em sprints rastreadas como milestones do GitHub. O GitHub Projects forneceu um quadro Kanban para acompanhamento; cada issue seguia um template estruturado com contexto, critérios de aceitação, arquivos relevantes e dependências. Labels customizadas organizaram o trabalho por sprint, prioridade e tipo.

O projeto foi estruturado em cinco PRDs numerados — um por camada de arquitetura:

- **Sprint 0** — fundação do domínio (\`core\`): padrão Either, Value Objects, entidades, interfaces de repositório
- **Sprint 1** — camada de aplicação: use cases, ports, DTOs
- **Sprint 2** — infraestrutura: repositórios Prisma, gateway Supabase, contêiner de DI
- **Sprint 3** — site público: Next.js App Router, SSG, roteamento i18n, componentes de UI
- **Sprint 4** — CI/CD: verificação de tipos, lint e suite de testes no GitHub Actions

Uma sprint dedicada à acessibilidade resolveu ==88 problemas de WCAG==, seguida por uma passagem orientada pelo Lighthouse que focou no bundle crítico, hints de preload de RSC e carregamento da imagem LCP.

A pasta \`docs/\` contém ==12 documentos de arquitetura numerados== — contextos delimitados, estratégia de validação, abordagem de i18n, estratégia de testes, padrões de código e glossário de domínio.

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

O domínio é organizado em três contextos delimitados — **portfolio** (projetos, experiências, skills, perfil), **identity** (autenticação e usuário) e **contact** (envio de mensagens) — cada um com suas próprias entidades, value objects e interfaces de repositório, compartilhando apenas o Shared Kernel.

Cada pacote tem uma única responsabilidade aplicada mecanicamente:

- **\`core\`** — modelo de domínio; zero dependências de framework; entidades, value objects, padrão Either, interfaces de repositório
- **\`application\`** — use cases e ports; depende apenas de \`core\`; sem Prisma, sem HTTP
- **\`infra\`** — implementações concretas; única camada que importa Prisma e Supabase
- **\`ui\`** — biblioteca de componentes React; dividida em \`View\` (exibição) e \`Control\` (interatividade)
- **\`utils\`** — utilitários TypeScript puros: \`Validator\`, formatadores, hooks de browser; sem dependência de React

## Site do Portfólio

==Server Components chamam use cases diretamente no build time== — não existe nenhuma camada REST entre o domínio e o HTML gerado. Para um site estático orientado a conteúdo, uma fronteira HTTP seria overhead puro.

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

A internacionalização é uma ==preocupação de domínio==: \`LocalizedText\` é um value object em \`core\`. O site renderiza em inglês, português e espanhol — resolvido na camada de domínio antes que qualquer componente React toque os dados.

Cada página exporta \`generateMetadata\` com \`title\`, \`description\` e campos \`openGraph\` localizados. Páginas de projetos derivam os dados de OG diretamente das entidades de domínio — título, caption e imagem de capa — garantindo que os metadados nunca fiquem fora de sincronia com o conteúdo. Uma ==rota de imagem OG== personalizada, construída com \`next/og\` no Edge Runtime, gera cards 1200×630 com identidade visual por página, locale e projeto.

As rotas de detalhe de projeto são orientadas pelo \`Slug\` — um value object em \`core\` — com \`generateStaticParams\` resolvendo cada slug de projeto publicado nas três locales no build time. Sem slug, sem rota.

O formulário de contato passa por rate limiting via Upstash Redis e entrega e-mail pelo Resend — ambos por trás de interfaces de porta, ==substituíveis e testáveis sem tocar a infraestrutura==.

Este portfólio é a primeira presença técnica pública que construí e possuo por completo — do modelo de domínio ao pipeline de deploy. O app admin para gerenciamento de conteúdo e o blog estão escopados como pós-MVP, mantendo o site atual focado e publicável.

## Destaques Técnicos

- **Sem camada de API** — Server Components consomem use cases no build time; um site estático não precisa de uma fronteira HTTP entre domínio e HTML
- **Direção de dependência aplicada pelo ESLint** — violações de camada são detectadas no lint time, não no code review; a fronteira é mecânica, não uma convenção
- **Padrão Either** — nenhuma exceção lançada para erros de domínio; \`Left<ValidationError>\` propaga pelos use cases até a UI, tornando todos os caminhos de erro explícitos e testáveis
- **LocalizedText como VO** — i18n é uma preocupação de domínio; componentes recebem strings já resolvidas, não chaves de tradução
- **Acessibilidade como sprint** — 88 problemas de WCAG rastreados, escopados e entregues como issues individuais com critérios de aceitação
- **Performance orientada pelo Lighthouse** — bundle crítico enxugado com lazy-loading de formulários pesados, remoção de \`'use client'\` desnecessários e preload da imagem LCP com \`fetchpriority=high\`
- **SEO e Open Graph** — cada página exporta \`generateMetadata\` localizado; uma rota \`/og\` no Edge Runtime gera cards 1200×630 por página, locale e projeto usando \`next/og\`; os dados de OG são derivados das entidades de domínio, nunca de strings estáticas

## Tecnologias

- [Next.js](https://nextjs.org) — App Router com SSG; \`generateStaticParams\` gera todas as rotas localizadas no build time
- [Turborepo](https://turbo.build) — orquestração de monorepo com cinco pacotes compartilhados e cache remoto no Vercel
- [TypeScript](https://www.typescriptlang.org) — modo strict em todos os pacotes; \`any\` é proibido
- [Prisma](https://www.prisma.io) — ORM e camada de migrations, isolado em \`packages/infra\`
- [Supabase](https://supabase.com) — banco de dados PostgreSQL e autenticação baseada em JWT
- [Tailwind CSS](https://tailwindcss.com) — tokens de design compartilhados via \`packages/tailwind-config\`
- [next-intl](https://next-intl.dev) — roteamento de locale e resolução de mensagens para EN, PT-BR e ES
- [Vitest](https://vitest.dev) — testes unitários e de integração em todos os pacotes; ~100 arquivos de teste
- [Upstash Redis](https://upstash.com) — rate limiting serverless no formulário de contato
- [Resend](https://resend.com) — e-mail transacional para envios do formulário de contato
- [Vercel](https://vercel.com) — deployment com cache remoto do Turborepo`,
        `Tras seis años en ingeniería de software, este portafolio fue la primera oportunidad de ser dueño de un producto completo — desde la arquitectura hasta el deploy. Construido para ir más allá de LinkedIn hacia una audiencia internacional, para buscar oportunidades en el exterior y para demostrar que ==Domain-Driven Design y Arquitectura Limpia== se sostienen en un proyecto solo desde cero — no solo en equipos donde el proceso es impuesto.

## Las Restricciones

La arquitectura fue autoimpuesta. Sin equipo, sin plazo y sin presión externa, la restricción vino de una decisión deliberada: tratar el proyecto como un producto real con un alcance de MVP, un roadmap post-MVP y sin atajos en la capa de dominio.

Tres requisitos moldearon cada decisión técnica:

- **Performance** — el sitio tenía que puntuar bien en Lighthouse; un portafolio lento envía el mensaje equivocado
- **Contenido sin cambiar código** — actualizar entradas de proyectos o experiencias no podía requerir un deploy; todo el contenido está ==impulsado por una base de datos con seed y renderizado como markdown==
- **i18n en todas las capas** — soportar inglés, portugués y español significaba resolver la internacionalización en la capa de dominio, no solo parchearlo en la UI

El diseño visual fue creado íntegramente en Figma por [Milena Kawai](https://www.instagram.com/miilenamayuri/), una amiga diseñadora que entregó la especificación completa desde cero.

## Proceso de Ingeniería

El backlog fue gestionado con **Task Master**, dividido en sprints rastreados como milestones de GitHub. GitHub Projects proporcionó un tablero Kanban para el seguimiento; cada issue seguía un template estructurado con contexto, criterios de aceptación, archivos relevantes y dependencias. Labels personalizadas organizaron el trabajo por sprint, prioridad y tipo.

El proyecto se estructuró en cinco PRDs numerados — uno por capa de arquitectura:

- **Sprint 0** — fundación del dominio (\`core\`): patrón Either, Value Objects, entidades, interfaces de repositorio
- **Sprint 1** — capa de aplicación: use cases, ports, DTOs
- **Sprint 2** — infraestructura: repositorios Prisma, gateway Supabase, contenedor de DI
- **Sprint 3** — sitio público: Next.js App Router, SSG, enrutamiento i18n, componentes de UI
- **Sprint 4** — CI/CD: verificación de tipos, linting y suite de pruebas en GitHub Actions

Un sprint dedicado a accesibilidad resolvió ==88 problemas de WCAG==, seguido de un paso orientado por Lighthouse que apuntó al bundle crítico, hints de preload de RSC y carga de la imagen LCP.

La carpeta \`docs/\` contiene ==12 documentos de arquitectura numerados== — contextos delimitados, estrategia de validación, enfoque de i18n, estrategia de pruebas, patrones de código y glosario de dominio.

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

El dominio está organizado en tres contextos delimitados — **portfolio** (proyectos, experiencias, skills, perfil), **identity** (autenticación y usuario) y **contact** (envío de mensajes) — cada uno con sus propias entidades, value objects e interfaces de repositorio, compartiendo solo el Shared Kernel.

Cada paquete tiene una única responsabilidad aplicada mecánicamente:

- **\`core\`** — modelo de dominio; cero dependencias de framework; entidades, value objects, patrón Either, interfaces de repositorio
- **\`application\`** — use cases y ports; depende solo de \`core\`; sin Prisma, sin HTTP
- **\`infra\`** — implementaciones concretas; única capa que importa Prisma y Supabase
- **\`ui\`** — biblioteca de componentes React; dividida en \`View\` (visualización) y \`Control\` (interactividad)
- **\`utils\`** — utilidades TypeScript puras: \`Validator\`, formateadores, hooks de browser; sin dependencia de React

## Sitio del Portafolio

==Los Server Components llaman a use cases directamente en el build time== — no existe ninguna capa REST entre el dominio y el HTML generado. Para un sitio estático orientado a contenido, un límite HTTP sería overhead puro.

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

La internacionalización es una ==preocupación de dominio==: \`LocalizedText\` es un value object en \`core\`. El sitio renderiza en inglés, portugués y español — resuelto en la capa de dominio antes de que cualquier componente React toque los datos.

Cada página exporta \`generateMetadata\` con campos \`title\`, \`description\` y \`openGraph\` localizados. Las páginas de proyectos derivan los datos de OG directamente de las entidades de dominio — título, caption e imagen de portada — asegurando que los metadatos nunca queden desincronizados con el contenido. Una ==ruta de imagen OG== personalizada, construida con \`next/og\` en el Edge Runtime, genera cards 1200×630 con identidad visual por página, locale y proyecto.

Las rutas de detalle de proyecto están impulsadas por \`Slug\` — un value object en \`core\` — con \`generateStaticParams\` resolviendo cada slug de proyecto publicado en las tres locales en build time. Sin slug, sin ruta.

El formulario de contacto pasa por rate limiting via Upstash Redis y entrega correo electrónico a través de Resend — ambos detrás de interfaces de puerto, ==intercambiables y testeables sin tocar la infraestructura==.

Este portafolio es la primera presencia técnica pública que construí y poseo completamente — desde el modelo de dominio hasta el pipeline de deploy. La app admin para gestión de contenido y el blog están previstos como post-MVP, manteniendo el sitio actual enfocado y publicable.

## Aspectos Destacados

- **Sin capa de API** — los Server Components consumen use cases en build time; un sitio estático no necesita un límite HTTP entre dominio y HTML
- **Dirección de dependencia aplicada por ESLint** — las violaciones de capa se detectan en lint time, no en code review; el límite es mecánico, no una convención
- **Patrón Either** — no se lanzan excepciones para errores de dominio; \`Left<ValidationError>\` se propaga por los use cases hasta la UI, haciendo todos los caminos de error explícitos y testeables
- **LocalizedText como VO** — i18n es una preocupación de dominio; los componentes reciben strings ya resueltos, no claves de traducción
- **Accesibilidad como sprint** — 88 problemas de WCAG rastreados, acotados y entregados como issues individuales con criterios de aceptación
- **Performance orientada por Lighthouse** — bundle crítico reducido con lazy-loading de formularios pesados, eliminación de \`'use client'\` innecesarios y preload de la imagen LCP con \`fetchpriority=high\`
- **SEO y Open Graph** — cada página exporta \`generateMetadata\` localizado; una ruta \`/og\` en Edge Runtime genera cards 1200×630 por página, locale y proyecto usando \`next/og\`; los datos de OG se derivan de las entidades de dominio, nunca de strings estáticos

## Tecnologías

- [Next.js](https://nextjs.org) — App Router con SSG; \`generateStaticParams\` genera todas las rutas localizadas en build time
- [Turborepo](https://turbo.build) — orquestación de monorepo con cinco paquetes compartidos y caché remoto en Vercel
- [TypeScript](https://www.typescriptlang.org) — modo strict en todos los paquetes; \`any\` está prohibido
- [Prisma](https://www.prisma.io) — ORM y capa de migraciones, aislado en \`packages/infra\`
- [Supabase](https://supabase.com) — base de datos PostgreSQL y autenticación basada en JWT
- [Tailwind CSS](https://tailwindcss.com) — tokens de diseño compartidos via \`packages/tailwind-config\`
- [next-intl](https://next-intl.dev) — enrutamiento de locale y resolución de mensajes para EN, PT-BR y ES
- [Vitest](https://vitest.dev) — pruebas unitarias e integración en todos los paquetes; ~100 archivos de prueba
- [Upstash Redis](https://upstash.com) — rate limiting serverless en el formulario de contacto
- [Resend](https://resend.com) — correo electrónico transaccional para envíos del formulario de contacto
- [Vercel](https://vercel.com) — deployment con caché remoto de Turborepo`,
      ),
      featured: true,
      status: 'PUBLISHED' as const,
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
      ],
      relatedProjectSlugs: ['b2b-ecommerce-platform'],
    },
    {
      id: ID.projects.b2bEcommerce,
      slug: 'b2b-ecommerce-platform',
      coverImageUrl:
        'https://placehold.co/1200x630/0f172a/34d399?text=B2B+E-Commerce',
      coverImageAlt: loc(
        'B2B e-commerce platform for construction materials',
        'Plataforma B2B de e-commerce para materiais de construção',
        'Plataforma B2B de e-commerce para materiales de construcción',
      ),
      title: loc('B2B E-Commerce Platform', 'Plataforma B2B de E-Commerce', 'Plataforma B2B de E-Commerce'),
      caption: loc(
        'Full-stack B2B platform for construction materials built with DDD, Clean Architecture, NestJS, and React.',
        'Plataforma B2B full-stack para materiais de construção construída com DDD, Arquitetura Limpa, NestJS e React.',
        'Plataforma B2B full-stack para materiales de construcción construida con DDD, Arquitectura Limpia, NestJS y React.',
      ),
      content: loc(
        `End-to-end engineering of a **B2B e-commerce platform** for construction materials, from system design to production delivery.

Designed scalable RESTful APIs following **Domain-Driven Design** and **Clean Architecture**, separating business rules from infrastructure concerns. The frontend was built with **React.js** and **Vite**, consuming the API via React Query with optimistic updates.

**Highlights**
- DDD aggregates, repositories, and domain events across bounded contexts
- NestJS modules with dependency injection and guard-based authorization
- PostgreSQL with Prisma ORM; migrations managed per environment
- AWS infrastructure (S3, EC2, RDS)
- Tailwind CSS design system shared between customer and backoffice portals`,
        `Engenharia completa de uma **plataforma B2B de e-commerce** para materiais de construção, desde o design do sistema até a entrega em produção.

Projetei APIs RESTful escaláveis seguindo **Domain-Driven Design** e **Arquitetura Limpa**, separando as regras de negócio das preocupações de infraestrutura. O frontend foi construído com **React.js** e **Vite**, consumindo a API via React Query com atualizações otimistas.

**Destaques**
- Agregados DDD, repositórios e eventos de domínio em contextos delimitados
- Módulos NestJS com injeção de dependência e autorização baseada em guards
- PostgreSQL com Prisma ORM; migrations gerenciadas por ambiente
- Infraestrutura AWS (S3, EC2, RDS)
- Design system Tailwind CSS compartilhado entre os portais de clientes e backoffice`,
        `Ingeniería completa de una **plataforma B2B de e-commerce** para materiales de construcción, desde el diseño del sistema hasta la entrega en producción.

Diseñé APIs RESTful escalables siguiendo **Domain-Driven Design** y **Arquitectura Limpia**, separando las reglas de negocio de las preocupaciones de infraestructura. El frontend fue construido con **React.js** y **Vite**, consumiendo la API mediante React Query con actualizaciones optimistas.

**Aspectos Destacados**
- Agregados DDD, repositorios y eventos de dominio en contextos delimitados
- Módulos NestJS con inyección de dependencias y autorización basada en guards
- PostgreSQL con Prisma ORM; migraciones gestionadas por entorno
- Infraestructura AWS (S3, EC2, RDS)
- Sistema de diseño Tailwind CSS compartido entre los portales de clientes y backoffice`,
      ),
      featured: true,
      status: 'PUBLISHED' as const,
      periodStart: new Date('2023-05-01'),
      periodEnd: new Date('2024-06-30'),
      skillIds: [
        ID.skills.typescript,
        ID.skills.react,
        ID.skills.nodejs,
        ID.skills.nestjs,
        ID.skills.postgresql,
        ID.skills.aws,
        ID.skills.tailwindcss,
      ],
      relatedProjectSlugs: ['personal-portfolio'],
    },
    {
      id: ID.projects.gamePlatform,
      slug: 'game-intelligence-platform',
      coverImageUrl:
        'https://placehold.co/1200x630/0f0f1a/818cf8?text=Game+Intelligence',
      coverImageAlt: loc(
        'Game research and data intelligence platform',
        'Plataforma de pesquisa de games e inteligência de dados',
        'Plataforma de investigación de videojuegos e inteligencia de datos',
      ),
      title: loc(
        'Game Intelligence Platform',
        'Plataforma de Inteligência de Games',
        'Plataforma de Inteligencia de Videojuegos',
      ),
      caption: loc(
        'A data intelligence platform for the games industry, delivering insights 200% faster than traditional research institutes.',
        'Plataforma de inteligência de dados para a indústria de games, entregando insights 200% mais rápido que institutos de pesquisa tradicionais.',
        'Plataforma de inteligencia de datos para la industria de los videojuegos, entregando insights 200% más rápido que los institutos de investigación tradicionales.',
      ),
      content: loc(
        `A **game research and data intelligence platform** that aggregates market data and delivers actionable insights to studios and publishers significantly faster than traditional research methods.

Built the entire frontend with **React.js**, **Material UI**, and **GraphQL**, including data visualization dashboards and complex filter/search workflows.

**Highlights**
- Full mobile adaptation of a desktop-first platform — responsive across all breakpoints
- GraphQL queries and mutations with Apollo Client; real-time data subscriptions
- Custom charting components built on top of Material UI and Recharts
- Delivered 200% faster applicable intelligence than research institutes`,
        `Uma **plataforma de pesquisa de games e inteligência de dados** que agrega dados de mercado e entrega insights acionáveis a estúdios e publishers significativamente mais rápido do que os métodos de pesquisa tradicionais.

Construí todo o frontend com **React.js**, **Material UI** e **GraphQL**, incluindo dashboards de visualização de dados e fluxos complexos de filtro/busca.

**Destaques**
- Adaptação mobile completa de uma plataforma desktop-first — responsiva em todos os breakpoints
- Queries e mutations GraphQL com Apollo Client; subscrições de dados em tempo real
- Componentes de gráficos personalizados construídos sobre Material UI e Recharts
- Entregou inteligência aplicável 200% mais rápido do que institutos de pesquisa`,
        `Una **plataforma de investigación de videojuegos e inteligencia de datos** que agrega datos de mercado y entrega insights accionables a estudios y publishers significativamente más rápido que los métodos de investigación tradicionales.

Construí todo el frontend con **React.js**, **Material UI** y **GraphQL**, incluyendo dashboards de visualización de datos y flujos complejos de filtrado/búsqueda.

**Aspectos Destacados**
- Adaptación móvil completa de una plataforma desktop-first — responsiva en todos los breakpoints
- Consultas y mutaciones GraphQL con Apollo Client; suscripciones de datos en tiempo real
- Componentes de gráficos personalizados construidos sobre Material UI y Recharts
- Entregó inteligencia aplicable un 200% más rápido que los institutos de investigación`,
      ),
      featured: false,
      status: 'PUBLISHED' as const,
      periodStart: new Date('2023-10-01'),
      periodEnd: new Date('2023-12-31'),
      skillIds: [ID.skills.typescript, ID.skills.react, ID.skills.graphql],
      relatedProjectSlugs: [],
    },
    {
      id: ID.projects.buyrShopifyApp,
      slug: 'buyr-shopify-app',
      coverImageUrl:
        'https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/promotional_image/CMfgkeeMwI4DEAE=.png',
      coverImageAlt: loc(
        'Buyr Shopify app — interactive pricing and AI offer negotiation',
        'App Buyr para Shopify — precificação interativa e negociação de ofertas por IA',
        'App Buyr para Shopify — precios interactivos y negociación de ofertas por IA',
      ),
      title: loc('Buyr — Shopify App', 'Buyr — App para Shopify', 'Buyr — App para Shopify'),
      caption: loc(
        'A public Shopify app with AI-powered offer negotiation — built across storefront and merchant admin with a focus on performance, isolation, and polish.',
        'App público da Shopify com negociação de ofertas por IA — construído no storefront e no admin do merchant com foco em performance, isolamento e polimento.',
        'App público de Shopify con negociación de ofertas por IA — construido en el storefront y el admin del merchant con foco en performance, aislamiento y polish.',
      ),
      content: loc(
        `[Buyr](https://apps.shopify.com/buyr) is a public Shopify app that lets shoppers set their own price or negotiate with an AI agent — ==capturing orders that would otherwise be lost at full price==. Merchants configure profitability thresholds; Buyr handles the negotiation automatically.

I was brought in to solve an animation problem no one on the team had tackled before, and ended up contributing across both sides of the product: the storefront experience buyers see and the merchant admin dashboard. Working with a distributed team across Brazil and the United States, we delivered the MVP against a fixed deadline, followed by a post-MVP improvement phase.

## The Constraints

The app runs embedded inside any Shopify storefront theme — with no control over the host's CSS, JavaScript environment, or component structure. A merchant running a minimalist theme and another running a custom brand theme would silently break the same widget in different ways.

On top of that, ==Shopify's own acceptance criteria imposed strict performance thresholds the app had to meet to stay listed in the App Store==. Performance wasn't optional — it was a gate.

![Interactive price input and AI negotiation chat interface](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CIX6nOeMwI4DEAE=.png)

*The storefront widget — interactive price input with AI negotiation chat.*

## Storefront

### Rebuilding the animation system

The storefront widget had an animation system — but only as compiled vanilla JavaScript with no readable source. ==I reverse-engineered the behavior visually and rebuilt it from scratch using **Framer Motion**==, making it a proper state-driven system connected to the offer lifecycle:

- **Idle** — ambient animated circles while the shopper browses
- **In progress** — active animation while the offer is being created
- **Success** — confetti burst with a yellow checkmark circle
- **Existing offer** — distinct animation state for returning shoppers

State was managed via React Context API, flowing through the entire storefront component tree.

### Solving CSS isolation with Shadow DOM

While testing across different Shopify themes, I found that merchant CSS would leak into the widget and break the layout in unpredictable ways. ==I investigated the root cause, identified Shadow DOM as the right boundary, and implemented it to fully isolate the app's styles== from whatever the host storefront was doing. This wasn't a requirement — it was a decision I made after diagnosing the problem.

### Performance improvements

Meeting Shopify's App Store performance requirements meant treating performance as a deliverable, not an afterthought. I studied comparable apps in the store, tracked metrics in a spreadsheet, and drove the following improvements:

- **On-demand rendering** — only mount the widget when it's actually needed
- **Dead code removal** — stripped unused dependencies and unreachable branches
- **Offer flow simplification** — reduced steps and component depth in the critical path
- **Refactoring** — replaced inefficient loops, over-engineered hooks, and global state misuse

## Merchant Admin

![Real-time offer management dashboard for merchants](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CIP0xLL234wDEAE=.png)

*Real-time offer management — merchants see and act on incoming offers as they arrive.*

On the merchant side, I built three screens using **Shopify Polaris**:

- **Offer acceptance flow** — pixel-perfect implementation of how merchants review and accept incoming offers
- **Analytics screen** — dashboard giving merchants visibility into received vs. accepted offers over time
- **Onboarding / welcome screen** — guided setup experience for merchants installing the app for the first time

![Custom pricing models configuration screen](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CK35r7L234wDEAE=.png)

*Custom pricing models — merchants define thresholds and discount rules per product.*

## Technical Highlights

- **Monorepo with npm workspaces** — storefront (Vite + Tailwind) and merchant admin (Shopify Polaris) as fully separate apps
- **Framer Motion** — multi-state, choreographed animation system driven by React Context API
- **Shadow DOM** — CSS isolation across unpredictable storefront host environments
- **Shopify App Bridge**, **Theme App Extensions**, and **Storefront API** — learned and applied in full across both contexts
- **Fixed deadline** delivery with a structured post-MVP improvement phase

## Technologies

- [React](https://react.dev) — storefront widget and merchant admin UI; state managed via Context API across both apps
- [Framer Motion](https://www.framer.com/motion/) — multi-state animation system for the offer lifecycle (idle, in progress, success, existing offer)
- [Shopify Polaris](https://polaris.shopify.com) — component library for the three merchant admin screens
- [Tailwind CSS](https://tailwindcss.com) — storefront widget styling, scoped inside Shadow DOM
- [Vite](https://vitejs.dev) — storefront bundler; critical for the performance optimizations that met App Store requirements
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge) — session management and Shopify admin integration
- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) — delivery mechanism for the storefront widget into merchant themes
- [Storefront API](https://shopify.dev/docs/api/storefront) — Shopify product and cart data access
- [TypeScript](https://www.typescriptlang.org) — type safety across both apps
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) — monorepo keeping storefront and admin as separate packages`,
        `[Buyr](https://apps.shopify.com/buyr) é um app público da Shopify que permite compradores definir seu próprio preço ou negociar com um agente de IA — ==capturando pedidos que de outra forma seriam perdidos ao preço cheio==. Merchants configuram limites de lucratividade; o Buyr cuida da negociação automaticamente.

Fui convidado para resolver um problema de animação que ninguém no time havia enfrentado antes, e acabei contribuindo nos dois lados do produto: a experiência do storefront vista pelos compradores e o painel de administração dos merchants. Trabalhando com um time distribuído entre Brasil e Estados Unidos, entregamos o MVP dentro de um prazo fixo, seguido por uma fase de melhorias pós-MVP.

## As Restrições

O app roda incorporado dentro de qualquer tema de storefront da Shopify — sem controle sobre o CSS, o ambiente JavaScript ou a estrutura de componentes do host. Um merchant usando um tema minimalista e outro com um tema de marca customizado poderiam quebrar o mesmo widget de formas silenciosas e diferentes.

Além disso, ==os próprios critérios de aceitação da Shopify impõem limites rígidos de performance que o app precisava atingir para permanecer listado na App Store==. Performance não era opcional — era um requisito de aprovação.

![Interface de entrada de preço interativa e chat de negociação por IA](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CIX6nOeMwI4DEAE=.png)

*O widget do storefront — entrada de preço interativa com chat de negociação por IA.*

## Storefront

### Reconstruindo o sistema de animações

O widget do storefront tinha um sistema de animações — mas apenas como JavaScript vanilla compilado, sem código-fonte legível. ==Fiz engenharia reversa do comportamento visualmente e o reconstruí do zero usando **Framer Motion**==, transformando-o em um sistema orientado a estado conectado ao ciclo de vida das ofertas:

- **Idle** — círculos animados em segundo plano enquanto o comprador navega
- **Em andamento** — animação ativa enquanto a oferta é criada
- **Sucesso** — explosão de confetes com um círculo de marcação amarela
- **Oferta existente** — estado de animação distinto para compradores que retornam

O estado era gerenciado via React Context API, fluindo por toda a árvore de componentes do storefront.

### Resolvendo o isolamento de CSS com Shadow DOM

Ao testar em diferentes temas da Shopify, descobri que o CSS dos merchants vazava para dentro do widget e quebrava o layout de formas imprevisíveis. ==Investiguei a causa raiz, identifiquei o Shadow DOM como o limite correto e o implementei para isolar completamente os estilos do app== de qualquer coisa que o storefront host estivesse fazendo. Isso não era um requisito — foi uma decisão que tomei após diagnosticar o problema.

### Melhorias de performance

Atender aos requisitos de performance da App Store da Shopify significou tratar performance como um entregável, não como um detalhe. Estudei apps comparáveis na loja, rastreei métricas em uma planilha e conduzi as seguintes melhorias:

- **Renderização sob demanda** — montar o widget apenas quando realmente necessário
- **Remoção de código morto** — eliminação de dependências não utilizadas e ramificações inacessíveis
- **Simplificação do fluxo de oferta** — redução de etapas e profundidade de componentes no caminho crítico
- **Refatoração** — substituição de loops ineficientes, hooks super-engenheirados e uso indevido de estado global

## Administração dos Merchants

![Painel de gerenciamento de ofertas em tempo real para merchants](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CIP0xLL234wDEAE=.png)

*Gerenciamento de ofertas em tempo real — merchants veem e agem sobre as ofertas recebidas conforme chegam.*

No lado dos merchants, construí três telas usando **Shopify Polaris**:

- **Fluxo de aceitação de ofertas** — implementação pixel-perfect de como merchants revisam e aceitam ofertas recebidas
- **Tela de analytics** — painel que dá aos merchants visibilidade sobre ofertas recebidas vs. aceitas ao longo do tempo
- **Tela de onboarding / boas-vindas** — experiência guiada de configuração para merchants instalando o app pela primeira vez

![Tela de configuração de modelos de precificação personalizados](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CK35r7L234wDEAE=.png)

*Modelos de precificação personalizados — merchants definem limites e regras de desconto por produto.*

## Destaques Técnicos

- **Monorepo com npm workspaces** — storefront (Vite + Tailwind) e admin dos merchants (Shopify Polaris) como apps completamente separados
- **Framer Motion** — sistema de animação com múltiplos estados e coreografia, orientado por React Context API
- **Shadow DOM** — isolamento de CSS em ambientes de storefront imprevisíveis
- **Shopify App Bridge**, **Theme App Extensions** e **Storefront API** — aprendidos e aplicados integralmente em ambos os contextos
- **Entrega dentro do prazo fixo** com uma fase estruturada de melhorias pós-MVP

## Tecnologias

- [React](https://react.dev) — widget do storefront e UI do admin dos merchants; estado gerenciado via Context API em ambos os apps
- [Framer Motion](https://www.framer.com/motion/) — sistema de animação com múltiplos estados para o ciclo de vida das ofertas (idle, em andamento, sucesso, oferta existente)
- [Shopify Polaris](https://polaris.shopify.com) — biblioteca de componentes para as três telas do admin dos merchants
- [Tailwind CSS](https://tailwindcss.com) — estilização do widget do storefront, escopada dentro do Shadow DOM
- [Vite](https://vitejs.dev) — bundler do storefront; decisivo para as otimizações de performance que atenderam os requisitos da App Store
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge) — gerenciamento de sessão e integração com o admin da Shopify
- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) — mecanismo de entrega do widget do storefront nos temas dos merchants
- [Storefront API](https://shopify.dev/docs/api/storefront) — acesso a dados de produtos e carrinho da Shopify
- [TypeScript](https://www.typescriptlang.org) — tipagem estática em ambos os apps
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) — monorepo mantendo storefront e admin como pacotes separados`,
        `[Buyr](https://apps.shopify.com/buyr) es una app pública de Shopify que permite a los compradores fijar su propio precio o negociar con un agente de IA — ==capturando pedidos que de otro modo se perderían al precio completo==. Los merchants configuran umbrales de rentabilidad; Buyr gestiona la negociación automáticamente.

Fui convocado para resolver un problema de animación que nadie en el equipo había abordado antes, y terminé contribuyendo en ambos lados del producto: la experiencia del storefront que ven los compradores y el panel de administración de merchants. Trabajando con un equipo distribuido entre Brasil y Estados Unidos, entregamos el MVP en un plazo fijo, seguido de una fase de mejoras post-MVP.

## Las Restricciones

La app se ejecuta integrada dentro de cualquier tema de storefront de Shopify — sin control sobre el CSS, el entorno JavaScript o la estructura de componentes del host. Un merchant con un tema minimalista y otro con un tema de marca personalizado podrían romper el mismo widget de formas silenciosas y distintas.

Además, ==los propios criterios de aceptación de Shopify imponen umbrales de rendimiento estrictos que la app debía cumplir para mantenerse en la App Store==. El rendimiento no era opcional — era un requisito de aprobación.

![Interfaz de entrada de precio interactiva y chat de negociación con IA](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CIX6nOeMwI4DEAE=.png)

*El widget del storefront — entrada de precio interactiva con chat de negociación por IA.*

## Storefront

### Reconstruyendo el sistema de animaciones

El widget del storefront tenía un sistema de animaciones — pero solo como JavaScript vanilla compilado, sin código fuente legible. ==Realicé ingeniería inversa del comportamiento visualmente y lo reconstruí desde cero usando **Framer Motion**==, convirtiéndolo en un sistema orientado a estados conectado al ciclo de vida de las ofertas:

- **Idle** — círculos animados en segundo plano mientras el comprador navega
- **En progreso** — animación activa mientras se crea la oferta
- **Éxito** — explosión de confeti con un círculo de verificación amarillo
- **Oferta existente** — estado de animación distinto para compradores que regresan

El estado se gestionó mediante React Context API, fluyendo por todo el árbol de componentes del storefront.

### Resolviendo el aislamiento de CSS con Shadow DOM

Al probar en distintos temas de Shopify, descubrí que el CSS de los merchants se filtraba al widget y rompía el diseño de formas impredecibles. ==Investigué la causa raíz, identifiqué Shadow DOM como el límite correcto y lo implementé para aislar completamente los estilos de la app== de lo que hiciera el storefront anfitrión. Esto no era un requisito — fue una decisión que tomé tras diagnosticar el problema.

### Mejoras de rendimiento

Cumplir los requisitos de rendimiento de la App Store de Shopify significó tratar el rendimiento como un entregable, no como un detalle. Estudié apps comparables en la tienda, rastreé métricas en una hoja de cálculo e impulsé las siguientes mejoras:

- **Renderizado bajo demanda** — montar el widget solo cuando realmente se necesita
- **Eliminación de código muerto** — eliminación de dependencias no utilizadas y ramas inalcanzables
- **Simplificación del flujo de oferta** — reducción de pasos y profundidad de componentes en el camino crítico
- **Refactorización** — reemplazo de bucles ineficientes, hooks sobre-diseñados y mal uso del estado global

## Administración de Merchants

![Panel de gestión de ofertas en tiempo real para merchants](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CIP0xLL234wDEAE=.png)

*Gestión de ofertas en tiempo real — los merchants ven y actúan sobre las ofertas entrantes a medida que llegan.*

En el lado de los merchants, construí tres pantallas usando **Shopify Polaris**:

- **Flujo de aceptación de ofertas** — implementación pixel-perfect de cómo los merchants revisan y aceptan las ofertas entrantes
- **Pantalla de analytics** — panel que da a los merchants visibilidad sobre las ofertas recibidas vs. aceptadas a lo largo del tiempo
- **Pantalla de onboarding / bienvenida** — experiencia guiada de configuración para merchants que instalan la app por primera vez

![Pantalla de configuración de modelos de precios personalizados](https://cdn.shopify.com/app-store/listing_images/6537909634eb9e249e1de55ca0ba2f65/desktop_screenshot/CK35r7L234wDEAE=.png)

*Modelos de precios personalizados — los merchants definen umbrales y reglas de descuento por producto.*

## Aspectos Técnicos Destacados

- **Monorepo con npm workspaces** — storefront (Vite + Tailwind) y admin de merchants (Shopify Polaris) como apps completamente separadas
- **Framer Motion** — sistema de animación con múltiples estados y coreografía, impulsado por React Context API
- **Shadow DOM** — aislamiento de CSS en entornos de storefront impredecibles
- **Shopify App Bridge**, **Theme App Extensions** y **Storefront API** — aprendidos y aplicados íntegramente en ambos contextos
- **Entrega en plazo fijo** con una fase estructurada de mejoras post-MVP

## Tecnologías

- [React](https://react.dev) — widget del storefront y UI del admin de merchants; estado gestionado via Context API en ambas apps
- [Framer Motion](https://www.framer.com/motion/) — sistema de animación con múltiples estados para el ciclo de vida de las ofertas (idle, en progreso, éxito, oferta existente)
- [Shopify Polaris](https://polaris.shopify.com) — biblioteca de componentes para las tres pantallas del admin de merchants
- [Tailwind CSS](https://tailwindcss.com) — estilos del widget del storefront, encapsulados dentro del Shadow DOM
- [Vite](https://vitejs.dev) — bundler del storefront; clave para las optimizaciones de performance que cumplieron los requisitos de la App Store
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge) — gestión de sesión e integración con el admin de Shopify
- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) — mecanismo de entrega del widget del storefront en los temas de los merchants
- [Storefront API](https://shopify.dev/docs/api/storefront) — acceso a datos de productos y carrito de Shopify
- [TypeScript](https://www.typescriptlang.org) — tipado estático en ambas apps
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) — monorepo manteniendo storefront y admin como paquetes separados`,
      ),
      featured: false,
      status: 'PUBLISHED' as const,
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
      id: ID.projects.mqttClient,
      slug: 'react-mqtt-websocket',
      coverImageUrl:
        'https://placehold.co/1200x630/0f172a/60a5fa?text=React+MQTT',
      coverImageAlt: loc(
        'Open-source MQTT client library for React',
        'Biblioteca open-source de cliente MQTT para React',
        'Biblioteca open-source de cliente MQTT para React',
      ),
      title: loc('React MQTT WebSocket', 'React MQTT WebSocket', 'React MQTT WebSocket'),
      caption: loc(
        'An open-source MQTT client library for React with hooks-based API and real-time topic subscriptions.',
        'Biblioteca open-source de cliente MQTT para React com API baseada em hooks e subscrições de tópicos em tempo real.',
        'Biblioteca open-source de cliente MQTT para React con API basada en hooks y suscripciones de tópicos en tiempo real.',
      ),
      content: loc(
        `An **open-source MQTT client library** for React applications, created to simplify integration with MQTT brokers over WebSocket in real-time web platforms.

Developed while working at FDTE on industrial and public-sector platforms that required live data from IoT devices and event-driven systems.

**Highlights**
- Hooks-based API (\`useMqtt\`, \`useSubscription\`) following React idioms
- Automatic reconnection with exponential backoff
- TypeScript-first with full type inference for message payloads
- Zero dependencies beyond the standard MQTT.js client`,
        `Uma **biblioteca open-source de cliente MQTT** para aplicações React, criada para simplificar a integração com brokers MQTT via WebSocket em plataformas web em tempo real.

Desenvolvida enquanto trabalhava na FDTE em plataformas industriais e do setor público que exigiam dados ao vivo de dispositivos IoT e sistemas orientados a eventos.

**Destaques**
- API baseada em hooks (\`useMqtt\`, \`useSubscription\`) seguindo os idiomas do React
- Reconexão automática com backoff exponencial
- TypeScript-first com inferência de tipos completa para payloads de mensagens
- Zero dependências além do cliente padrão MQTT.js`,
        `Una **biblioteca open-source de cliente MQTT** para aplicaciones React, creada para simplificar la integración con brokers MQTT vía WebSocket en plataformas web en tiempo real.

Desarrollada mientras trabajaba en FDTE en plataformas industriales y del sector público que requerían datos en vivo de dispositivos IoT y sistemas orientados a eventos.

**Aspectos Destacados**
- API basada en hooks (\`useMqtt\`, \`useSubscription\`) siguiendo los idiomas de React
- Reconexión automática con backoff exponencial
- TypeScript-first con inferencia de tipos completa para payloads de mensajes
- Sin dependencias más allá del cliente estándar MQTT.js`,
      ),
      featured: false,
      status: 'PUBLISHED' as const,
      periodStart: new Date('2022-01-01'),
      periodEnd: new Date('2022-06-01'),
      skillIds: [ID.skills.typescript, ID.skills.react, ID.skills.nodejs],
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
        featured: project.featured,
        status: project.status,
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
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil'),
      description: loc(
        'Built and evolved frontend solutions for internal operations, AI-powered customer experiences, and Shopify-based commerce products. Owned the frontend implementation of an internal timesheet platform, contributing to architecture decisions, scalability, and product foundations for future ERP evolution. Developed an embeddable AI assistant widget for a golf revenue management platform serving over 800 golf courses, collaborating with an international team in a sprint-based delivery cycle. Worked across sprint and Kanban environments with a focus on performance, accessibility, security, and maintainable frontend architecture.',
        'Desenvolveu e evoluiu soluções frontend para operações internas, experiências de cliente com IA e produtos baseados em Shopify. Liderou a implementação frontend de uma plataforma interna de timesheet, contribuindo para decisões de arquitetura, escalabilidade e fundações de produto. Desenvolveu um widget de assistente de IA incorporável para uma plataforma de gestão de receita de golf com mais de 800 campos, colaborando com um time internacional. Trabalhou em ambientes de sprint e Kanban com foco em performance, acessibilidade, segurança e arquitetura frontend sustentável.',
      ),
      logoUrl: 'https://placehold.co/80x80/1e3a5f/60a5fa?text=FDTE',
      logoAlt: loc('FDTE logo', 'Logo da FDTE'),
      employmentType: 'FULL_TIME' as const,
      locationType: 'HYBRID' as const,
      startAt: new Date('2024-10-01'),
      endAt: null,
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
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil'),
      description: loc(
        'Engineered a B2B e-commerce platform for construction materials, taking the product from planning to delivery. Built scalable frontend and backend solutions aligned with brand consistency and regional sales requirements. Designed and implemented RESTful APIs applying DDD and Clean Architecture principles. Owned the frontend development of a phone management and VoIP portal with ACL-based permissions. Improved usability and maintainability across key user journeys working in a Kanban-based delivery environment.',
        'Desenvolveu uma plataforma B2B de e-commerce para materiais de construção, do planejamento à entrega. Construiu soluções frontend e backend escaláveis alinhadas com consistência de marca e requisitos regionais. Projetou e implementou APIs RESTful com DDD e Arquitetura Limpa. Liderou o frontend de um portal de gestão de telefonia e VoIP com permissões baseadas em ACL. Melhorou a usabilidade e manutenibilidade em jornadas-chave em um ambiente de entrega baseado em Kanban.',
      ),
      logoUrl: 'https://placehold.co/80x80/1e293b/34d399?text=WESF',
      logoAlt: loc('WESF IT Services logo', 'Logo da WESF IT Services'),
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
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil'),
      description: loc(
        'Developed a game research and data intelligence platform focused on making insights more accessible and actionable. Rebuilt a back-office page from scratch to support dynamic question creation for synthetic research form workflows. Adapted the product for mobile devices, improving usability across different screen sizes. Enhanced the overall user experience through better interfaces and more intuitive user flows in a Kanban-based environment.',
        'Desenvolveu uma plataforma de pesquisa de games e inteligência de dados focada em tornar insights mais acessíveis e acionáveis. Reconstruiu uma página de back-office do zero para suportar criação dinâmica de questões em fluxos de formulários de pesquisa sintética. Adaptou o produto para dispositivos móveis, melhorando a usabilidade em diferentes tamanhos de tela. Aprimorou a experiência do usuário com interfaces melhores e fluxos mais intuitivos em ambiente Kanban.',
      ),
      logoUrl: 'https://placehold.co/80x80/0f0f1a/818cf8?text=GAL',
      logoAlt: loc('Galaxies logo', 'Logo da Galaxies'),
      employmentType: 'FULL_TIME' as const,
      locationType: 'ONSITE' as const,
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
      location: loc('São Paulo, Brazil', 'São Paulo, Brasil'),
      description: loc(
        'Contributed to complex web platforms involving custom forms, workflow management, and operational systems. Built frontend solutions for a public bidding evaluation platform with advanced forms, file uploads, and browser-based document handling. Architected the frontend foundation and design system for an e-commerce platform, improving structure, consistency, and maintainability. Strengthened engineering quality through CI/CD practices, end-to-end testing, and collaboration across sprint- and Kanban-based environments. Created a public open-source MQTT/WebSocket library and mentored junior developers to improve code quality and delivery consistency.',
        'Contribuiu para plataformas web complexas envolvendo formulários customizados, gestão de workflows e sistemas operacionais. Construiu soluções frontend para uma plataforma de avaliação de licitações públicas com formulários avançados e upload de arquivos. Arquitetou a fundação frontend e o design system de uma plataforma de e-commerce, melhorando estrutura, consistência e manutenibilidade. Fortaleceu a qualidade de engenharia com práticas de CI/CD e testes end-to-end. Criou uma biblioteca open-source de MQTT/WebSocket e mentorou desenvolvedores juniores para melhorar qualidade de código e consistência de entrega.',
      ),
      logoUrl: 'https://placehold.co/80x80/1e3a5f/60a5fa?text=FDTE',
      logoAlt: loc('FDTE logo', 'Logo da FDTE'),
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
      ),
      order: 0,
    },
    {
      id: ID.professionalValues.agility,
      icon: 'material-symbols:acute-rounded',
      content: loc(
        'Shipping solutions quickly and iteratively while maintaining quality and architectural integrity.',
        'Entregar soluções de forma rápida e iterativa, mantendo qualidade e integridade arquitetural.',
      ),
      order: 1,
    },
    {
      id: ID.professionalValues.versatility,
      icon: 'material-symbols:sdk-rounded',
      content: loc(
        'Comfortable across the full stack — from domain modeling and APIs to UI, accessibility, and performance.',
        'Confortável em todo o stack — do modelamento de domínio e APIs até UI, acessibilidade e performance.',
      ),
      order: 2,
    },
    {
      id: ID.professionalValues.communication,
      icon: 'material-symbols:3p-rounded',
      content: loc(
        'Clear communication with teammates and stakeholders to align expectations and deliver with confidence.',
        'Comunicação clara com o time e stakeholders para alinhar expectativas e entregar com confiança.',
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
