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
        `A production-grade monorepo portfolio built with **Next.js 16**, **TypeScript**, and **Prisma** following Domain-Driven Design and Clean Architecture principles.

The project is split across four layers — \`core\`, \`application\`, \`infra\`, and \`site\` — each with strict dependency rules enforced by ESLint. Authentication is handled via Supabase with JWT tokens and httpOnly cookies.

**Architecture**

\`\`\`mermaid
flowchart TD
  site["apps/site (Next.js)"]
  admin["apps/admin (Next.js)"]
  app["packages/application"]
  core["packages/core"]
  infra["packages/infra"]
  db[(Supabase / PostgreSQL)]

  site --> app
  admin --> app
  app --> core
  infra --> app
  infra --> db
\`\`\`

**Highlights**
- Turborepo monorepo with shared packages (\`ui\`, \`utils\`, \`core\`, \`application\`, \`infra\`)
- Either pattern for error handling — no exceptions thrown for domain errors
- Vitest test suite with fake gateways and in-memory repositories
- Admin app built as a dedicated Next.js app with a proxy auth layer
- next-intl for English/Portuguese internationalization`,
        `Portfólio monorepo de nível de produção construído com **Next.js 16**, **TypeScript** e **Prisma** seguindo princípios de Domain-Driven Design e Arquitetura Limpa.

O projeto é dividido em quatro camadas — \`core\`, \`application\`, \`infra\` e \`site\` — cada uma com regras rígidas de dependência aplicadas pelo ESLint. A autenticação é feita via Supabase com tokens JWT e cookies httpOnly.

**Arquitetura**

\`\`\`mermaid
flowchart TD
  site["apps/site (Next.js)"]
  admin["apps/admin (Next.js)"]
  app["packages/application"]
  core["packages/core"]
  infra["packages/infra"]
  db[(Supabase / PostgreSQL)]

  site --> app
  admin --> app
  app --> core
  infra --> app
  infra --> db
\`\`\`

**Destaques**
- Monorepo Turborepo com pacotes compartilhados (\`ui\`, \`utils\`, \`core\`, \`application\`, \`infra\`)
- Padrão Either para tratamento de erros — nenhuma exceção lançada para erros de domínio
- Suite de testes Vitest com gateways falsos e repositórios em memória
- App admin construído como um app Next.js dedicado com camada de autenticação via proxy
- next-intl para internacionalização em Inglês/Português`,
        `Portafolio monorepo de nivel de producción construido con **Next.js 16**, **TypeScript** y **Prisma** siguiendo principios de Domain-Driven Design y Arquitectura Limpia.

El proyecto está dividido en cuatro capas — \`core\`, \`application\`, \`infra\` y \`site\` — cada una con reglas estrictas de dependencia aplicadas por ESLint. La autenticación se realiza mediante Supabase con tokens JWT y cookies httpOnly.

**Arquitectura**

\`\`\`mermaid
flowchart TD
  site["apps/site (Next.js)"]
  admin["apps/admin (Next.js)"]
  app["packages/application"]
  core["packages/core"]
  infra["packages/infra"]
  db[(Supabase / PostgreSQL)]

  site --> app
  admin --> app
  app --> core
  infra --> app
  infra --> db
\`\`\`

**Aspectos Destacados**
- Monorepo Turborepo con paquetes compartidos (\`ui\`, \`utils\`, \`core\`, \`application\`, \`infra\`)
- Patrón Either para el manejo de errores — sin excepciones lanzadas para errores de dominio
- Suite de pruebas Vitest con gateways falsos y repositorios en memoria
- App admin construida como una app Next.js dedicada con capa de autenticación vía proxy
- next-intl para internacionalización en Inglés/Portugués`,
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
        ID.skills.docker,
        ID.skills.tailwindcss,
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
- **Fixed deadline** delivery with a structured post-MVP improvement phase`,
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
- **Entrega dentro do prazo fixo** com uma fase estruturada de melhorias pós-MVP`,
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
- **Entrega en plazo fijo** con una fase estructurada de mejoras post-MVP`,
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
