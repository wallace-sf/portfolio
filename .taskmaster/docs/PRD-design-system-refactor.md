# PRD — Design System & Feature Architecture Refactor
**Projeto:** wallace-sf/portfolio  
**App:** apps/web (Next.js 14, App Router, TypeScript, Tailwind CSS v3)  
**Monorepo:** Turborepo com packages compartilhados  
**Status:** Pré-MVP  
**Revisão:** 2026-05-16 — auditoria do código real aplicada; ver seção [Alterações desta revisão](#alterações-desta-revisão)  
**Objetivo:** Reorganizar o design system em `@repo/ui` e migrar componentes de feature para `apps/web/src/features`, eliminando tokens hardcoded e preparando o dark/light mode para funcionar corretamente.

---

## Alterações desta revisão

Divergências encontradas entre o PRD original e o estado real do código:

| Item | PRD original dizia | Realidade encontrada |
|---|---|---|
| Tarefa 1.3 | `useTheme` não detectava `system` | `useDarkMode` (usehooks-ts) já detecta `prefers-color-scheme`; o que falta é adicionar a classe `light` no `<html>` |
| Tarefa 1.4 | `globals.css` só tinha CSS vars de header | `globals.css` tem `@tailwind base/components/utilities` + CSS vars — duplicação real existe |
| Tarefa 4.3 | Projects page tinha "apenas HeroBanner" | Já busca projetos da API e renderiza `HeroBanner + ProjectList view="grid"` com dados reais |
| Tarefa 6.8 | ProjectDetail route e componente não existiam | Rota `[slug]`, page e `ProjectDetail/index.tsx` já existem e funcionam — removida como tarefa de criação; token cleanup incluído no Épico 2 |
| Tarefa 6.10 | Alvo era `Control/Input` e `Control/TextArea` (bare) | Componentes com tokens hardcoded são `Control/Text/Base` e `Control/TextArea/Base`; `Label` e `Radio` também afetados |
| Épico 2 | Listava 8 componentes | Grep revelou 22+ arquivos adicionais com tokens primitivos hardcoded |

---

## Contexto e motivação

O projeto possui uma arquitetura de monorepo sólida (DDD, Clean Architecture, camadas separadas), mas os componentes de UI acumularam dois problemas que bloqueiam o MVP:

1. **Tokens primitivos chegaram direto aos componentes** — cores como `bg-dark-300`, `!text-white`, `text-dark-700` estão hardcoded com `!important` nos componentes, impedindo que o sistema de temas funcione.
2. **Componentes de feature misturados com primitivos de UI** — `apps/web/src/components/` mistura componentes reutilizáveis de baixo nível (como `Skill`, `MenuItem`) com componentes de feature acoplados à lógica de negócio (como `HeroBanner`, `ExperienceCard`, `ContactForm`). Isso torna difícil saber o que pertence ao Design System e o que é lógica de produto.

A solução é criar uma **camada semântica de tokens** em `@repo/ui` e separar os **componentes de feature** em `apps/web/src/features`.

---

## Arquitetura alvo

```
packages/
  tailwind-config/
    index.ts          ← tokens primitivos + tokens semânticos (NOVO)
    tailwind.css      ← base styles usando tokens semânticos (AJUSTE)

  ui/
    src/
      Control/        ← primitivos interativos (Button, Input, Radio…) ✓ existente
      View/           ← primitivos visuais (Divider, TextRich) ✓ existente
      Imagery/        ← ícones e imagens (Icon) ✓ existente
      Layout/         ← (NOVO) AppShell, Container, SideNav, Header
      Tokens/         ← (NOVO) re-exporta CSS variables como constantes TS

apps/web/src/
  features/           ← (NOVO) componentes acoplados a domínio/feature
    home/
    projects/
    about/
    contact/
    shared/           ← componentes usados em múltiplas features
  app/
    [locale]/
      globals.css     ← apenas CSS variables semânticas + @tailwind (via tailwind.css do pacote)
```

---

## Épicos e tarefas

---

### Épico 1 — Tokens semânticos no tailwind-config

**Objetivo:** Criar uma camada de tokens semânticos sobre os primitivos existentes, permitindo que dark/light mode funcione via classe CSS sem alterar componentes.

**Arquivo principal:** `packages/tailwind-config/index.ts`

---

#### Tarefa 1.1 — Adicionar tokens semânticos de cor e border-radius ao theme

Adicionar aliases semânticos dentro de `theme.extend`. Os primitivos existentes (`dark-200`, `dark-300`, etc.) devem ser mantidos — os semânticos são uma camada adicional por cima.

Tokens de cor a criar:

```
colors.surface.DEFAULT   → mapeia para dark-300 (#323232) — background de card padrão
colors.surface.sunken    → mapeia para dark-200 (#282828) — background elevado (sidebar, header)
colors.surface.base      → mapeia para dark (#1C1C1C)     — background da página

colors.content.primary   → #FFFFFF — texto principal
colors.content.secondary → dark-900 (#BABABA) — texto secundário
colors.content.muted     → dark-700 (#8D8D8D) — texto desabilitado/placeholder

colors.border.default    → dark-400 (#3E3E3E) — bordas padrão
colors.border.subtle     → dark-300 (#323232) — bordas sutis

colors.brand.primary     → primary (#4452FF) — ação principal
colors.brand.accent      → accent (#8EFB9D) — destaque/badge
```

Token de border-radius a criar:

```
borderRadius.badge   → 0.9375rem  — substitui rounded-3.75 (usado em Skill, SkillGroup, SkillAccordion)
borderRadius.card    → 1.25rem    — substitui rounded-5 (usado em ProjectCard)
```

O `rounded-3.75` e o `rounded-5` numéricos devem ser mantidos temporariamente por compatibilidade e removidos apenas após a substituição em todos os componentes (Épico 2).

**Critério de aceite:** Um componente usando `bg-surface` renderiza `#323232`. Classes `rounded-badge` e `rounded-card` estão disponíveis no Tailwind.

---

#### Tarefa 1.2 — Adicionar CSS variables para light mode no globals.css

O `globals.css` atual contém apenas as variáveis de altura do header. Adicionar as CSS custom properties que permitem que o light mode sobrescreva os tokens semânticos.

**Arquivo:** `apps/web/src/app/[locale]/globals.css`

Estrutura a implementar:

```css
:root {
  --header-height-desktop: 104px;
  --header-height-mobile: 68px;
}

/* Light mode: sobrescreve as cores base via classe aplicada no <html> */
.light {
  --tw-surface: #F5F6FA;
  --tw-surface-sunken: #FFFFFF;
  --tw-content-primary: #1C1C1C;
  --tw-content-secondary: #555555;
  --tw-brand-primary: #5865FF;
  --tw-brand-accent: #6FE37F;
}
```

**Critério de aceite:** Com a classe `.light` no elemento `<html>`, os backgrounds dos cards mudam para `#F5F6FA`.

---

#### Tarefa 1.3 — Corrigir o toggle de tema para adicionar classe `light`

O `useTheme` em `apps/web/src/hooks/useTheme.ts` já usa `useDarkMode` do `usehooks-ts`, que detecta corretamente `prefers-color-scheme` para o modo `system`. O que falta é adicionar a classe `light` no `document.documentElement` quando o tema ativo for `light` — sem isso as CSS vars do `.light {}` (Tarefa 1.2) nunca são ativadas.

**Arquivo:** `apps/web/src/hooks/useTheme.ts`

Comportamento esperado após a correção:
- Tema `dark` → `document.documentElement` tem classe `dark`, não tem `light`
- Tema `light` → `document.documentElement` tem classe `light`, não tem `dark`
- Tema `system` → usa `isDarkMode` do `useDarkMode` para decidir qual classe aplicar

```ts
// Exemplo da lógica de toggle a implementar
const isDark = theme === 'system' ? isDarkMode : theme === 'dark';
document.documentElement.classList.toggle('dark', isDark);
document.documentElement.classList.toggle('light', !isDark);
```

**Critério de aceite:** Trocar o tema no `SideNavigation` altera visualmente as cores da interface tanto no dark quanto no light mode.

---

#### Tarefa 1.4 — Corrigir a importação duplicada de @tailwind

O `globals.css` atual declara `@tailwind base`, `@tailwind components` e `@tailwind utilities` no topo do arquivo. O `layout.tsx` importa tanto `@repo/tailwind-config/tailwind.css` (que também declara as três diretivas) quanto `globals.css` — duplicando as diretivas e podendo gerar conflitos de especificidade e warnings no build.

**Arquivo:** `apps/web/src/app/[locale]/globals.css`

Ação: remover as três diretivas `@tailwind` do `globals.css`. Elas devem existir apenas em `packages/tailwind-config/tailwind.css`.

**Critério de aceite:** Build sem warnings de `@tailwind` duplicado. Estilos base continuam funcionando.

---

### Épico 2 — Corrigir tokens hardcoded em todos os componentes

**Objetivo:** Substituir todas as referências a tokens primitivos (`dark-*`, `!text-white`, `text-dark-*`, `rounded-3.75`, `rounded-5`, `max-w-237.5`) por tokens semânticos. A lista abaixo foi gerada por grep completo do repositório — é exaustiva.

**Como verificar a conclusão do épico:**
```bash
grep -r "bg-dark-\|text-dark-\|!text-white\|\!bg-dark\|!text-dark\|rounded-5\b\|rounded-3\.75\|border-dark-\|max-w-237\.5\|max-w-278\.5" \
  apps/web/src/ packages/ui/src/ --include="*.tsx" --include="*.css"
```
O resultado deve ser zero ocorrências.

---

#### Tarefa 2.1 — Corrigir Header

**Arquivo:** `apps/web/src/components/View/Header/index.tsx`

Substituições:
- `bg-dark-300 xl:!bg-dark-200` → `bg-surface xl:bg-surface-sunken` (remover `!important`)
- `!bg-dark-600` no botão hambúrguer → `bg-surface-sunken`
- `hover:!bg-dark-500` → `hover:bg-surface`
- `!text-dark-900` no ícone → `text-content-secondary`

---

#### Tarefa 2.2 — Corrigir HeroBanner

**Arquivo:** `apps/web/src/components/View/HeroBanner/index.tsx`

Substituições:
- `bg-dark-300` no `section` container → `bg-surface`
- `!text-dark-900` no h1 → `text-content-secondary` (remover `!important`)
- `!text-white !font-bold` no h2 → `text-content-primary font-bold` (remover `!important`)
- `!text-white` no parágrafo → `text-content-primary` (remover `!important`)

---

#### Tarefa 2.3 — Corrigir ProjectCard

**Arquivo:** `apps/web/src/components/View/ProjectCard/index.tsx`

Substituições:
- `bg-dark-300` no `article` → `bg-surface`
- `rounded-5` → `rounded-card`
- `!text-white` no h3 → `text-content-primary`
- `!text-dark-700` no label de tema → `text-content-muted`
- `!text-dark-900` no parágrafo → `text-content-secondary`
- `xl:!max-w-237.5` → `xl:max-w-content`
- No botão inline: `bg-primary !text-white !font-bold` → usar `Button.Base variant="filled"` (ver Tarefa 6.2)

---

#### Tarefa 2.4 — Corrigir ExperienceCard

**Arquivo:** `apps/web/src/components/View/ExperienceCard/index.tsx`

Substituições:
- `bg-dark-200` → `bg-surface-sunken`
- `text-white` no h5 → `text-content-primary`
- `text-dark-700` no h6 → `text-content-muted`
- `text-body-xs !text-dark-700` no span → `text-body-xs text-content-muted`
- `text-white` no TextRich → `text-content-primary`

---

#### Tarefa 2.5 — Corrigir Skill

**Arquivo:** `apps/web/src/components/View/Skill/index.tsx`

Substituições:
- `bg-dark-500 rounded-3.75` → `bg-surface rounded-badge`
- `!text-white` no span → `text-content-primary`

---

#### Tarefa 2.6 — Corrigir ContactInfo

**Arquivo:** `apps/web/src/components/View/ContactInfo/index.tsx`

Substituições:
- `bg-dark-300` → `bg-surface`
- `!text-white !font-bold` nos `strong` → `text-content-primary font-bold`
- `!text-primary` nos links → `text-brand-primary`
- `!text-white` nos parágrafos → `text-content-primary`
- `text-white` no `iconClassName` → `text-content-primary`

---

#### Tarefa 2.7 — Corrigir SideNavigation

**Arquivo:** `apps/web/src/components/View/SideNavigation/index.tsx`

Substituições:
- `dark:bg-dark-200` → `dark:bg-surface-sunken`

**Arquivos auxiliares:**

`SideNavigation/LanguageSelector.tsx`:
- `iconClassName="text-white"` → `iconClassName="text-content-primary"`

`SideNavigation/ThemeToggle.tsx`:
- `iconClassName={isDarkMode ? 'text-white' : 'text-black'}` → `iconClassName="text-content-primary"`
- `iconClassName="text-white"` (ícone do toggle group) → `text-content-primary`

---

#### Tarefa 2.8 — Corrigir tailwind.css (base styles)

**Arquivo:** `packages/tailwind-config/tailwind.css`

Os headings h1–h5 e as utilities `.text-body-*` aplicam `text-dark` fixo, o que impede que o light mode funcione corretamente.

Substituições em `@layer base`:
- `text-dark` em todos os headings (h1–h5) → remover e substituir por `text-content-primary`

Substituições em `@layer utilities`:
- `text-dark` em todas as classes `.text-body-*` → remover (a cor deve ser herdada do contexto de tema)

---

#### Tarefa 2.9 — Corrigir ProjectMetaGrid

**Arquivo:** `apps/web/src/components/View/ProjectMetaGrid/index.tsx`

Substituições:
- `bg-dark-300` no `dl` → `bg-surface`
- `!text-dark-700` nos `dt` → `text-content-muted`
- `!text-white` nos `dd` → `text-content-primary`

---

#### Tarefa 2.10 — Corrigir StatCard

**Arquivo:** `apps/web/src/components/View/StatCard/index.tsx`

Substituições:
- `border border-dark-300 bg-dark-300/20` → `border border-border-default bg-surface/20`
- `text-white` nos valores → `text-content-primary`

---

#### Tarefa 2.11 — Corrigir SkillAccordion

**Arquivo:** `apps/web/src/components/View/SkillAccordion/index.tsx`

Substituições:
- `bg-dark-500 rounded-3.75` nas pills → `bg-surface rounded-badge`
- `!text-dark-700` no label de categoria → `text-content-muted`
- `text-dark-700` no ícone de seta → `text-content-muted`
- `!text-white` nas pills de skill → `text-content-primary`

---

#### Tarefa 2.12 — Corrigir SkillGroup

**Arquivo:** `apps/web/src/components/View/SkillGroup/index.tsx`

Substituições:
- `bg-dark-500 rounded-3.75` nas pills → `bg-surface rounded-badge`
- `!text-white` (pills de count e texto) → `text-content-primary`
- `text-white` nas pills de ícone → `text-content-primary`

---

#### Tarefa 2.13 — Corrigir Breadcrumb

**Arquivo:** `apps/web/src/components/View/Breadcrumb/index.tsx`

Substituições:
- `!text-dark-700` no separador `/` → `text-content-muted`
- `!text-dark-700 hover:!text-white` nos links → `text-content-muted hover:text-content-primary`
- `!text-white` no item ativo → `text-content-primary`

---

#### Tarefa 2.14 — Corrigir MenuItem

**Arquivos:**

`MenuItem/Item1/index.tsx`:
- `hover:bg-dark-300 active:bg-dark-400` → `hover:bg-surface active:bg-surface-sunken`
- `[&>*]:active:!text-white` → `[&>*]:active:text-content-primary`
- `text-dark-900` no ícone e no texto → `text-content-secondary`

`MenuItem/Item2/Link/index.tsx`:
- `!text-white` no texto → `text-content-primary`
- `text-dark-1000` no ícone externo → `text-content-secondary`

`MenuItem/Item2/Expandable/index.tsx`:
- `!text-white` no título → `text-content-primary`
- `text-dark-1000` no ícone de seta → `text-content-secondary`

---

#### Tarefa 2.15 — Corrigir Forms (ContactForm e LoginForm)

**Arquivos:**

`apps/web/src/components/Forms/ContactForm/index.tsx`:
- `!text-white` nos h5 → `text-content-primary`

`apps/web/src/components/Forms/LoginForm/index.tsx`:
- `!text-white` no h5 → `text-content-primary`

---

#### Tarefa 2.16 — Corrigir ProfessionalValue

**Arquivo:** `apps/web/src/components/View/ProfessionalValue/index.tsx`

Substituições:
- `border-dark-300 bg-dark-300/20` → `border-border-subtle bg-surface/20`
- `text-white` no TextRich → `text-content-primary`

---

#### Tarefa 2.17 — Corrigir ProjectDetail (componente)

O componente `ProjectDetail/index.tsx` existe e funciona mas usa tokens primitivos em toda a sua marcação.

**Arquivo:** `apps/web/src/components/View/ProjectDetail/index.tsx`

Substituições:
- `!text-white` nos headings e prosa → `text-content-primary`
- `!text-dark-700` nos labels → `text-content-muted`
- `!text-dark-900` nas captions → `text-content-secondary`
- `xl:max-w-237.5` → `xl:max-w-content`

---

#### Tarefa 2.18 — Corrigir AppLayout e ProjectList (spacing tokens)

**Arquivo:** `apps/web/src/components/Layout/AppLayout/index.tsx`:
- `max-w-237.5 2xl:max-w-278.5` → `max-w-content 2xl:max-w-content-wide`

**Arquivo:** `apps/web/src/components/View/ProjectList/index.tsx`:
- `max-w-237.5` → `max-w-content`

**Nota:** Estes tokens `max-w-content` e `max-w-content-wide` são criados na Tarefa 5.2 — garantir que essa tarefa seja executada antes.

---

#### Tarefa 2.19 — Corrigir ErrorView

**Arquivo:** `apps/web/src/components/View/ErrorView/index.tsx`

Substituições:
- `text-white` → `text-content-primary`

---

#### Tarefa 2.20 — Corrigir @repo/ui: Text.Base, TextArea.Base, Label, Radio, Divider

Os componentes de controle do design system têm tokens hardcoded que impedem o light mode.

**`packages/ui/src/Control/Text/Base/index.tsx`:**
- `bg-dark-300` → `bg-surface`
- `border-dark-500` → `border-border-default`
- `text-white` → `text-content-primary`
- `placeholder:text-dark-500` → `placeholder:text-content-muted`
- `dark:text-white` → remover (redundante após token semântico)

**`packages/ui/src/Control/TextArea/Base/index.tsx`:**
- Mesmas substituições que `Text.Base`

**`packages/ui/src/Control/Label/index.tsx`:**
- `!text-white !font-bold` → `text-content-primary font-bold`

**`packages/ui/src/Control/Radio/index.tsx`:**
- `!text-white` → `text-content-primary`

**`packages/ui/src/View/Divider/index.tsx`:**
- `dark:border-dark-400` → `dark:border-border-default`

---

#### Tarefa 2.21 — Corrigir tokens hardcoded nas pages

**`apps/web/src/app/[locale]/page.tsx`:**
- `text-white` em headings inline → `text-content-primary`
- `!text-xl`, `!text-[32px]` — revisar se podem ser substituídos por utilities de texto existentes

**`apps/web/src/app/[locale]/about/page.tsx`:**
- `text-white` em headings inline → `text-content-primary`

#### Tarefa 2.22 — Migrar dimensões px arbitrárias para o spacing scale

Extrair todos os valores `h-[Xpx]`, `max-w-[Xpx]` e `min-h-[Xpx]` usados em componentes e loading skeletons para tokens nomeados no `spacing` do `packages/tailwind-config/index.ts`, substituindo as classes arbitrárias pelas equivalentes do scale.

**Tokens a adicionar em `tailwind-config/index.ts`:**

| Token | Valor px | Valor rem | Uso |
|---|---|---|---|
| `45` | 180px | 11.25rem | ProjectCard — altura da imagem |
| `60` | 240px | 15rem | ProjectDetail — altura do cover |
| `61` | 244px | 15.25rem | ProjectCard XL — altura da imagem |
| `84.75` | 339px | 21.1875rem | Card — max-height row view |
| `85.75` | 343px | 21.4375rem | Card — max-width |
| `100` | 400px | 25rem | Banner XL — altura |
| `106` | 424px | 26.5rem | HeroBanner — altura |
| `110.25` | 441px | 27.5625rem | Card row view — max-width |
| `116.25` | 465px | 29.0625rem | Card XL — max-width |

**Arquivos a atualizar:**
- `apps/web/src/components/View/ProjectCard/index.tsx`
- `apps/web/src/components/View/ProjectDetail/index.tsx`
- `apps/web/src/components/View/HeroBanner/index.tsx`
- `apps/web/src/app/[locale]/loading.tsx`
- `apps/web/src/app/[locale]/projects/loading.tsx`
- `apps/web/src/app/[locale]/projects/[slug]/loading.tsx`

---

#### Tarefa 2.23 — Substituir inline style por classes Tailwind no loading skeleton

**Arquivo:** `apps/web/src/app/[locale]/projects/[slug]/loading.tsx`

O skeleton de texto usa `style={{ width: \`${w}%\` }}` com valores fixos `[100, 90, 95, 80, 85]`. Como os valores são estáticos, substituir por classes Tailwind:

| Valor | Classe |
|---|---|
| 100% | `w-full` |
| 90% | `w-[90%]` |
| 95% | `w-[95%]` |
| 80% | `w-4/5` |
| 85% | `w-[85%]` |

Remover a variável `w` e o prop `style` por completo.

---

### Épico 3 — Migrar componentes de feature para `apps/web/src/features`

**Objetivo:** Separar os componentes que contêm lógica de produto/feature (dados hardcoded, chamadas a domínio, lógica de negócio) dos primitivos de UI reutilizáveis. A regra é simples: se o componente sabe o que está renderizando (ex: "este é o hero da home"), ele é uma feature. Se ele é genérico e reutilizável (ex: "este é um card com imagem e título"), ele é UI.

---

#### Tarefa 3.1 — Criar estrutura de pastas de features

Criar a estrutura:

```
apps/web/src/features/
  home/
    index.ts
    HeroSection/
      index.tsx
    ProjectsSection/
      index.tsx
    ContactSection/
      index.tsx
  projects/
    index.ts
    HeroSection/
      index.tsx
  about/
    index.ts
    ValuesSection/
      index.tsx
    ExperiencesSection/
      index.tsx
  contact/
    index.ts
    ContactForm/         ← migrado de components/Forms/ContactForm
      index.tsx
  shared/
    index.ts
```

**Critério de aceite:** Estrutura de pastas criada. Arquivos `index.ts` criados (podem estar vazios inicialmente).

---

#### Tarefa 3.2 — Migrar HeroBanner para feature-specific

O `HeroBanner` atual é um componente genérico em `components/View`, mas é usado de forma diferente em cada página (props diferentes, imagens diferentes). Manter o componente genérico em `@repo/ui` e criar wrappers de feature que encapsulam as props específicas de cada página.

Ação:
- Mover `HeroBanner` genérico para `@repo/ui/src/View/HeroBanner/` (componente puro, sem lógica de negócio)
- Criar `features/home/HeroSection` que importa `HeroBanner` do `@repo/ui` e passa as props da home
- Criar `features/projects/HeroSection` que faz o mesmo para a página de projetos

**Critério de aceite:** `apps/web/src/app/[locale]/page.tsx` importa `HeroSection` de `~features/home`, não mais de `~components`.

---

#### Tarefa 3.3 — Migrar ProjectList e ProjectCard para features/home

`ProjectList` e `ProjectCard` são componentes acoplados ao domínio `IProjectProps`. Eles pertencem à feature, não ao Design System genérico.

Ação:
- Mover `ProjectCard` para `features/home/ProjectsSection/ProjectCard/`
- Mover `ProjectList` para `features/home/ProjectsSection/ProjectList/`
- `features/home/ProjectsSection/index.tsx` — wrapper que contém os dados hardcoded (PROJECTS array) e renderiza a lista

**Critério de aceite:** `apps/web/src/app/[locale]/page.tsx` importa `ProjectsSection` de `~features/home`.

---

#### Tarefa 3.4 — Migrar ExperienceCard para features/about

`ExperienceCard` é acoplado a `IExperienceProps` do `@repo/core`. É uma feature de "About", não um componente genérico.

Ação:
- Mover `ExperienceCard` para `features/about/ExperiencesSection/ExperienceCard/`
- Criar `features/about/ExperiencesSection/index.tsx` com a lista renderizada

**Critério de aceite:** `apps/web/src/app/[locale]/about/page.tsx` importa `ExperiencesSection` de `~features/about`.

---

#### Tarefa 3.5 — Migrar ProfessionalValue para features/about

Mesmo raciocínio: `ProfessionalValue` é acoplado a `IProfessionalValueProps` e pertence à feature About.

Ação:
- Mover `ProfessionalValue` para `features/about/ValuesSection/ProfessionalValue/`
- Criar `features/about/ValuesSection/index.tsx` com o array `PROFESSIONAL_VALUES`

**Critério de aceite:** `apps/web/src/app/[locale]/about/page.tsx` importa `ValuesSection` de `~features/about`.

---

#### Tarefa 3.6 — Migrar ContactForm para features/contact

`ContactForm` contém lógica de formulário (Formik, Yup, envio) — é claramente uma feature.

Ação:
- Mover `ContactForm` de `components/Forms/ContactForm` para `features/contact/ContactForm/`
- Criar `features/contact/index.ts` exportando o componente

**Critério de aceite:** `apps/web/src/app/[locale]/page.tsx` importa `ContactForm` de `~features/contact`.

---

#### Tarefa 3.7 — Migrar ContactInfo para features/contact

`ContactInfo` renderiza informações de contato específicas do portfólio (email, WhatsApp, LinkedIn) — é uma feature, não um primitivo genérico.

Ação:
- Mover `ContactInfo` de `components/View/ContactInfo` para `features/contact/ContactInfo/`
- Atualizar o export de `features/contact/index.ts`

**Critério de aceite:** `apps/web/src/app/[locale]/page.tsx` importa `ContactInfo` de `~features/contact`.

---

#### Tarefa 3.8 — Mover ProjectDetail para features/projects

O componente `ProjectDetail/index.tsx` existe em `components/View/` mas é um componente acoplado ao domínio de projetos — pertence à feature, não ao Design System.

Ação:
- Mover `ProjectDetail` de `components/View/ProjectDetail/` para `features/projects/ProjectDetail/`
- Atualizar o import em `apps/web/src/app/[locale]/projects/[slug]/page.tsx`
- Criar `features/projects/index.ts` exportando o componente

**Critério de aceite:** A rota `/projects/[slug]` continua funcionando e importa `ProjectDetail` de `~features/projects`.

---

#### Tarefa 3.9 — Limpar components/ após migração

Ao final das tarefas 3.2–3.8, `apps/web/src/components/` deve conter apenas `Layout/`. Os diretórios `View/` e `Forms/` devem ser removidos após confirmação de que nenhum import os referencia.

**Critério de aceite:** `apps/web/src/components/` contém apenas `Layout/`.

---

### Épico 4 — Atualizar pages para usar features

**Objetivo:** Simplificar as pages do App Router para que sejam apenas orquestradores de features, sem lógica de renderização ou dados embutidos.

---

#### Tarefa 4.1 — Refatorar apps/web/src/app/[locale]/page.tsx (Home)

A page atual tem o array `PROJECTS` hardcoded e renderiza componentes diretamente. Após a migração:

```tsx
import { HeroSection, ProjectsSection } from '~features/home';
import { ContactSection } from '~features/contact';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
```

---

#### Tarefa 4.2 — Refatorar apps/web/src/app/[locale]/about/page.tsx

```tsx
import { ValuesSection, ExperiencesSection } from '~features/about';

const About: FC = () => (
  <>
    <ValuesSection />
    <ExperiencesSection />
  </>
);
```

---

#### Tarefa 4.3 — Refatorar apps/web/src/app/[locale]/projects/page.tsx

**Estado atual:** A page já busca projetos da API (`/api/v1/projects`) e renderiza `HeroBanner + ProjectList view="grid"` com dados reais via fetch em Server Component. A lógica de busca de dados está correta e deve ser preservada.

**Refatoração:** Encapsular a busca e renderização em `features/projects/`, mantendo o fetch no Server Component da feature.

```tsx
import { HeroSection, ProjectsSection } from '~features/projects';

export default async function Projects({ searchParams }: ProjectsPageProps) {
  return (
    <>
      <HeroSection />
      <ProjectsSection searchParams={searchParams} />
    </>
  );
}
```

A lógica de fetch (`/api/v1/projects`), tratamento de erro e `applyDevSimulations` migram para dentro de `features/projects/ProjectsSection/index.tsx`.

---

### Épico 5 — Limpeza e organização final

---

#### Tarefa 5.1 — Atualizar alias `~components` no tsconfig

Após a migração, adicionar o alias `~features` e manter `~components` apontando para o que restar (apenas Layout).

**Arquivo:** `apps/web/tsconfig.json`

```json
{
  "paths": {
    "~components": ["./src/components/index.ts"],
    "~features/*": ["./src/features/*"],
    "~hooks": ["./src/hooks/index.ts"],
    "~hooks/*": ["./src/hooks/*"],
    "~assets/*": ["./src/assets/*"],
    "~i18n/*": ["./src/i18n/*"]
  }
}
```

---

#### Tarefa 5.2 — Simplificar spacing tokens exóticos

Os tokens `spacing.237.5` (59.375rem) e `spacing.278.5` (69.625rem) são usados como `max-w` em páginas e componentes (`xl:max-w-237.5`, `2xl:max-w-278.5`). Devem ser movidos para `maxWidth` no theme para refletir a intenção semântica.

**Arquivo:** `packages/tailwind-config/index.ts`

```ts
maxWidth: {
  content: '59.375rem',        // 950px — largura do conteúdo principal
  'content-wide': '69.625rem', // 1114px — largura máxima estendida
},
```

**Nota:** Esta tarefa deve ser executada antes das Tarefas 2.17 e 2.18, que dependem de `max-w-content`.

---

#### Tarefa 5.3 — Adicionar box-shadows nomeados

As sombras atuais (1–6) são anônimas. Adicionar aliases que refletem o uso do Figma:

**Arquivo:** `packages/tailwind-config/index.ts`

```ts
boxShadow: {
  // existentes mantidos para compatibilidade...
  card: '0px 3px 12px 2px rgba(0,0,0,0.08)',
  header: '0px 4px 20px 4px rgba(0,0,0,0.08)',
  menu: '4px 0px 15px 0px rgba(0,0,0,0.10)',
  footer: '0px -4px 15px 0px rgba(0,0,0,0.10)',
}
```

---

### Épico 6 — Criar componentes e features presentes no Figma mas ausentes no código

**Objetivo:** Implementar os elementos visuais que estão prototipados no Figma mas ainda não têm correspondência no código.

**Legenda de destino:**
- `@repo/ui` → componente genérico reutilizável, sem lógica de domínio
- `features/<nome>` → componente acoplado a uma feature específica

---

#### Tarefa 6.1 — Badge / Tag de tecnologia (UI primitivo)

**Destino:** `@repo/ui/src/View/Badge/`

O Figma mostra pills de tecnologia com ícone + label (ex: "React", "TypeScript") amplamente usadas em `ProjectCard`, `ExperienceCard` e `Skill`. No código hoje existem dois lugares que reimplementam esse visual de forma independente: `Skill/index.tsx` (com ícone) e `SkillGroup/index.tsx` (sem ícone, apenas texto + id). Ambos precisam ser unificados em um único componente `Badge` no `@repo/ui`.

Variantes necessárias pelo Figma:
- `Badge.WithIcon` — ícone Iconify + label (usado em `Skill`)
- `Badge.Text` — apenas label (usado em `SkillGroup`)
- `Badge.Count` — "+N" overflow (usado em `SkillGroup` quando há mais items que o max)

Props base:
```ts
interface BadgeProps {
  label: string;
  icon?: string;       // key do Iconify
  variant?: 'default' | 'count';
}
```

**Critério de aceite:** `Skill` e `SkillGroup` passam a usar `Badge` do `@repo/ui` internamente. Visual idêntico ao Figma.

---

#### Tarefa 6.2 — Button variante "outline" / "ghost" (UI primitivo)

**Destino:** `@repo/ui/src/Control/Button/`

O Figma exibe nos cards de projeto um botão "Ver projeto" que tem estilo outline (borda + fundo transparente), diferente do `Button.Base` atual que é sempre filled (fundo `primary`). Também existe um botão ghost (sem borda, só texto com ícone de seta) usado em seções de listagem.

O `Button.Base` atual suporta override via `className`, mas sem variante semântica isso leva a classes hardcoded espalhadas. Adicionar variantes:

```ts
type Variant = 'filled' | 'outline' | 'ghost';
// filled = comportamento atual (default)
// outline = border border-brand-primary text-brand-primary bg-transparent
// ghost   = sem borda, texto com underline ou ícone de seta
```

**Critério de aceite:** `ProjectCard` usa `Button.Base variant="outline"` sem nenhuma classe de cor hardcoded.

---

#### Tarefa 6.3 — Tag de filtro de projetos (feature: projects)

**Destino:** `apps/web/src/features/projects/FilterBar/`

A página `/projects` no Figma exibe uma barra de filtros horizontal com tags clicáveis (ex: "Todos", "React", "Node.js", "Mobile") que filtram a lista de projetos. O código atual não tem essa funcionalidade.

Componentes necessários:
- `FilterBar` — container horizontal com scroll em mobile
- `FilterTag` — tag individual com estado active/inactive

O `FilterTag` pode ser um `Badge` (Tarefa 6.1) com estado interativo, ou um componente separado se tiver comportamento mais complexo (toggle, keyboard nav).

**Critério de aceite:** Página `/projects` exibe `HeroSection` + `FilterBar` + `ProjectList` filtrada. `FilterBar` aceita lista de tags e callback `onFilter`.

---

#### Tarefa 6.4 — ProjectList na página /projects com integração de filtro

**Destino:** `apps/web/src/features/projects/ProjectsSection/`

A page `/projects` já renderiza `ProjectList view="grid"` com dados reais da API. O Figma usa `view="row"` nessa página (card wide, imagem à esquerda + conteúdo à direita). Além disso, a lista deve ser filtrável pelo `FilterBar` (Tarefa 6.3).

Ação:
- Criar `features/projects/ProjectsSection/index.tsx` encapsulando o fetch de `/api/v1/projects` e o estado de filtro
- Conectar o estado de filtro entre `FilterBar` e a renderização da lista
- Alterar o `view` para `"row"` conforme Figma

**Critério de aceite:** Página `/projects` exibe lista de projetos em formato row, filtrável por tecnologia.

---

#### Tarefa 6.5 — Avatar / foto de perfil com indicador de disponibilidade (UI primitivo)

**Destino:** `@repo/ui/src/Imagery/Avatar/`

O Figma mostra na seção hero um componente de avatar com foto circular + badge de status ("Disponível para projetos") com ponto verde animado (pulse). No código atual a foto é renderizada via `next/image` diretamente no `HeroBanner` sem abstração.

Props:
```ts
interface AvatarProps {
  src: string | StaticImageData;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'available' | 'busy' | 'unavailable';
  statusLabel?: string;
}
```

**Critério de aceite:** `HeroSection` da home usa `Avatar` do `@repo/ui` com `status="available"`. Badge de disponibilidade visível e animado conforme Figma.

---

#### Tarefa 6.6 — SectionHeader com título e overline (UI primitivo)

**Destino:** `@repo/ui/src/View/SectionHeader/`

O Figma usa consistentemente em todas as páginas um padrão de título de seção composto por:
- Overline em uppercase pequeno (ex: "PROJETOS", "EXPERIÊNCIA")
- Heading principal (h2/h3/h4)
- Opcional: subtítulo/descrição

No código atual esse padrão é reimplementado inline em cada page com classes hardcoded e sem o overline. Centralizar em um componente reutilizável.

Props:
```ts
interface SectionHeaderProps {
  overline?: string;
  title: string;
  description?: string;
  as?: 'h2' | 'h3' | 'h4';
  align?: 'left' | 'center';
}
```

**Critério de aceite:** Home, About e Projects usam `SectionHeader` do `@repo/ui` em vez de headings hardcoded com classes inline.

---

#### Tarefa 6.7 — Footer (feature: shared)

**Destino:** `apps/web/src/features/shared/Footer/`

O Figma mostra um footer presente em todas as páginas com:
- Copyright ("© 2024 Wallace Ferreira")
- Links de redes sociais (LinkedIn, GitHub)
- Sombra superior (`shadow-footer` do token criado na Tarefa 5.3)

O footer não existe no código — o `AppLayout` atual não o inclui.

Ação:
- Criar `features/shared/Footer/index.tsx`
- Adicionar o `Footer` no `AppLayout` abaixo do `<main>`

**Critério de aceite:** Footer visível em todas as páginas, responsivo entre 375px e 1512px, conforme Figma.

---

#### Tarefa 6.8 — Skeleton / loading state para cards (UI primitivo)

**Destino:** `@repo/ui/src/View/Skeleton/`

O Figma inclui estados de loading para `ProjectCard` e `ExperienceCard` com blocos de placeholder animados (shimmer). No código não existe nenhum componente de skeleton — as listas carregam ou mostram nada.

Componentes:
- `Skeleton.Block` — retângulo animado genérico (base)
- `Skeleton.ProjectCard` — placeholder no shape do ProjectCard
- `Skeleton.ExperienceCard` — placeholder no shape do ExperienceCard

**Critério de aceite:** `ProjectList` exibe `Skeleton.ProjectCard` enquanto os dados carregam. Animação de shimmer conforme Figma.

---

#### Tarefa 6.9 — Input com label, focus e estado de erro (UI primitivo — correção)

**Destino:** `@repo/ui/src/Control/Text/Base/` e `@repo/ui/src/Control/TextArea/Base/`

O Figma mostra campos de formulário com três estados claramente definidos: default, focused (borda `brand-primary`) e error (borda vermelha + mensagem de erro abaixo).

Os componentes afetados são `Text.Base` e `TextArea.Base` — os elementos estilizados que o `ContactForm` usa. O componente `Input` (bare, sem estilos) deve permanecer como está.

Ação:
- Substituir tokens hardcoded em `Text.Base` e `TextArea.Base` (coberto pela Tarefa 2.20)
- Criar `Text.Field` — composição de `Label` + `Text.Base` + mensagem de erro (integrada com Formik via `useField`)
- Criar `TextArea.Field` — mesma composição para textarea
- Confirmar que os estados focused e error usam `border-brand-primary` e `border-error` respectivamente

**Critério de aceite:** `ContactForm` usa `Text.Field` e `TextArea.Field` com estados visuais corretos conforme Figma, sem classes hardcoded de cor.

---

## Resumo de arquivos impactados

| Arquivo | Tipo de mudança |
|---|---|
| `packages/tailwind-config/index.ts` | Adicionar tokens semânticos + borderRadius.badge/card + maxWidth + boxShadow |
| `packages/tailwind-config/tailwind.css` | Remover `text-dark` dos base styles e utilities |
| `apps/web/src/app/[locale]/globals.css` | Adicionar CSS variables light mode, remover @tailwind duplicados |
| `apps/web/src/app/[locale]/layout.tsx` | Sem mudança estrutural |
| `apps/web/src/app/[locale]/page.tsx` | Simplificar para usar features |
| `apps/web/src/app/[locale]/about/page.tsx` | Simplificar para usar features |
| `apps/web/src/app/[locale]/projects/page.tsx` | Simplificar para usar features (lógica de fetch migra para feature) |
| `apps/web/src/app/[locale]/projects/[slug]/page.tsx` | Atualizar import de ProjectDetail (features/projects) |
| `apps/web/src/hooks/useTheme.ts` | Adicionar toggle da classe `light` |
| `apps/web/src/components/View/Header/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/HeroBanner/index.tsx` | Substituir tokens primitivos → mover para @repo/ui |
| `apps/web/src/components/View/ProjectCard/index.tsx` | Substituir tokens primitivos → mover para features |
| `apps/web/src/components/View/ProjectList/index.tsx` | Substituir max-w → mover para features |
| `apps/web/src/components/View/ExperienceCard/index.tsx` | Substituir tokens primitivos → mover para features |
| `apps/web/src/components/View/ProfessionalValue/index.tsx` | Substituir tokens primitivos → mover para features |
| `apps/web/src/components/View/ProjectDetail/index.tsx` | Substituir tokens primitivos → mover para features |
| `apps/web/src/components/View/ProjectMetaGrid/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/StatCard/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/Skill/index.tsx` | Substituir tokens primitivos → unificar em Badge |
| `apps/web/src/components/View/SkillAccordion/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/SkillGroup/index.tsx` | Substituir tokens primitivos → unificar em Badge |
| `apps/web/src/components/View/Breadcrumb/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/ContactInfo/index.tsx` | Substituir tokens primitivos → mover para features |
| `apps/web/src/components/View/ErrorView/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/SideNavigation/index.tsx` | Substituir token dark:bg-dark-200 |
| `apps/web/src/components/View/SideNavigation/LanguageSelector.tsx` | Substituir text-white |
| `apps/web/src/components/View/SideNavigation/ThemeToggle.tsx` | Substituir text-white / text-black |
| `apps/web/src/components/View/MenuItem/Item1/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/MenuItem/Item2/Link/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/View/MenuItem/Item2/Expandable/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/Forms/ContactForm/index.tsx` | Substituir tokens → mover para features |
| `apps/web/src/components/Forms/LoginForm/index.tsx` | Substituir tokens primitivos |
| `apps/web/src/components/Layout/AppLayout/index.tsx` | Substituir max-w tokens |
| `apps/web/tsconfig.json` | Adicionar alias ~features |
| `apps/web/src/features/**` | Criar (nova estrutura) |
| `packages/ui/src/Control/Text/Base/index.tsx` | Substituir tokens hardcoded |
| `packages/ui/src/Control/TextArea/Base/index.tsx` | Substituir tokens hardcoded |
| `packages/ui/src/Control/Label/index.tsx` | Remover tokens hardcoded |
| `packages/ui/src/Control/Radio/index.tsx` | Remover tokens hardcoded |
| `packages/ui/src/View/Divider/index.tsx` | Substituir dark:border-dark-400 |
| `packages/ui/src/View/Badge/` | Criar — unifica Skill + SkillGroup |
| `packages/ui/src/View/SectionHeader/` | Criar — título de seção com overline |
| `packages/ui/src/View/Skeleton/` | Criar — loading states |
| `packages/ui/src/Imagery/Avatar/` | Criar — avatar com status badge |
| `packages/ui/src/Control/Button/` | Adicionar variantes outline e ghost |
| `apps/web/src/features/projects/FilterBar/` | Criar |
| `apps/web/src/features/projects/ProjectsSection/` | Criar (com lógica de fetch migrada da page) |
| `apps/web/src/features/projects/ProjectDetail/` | Mover de components/View |
| `apps/web/src/features/shared/Footer/` | Criar |

---

## Ordem de execução recomendada

```
Épico 5.2 (maxWidth tokens — pré-requisito para Épico 2.18)
  → Épico 1 (tokens semânticos — bloqueador de tudo)
    → Épico 2 (paralelo com Épico 3)
    → Épico 3 (paralelo com Épico 2)
      → Épico 6.1, 6.2, 6.5, 6.6, 6.8, 6.9 (UI primitivos — paralelo com Épico 4)
      → Épico 4
        → Épico 6.3, 6.4, 6.7 (features — após Épico 4)
          → Épico 5.1, 5.3 (limpeza final)
```

**Regras:**
- A Tarefa 5.2 é pré-requisito de 2.18 — deve vir antes do Épico 2
- O Épico 1 é o único bloqueador absoluto — todos os tokens semânticos precisam existir antes da substituição
- Épicos 2 e 3 são independentes entre si e podem ser executados em paralelo
- Os itens do Épico 6 que criam UI primitivos em `@repo/ui` (6.1, 6.2, 6.5, 6.6, 6.8, 6.9) podem ser desenvolvidos em paralelo com o Épico 4, pois não dependem da estrutura de features
- Os itens do Épico 6 que criam features (6.3, 6.4, 6.7) devem vir após o Épico 4

---

## Definição de pronto (DoD)

- [ ] `grep -r "bg-dark-\|!text-white\|!bg-dark\|!text-dark\|text-dark-\|rounded-5\b\|rounded-3\.75\|border-dark-\|max-w-237\.5\|max-w-278\.5" apps/web/src/ packages/ui/src/` retorna zero resultados
- [ ] Dark mode e light mode aplicados via toggle no `SideNavigation` funcionam visualmente em todas as páginas
- [ ] `apps/web/src/components/` contém apenas `Layout/`
- [ ] `apps/web/src/features/` contém `home/`, `projects/`, `about/`, `contact/`, `shared/`
- [ ] `@repo/ui/src/View/` exporta `Badge`, `SectionHeader`, `Skeleton`, `HeroBanner`, `Divider`, `TextRich`
- [ ] `@repo/ui/src/Imagery/` exporta `Icon`, `Avatar`
- [ ] `@repo/ui/src/Control/Button/` tem variantes `filled`, `outline`, `ghost`
- [ ] As quatro pages (`/`, `/projects`, `/projects/[slug]`, `/about`) renderizam sem erros
- [ ] Footer visível em todas as páginas
- [ ] Build de produção (`next build`) passa sem erros ou warnings de CSS
