# PRD — Design System & Feature Architecture Refactor
**Projeto:** wallace-sf/portfolio  
**App:** `apps/site` (Next.js 16.2.6, App Router, TypeScript, Tailwind CSS v3.4.1)  
**Monorepo:** Turborepo + pnpm workspaces  
**Branch de desenvolvimento:** `develop`  
**Status:** Pré-MVP  
**Specs visuais:** `FIGMA_SPECS.md` na raiz do repositório

---

## Contexto e motivação

O projeto tem arquitetura sólida e estrutura de features já bem encaminhada. Os dois bloqueadores do MVP são:

1. **Tokens semânticos incompletos** — a camada semântica existe em `packages/tailwind-config/` mas faltam tokens que o Figma usa (ex: `surface-overlay`, `surface-interactive`, `content-disabled`, `brand-primary-hover`, `brand-primary-active`). Os valores de `error` e `success` também divergem do Figma. Enquanto isso, componentes ainda usam os primitivos `dark-*` hardcoded.

2. **Componentes com estilização divergente do Figma** — HeroBanner, ExperienceCard, StatCard, ProjectCard e outros foram implementados mas com valores incorretos de tipografia, padding, gap e cores em relação ao Figma.

---

## Estado real do repositório (branch develop)

### Stack
| Item | Valor |
|---|---|
| Next.js | 16.2.6 |
| React | 18 |
| TypeScript | 5 |
| Tailwind CSS | 3.4.1 |
| i18n | next-intl 4.11.0 |
| Forms | react-hook-form 7.74.0 + zod 4.3.6 |
| Testes | Vitest 3 + Testing Library |

### Tokens semânticos — `packages/tailwind-config/`

**Já existem em `index.ts`:**
```
surface: DEFAULT, sunken, base, raised
content: primary, secondary, muted
border: default, subtle
brand: primary, accent
```

**Já existem em `tailwind.css` (dark `:root` + `.light`):**
```
--tw-surface, --tw-surface-sunken, --tw-surface-base, --tw-surface-raised
--tw-content-primary, --tw-content-secondary, --tw-content-muted
--tw-border-default, --tw-border-subtle
--tw-brand-primary, --tw-brand-accent
```

**`globals.css` do app:** apenas variáveis de layout (`--header-height-*`). Tokens de cor ficam exclusivamente em `packages/tailwind-config/tailwind.css`.

### Features já implementadas em `apps/site/src/features/`
```
about/ExperiencesSection/  ExperienceCard.tsx, ExperiencesSkeleton.tsx, SkillAccordion.tsx, ExperiencesSection.tsx
about/HeroSection/         index.tsx
about/ValuesSection/       ProfessionalValue.tsx, ValuesSection.tsx, ValuesSkeleton.tsx
contact/ContactForm/       index.tsx
contact/ContactInfo/       index.tsx
contact/ContactSection/    index.tsx  ← Footer já existe aqui
home/HeroSection/          index.tsx
home/ProjectsSection/      HomeProjectsSection.tsx, ProjectCard.tsx, ProjectList.tsx, ProjectsSkeleton.tsx
projects/HeroSection/      index.tsx
projects/ProjectDetail/    ProjectDetail.tsx, ProjectMetaGrid.tsx
projects/ProjectsSection/  index.tsx
shared/Breadcrumb/         index.tsx
shared/ErrorView/          index.tsx
shared/HeroBanner/         index.tsx, HeroBannerSkeleton.tsx
shared/SkillGroup/         index.tsx, Skill.tsx
shared/StatCard/           index.tsx
```

### Componentes já existentes em `packages/ui/src/`
```
Control/Accordion/   Body, Header, Root
Control/Button/      Base, Clipboard, ToggleGroup, Toggle
Control/Input/
Control/Label/
Control/RadioGroup/ + Radio
Control/TextArea/Base
Control/Text/Base
Imagery/Icon/
View/Badge/
View/Divider/
View/SectionHeader/
View/TextRich/
```

---

## Restrições e decisões do dev (não alterar)

- `components/Layout/` inteiro: `AppLayout`, `Header`, `MenuItem/*`, `SideNavigation` (incluindo `LanguageSelector` e `ThemeToggle`)
- `shared/SkillGroup` + `Skill` — decisão do dev
- `contact/ContactForm` e `contact/ContactInfo` — layout é decisão do dev
- `projects/HeroSection` — não alterar
- `shared/HeroBanner`, `shared/StatCard`, `home/ProjectsSection/ProjectCard` — permanecem em `features/`, não migrar para `@repo/ui`

---

## Épico 1 — Completar tokens semânticos (fundação obrigatória)

> ⚠️ Deve ser feito primeiro. Todos os outros épicos dependem disso.  
> Os tokens ficam exclusivamente em `packages/tailwind-config/` — nunca em `globals.css` do app.  
> 📐 Referência: seção "Tokens Globais" em `FIGMA_SPECS.md`

### Tarefa 1.1 — Adicionar tokens faltantes em `index.ts`

**Arquivo:** `packages/tailwind-config/index.ts`

Adicionar dentro de `theme.extend.colors`, mantendo os existentes:

```ts
// Adicionar em surface:
surface: {
  // ... manter DEFAULT, sunken, base, raised existentes
  overlay:     'rgb(var(--tw-surface-overlay) / <alpha-value>)',     // contact section bg
  interactive: 'rgb(var(--tw-surface-interactive) / <alpha-value>)', // badges, hover states
},

// Adicionar em content:
content: {
  // ... manter primary, secondary, muted existentes
  disabled: 'rgb(var(--tw-content-disabled) / <alpha-value>)',  // "Ver mais", ícones secundários
},

// Adicionar em border:
border: {
  // ... manter default, subtle existentes
  muted: 'rgb(var(--tw-border-muted) / <alpha-value>)',  // separador do modal
},

// Adicionar em brand:
brand: {
  // ... manter primary, accent existentes
  'primary-hover':  'rgb(var(--tw-brand-primary-hover) / <alpha-value>)',
  'primary-active': 'rgb(var(--tw-brand-primary-active) / <alpha-value>)',
},
```

Corrigir `error` e `success` para alinharem com o Figma:
```ts
// Substituir os valores atuais:
error:   'rgb(var(--tw-error) / <alpha-value>)',    // era #b45454, Figma: #FF5274
success: 'rgb(var(--tw-success) / <alpha-value>)',  // era #34d399, Figma: #71D875
```

**Critério de aceite:** Classes `bg-surface-overlay`, `bg-surface-interactive`, `text-content-disabled`, `border-border-muted`, `bg-brand-primary-hover`, `bg-brand-primary-active`, `text-error`, `text-success` funcionam no Tailwind.

---

### Tarefa 1.2 — Adicionar CSS variables faltantes em `tailwind.css`

**Arquivo:** `packages/tailwind-config/tailwind.css`

Adicionar no `:root` (dark mode):
```css
:root {
  /* ... manter variáveis existentes ... */

  /* Adicionar: */
  --tw-surface-overlay:      38 38 38;    /* #262626 — contact section */
  --tw-surface-interactive:  73 73 73;    /* #494949 — badges, hover */
  --tw-content-disabled:     164 164 164; /* #A4A4A4 — "Ver mais", ícones */
  --tw-border-muted:         73 73 73;    /* #494949 — separador modal */
  --tw-brand-primary-hover:  50 61 205;   /* #323DCD */
  --tw-brand-primary-active: 161 168 255; /* #A1A8FF */
  --tw-error:                255 82 116;  /* #FF5274 */
  --tw-success:              113 216 117; /* #71D875 */
}
```

Adicionar na classe `.light`:
```css
.light {
  /* ... manter variáveis existentes ... */

  /* Adicionar: */
  --tw-surface-overlay:      255 255 255; /* #FFFFFF */
  --tw-surface-interactive:  235 235 235; /* #EBEBEB */
  --tw-content-disabled:     164 164 164; /* #A4A4A4 */
  --tw-border-muted:         186 186 186; /* #BABABA */
  --tw-brand-primary-hover:  65 79 255;   /* #414FFF */
  --tw-brand-primary-active: 192 197 255; /* #C0C5FF */
  --tw-error:                244 53 100;  /* #F43564 */
  --tw-success:              82 206 122;  /* #52CE7A */
}
```

**Critério de aceite:** Alternar `.light` no `<html>` muda corretamente todas as cores em toda a interface.

---

### Tarefa 1.3 — Verificar ThemeToggle

**Arquivo:** `apps/site/src/components/Layout/SideNavigation/ThemeToggle.tsx`

Confirmar que aplica/remove a classe `.light` no `document.documentElement`. O `darkMode: 'selector'` já está correto no `tailwind-config`.

**Critério de aceite:** Toggle no SideNavigation muda o tema visualmente em toda a interface.

---

## Épico 2 — Corrigir tokens hardcoded nos componentes existentes

> ⚠️ Depende do Épico 1.

Identificar todos os usos de tokens primitivos:
```bash
grep -rn "bg-dark-\|text-dark-\|\!text-white\|\!bg-dark\|\!text-dark\|text-primary\b\|bg-primary\b" \
  apps/site/src/features/ \
  apps/site/src/components/Layout/ \
  packages/ui/src/
```

### Tarefa 2.1 — Header
**Arquivo:** `apps/site/src/components/Layout/Header/index.tsx`
- `bg-dark-300` → `bg-surface`
- `xl:!bg-dark-200` → `xl:bg-surface-sunken`
- `!bg-dark-600` → `bg-surface-sunken`
- `hover:!bg-dark-500` → `hover:bg-surface`
- `!text-dark-900` → `text-content-secondary`

### Tarefa 2.2 — HeroBanner
**Arquivo:** `apps/site/src/features/shared/HeroBanner/index.tsx`
- `bg-dark-300` → `bg-surface`
- `!text-dark-900` → `text-content-secondary`
- `!text-white` → `text-content-primary`

### Tarefa 2.3 — StatCard
**Arquivo:** `apps/site/src/features/shared/StatCard/index.tsx`
- Tokens primitivos → tokens semânticos equivalentes

### Tarefa 2.4 — ProjectCard (home)
**Arquivo:** `apps/site/src/features/home/ProjectsSection/ProjectCard.tsx`
- `bg-dark-300` → `bg-surface`
- `rounded-5` → `rounded-xl` (12px)
- `!text-white` → `text-content-primary`
- `!text-dark-900` → `text-content-secondary`

### Tarefa 2.5 — ExperienceCard
**Arquivo:** `apps/site/src/features/about/ExperiencesSection/ExperienceCard.tsx`
- `bg-dark-200` → `bg-surface-sunken`
- `text-white` → `text-content-primary`
- `text-dark-700` → `text-content-muted`

### Tarefa 2.6 — ProfessionalValue
**Arquivo:** `apps/site/src/features/about/ValuesSection/ProfessionalValue.tsx`
- Tokens primitivos → tokens semânticos equivalentes

### Tarefa 2.7 — ContactSection / ContactInfo / ContactForm
**Arquivos:** `apps/site/src/features/contact/`
- `bg-dark-300` → `bg-surface`
- `!text-white` → `text-content-primary`
- `!text-primary` → `text-brand-primary`

### Tarefa 2.8 — SkillGroup / Skill
**Arquivos:** `apps/site/src/features/shared/SkillGroup/`
- `bg-dark-500` → `bg-surface-interactive`
- `!text-white` → `text-content-primary`

### Tarefa 2.9 — SideNavigation
**Arquivo:** `apps/site/src/components/Layout/SideNavigation/index.tsx`
- `dark:bg-dark-200` → `dark:bg-surface-sunken`

### Tarefa 2.10 — @repo/ui: Input, Label, Button
**Arquivos:** `packages/ui/src/Control/`
- Substituir quaisquer tokens primitivos por semânticos

---

## Épico 3 — Corrigir estilização pixel-perfect

> ⚠️ Depende do Épico 1.  
> 📐 Referência: `FIGMA_SPECS.md` — seção específica de cada componente.

### Tarefa 3.1 — HeroBanner: corrigir tipografia
**Arquivo:** `apps/site/src/features/shared/HeroBanner/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §HeroBanner

Specs confirmadas do Figma (corrigir se divergir):

**Home** (`features/home/HeroSection`):
- Overline (nome): `24px/400`
- Cargo (título): `40px/700` ← verificar, pode estar como 32px
- Bio: `16px/400`
- Coluna texto: `width=474px`

**About** (`features/about/HeroSection`):
- Overline (cargo): `24px/400`
- Nome (H1): `48px/700` ← maior que Home
- Bio: `16px/400`
- Coluna texto: `width=382px`

Adicionar props se necessário:
- `titleSize?: 'lg' | 'xl'` — Home=40px, About=48px
- `titleAs?: 'h1' | 'h2'`
- Remover foto placeholder — `src` deve vir da feature pai

---

### Tarefa 3.2 — StatCard: pixel-perfect
**Arquivo:** `apps/site/src/features/shared/StatCard/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §StatCard

```
Container: bg-surface rounded-xl w-full h-[152px]
Layout: flex flex-row items-center gap-4

Ícone: 72×72px — Iconify fill=brand-accent (#8EFB9D)
Texto: VERTICAL gap=4px pb-2.5
  Número: text-4xl font-bold text-content-primary  (36px/700)
  Label:  text-lg font-normal text-content-primary pl-5  (18px/400)

Grid de stats: flex flex-row gap-6
```

---

### Tarefa 3.3 — ProjectCard: pixel-perfect
**Arquivo:** `apps/site/src/features/home/ProjectsSection/ProjectCard.tsx`  
**Referência:** `FIGMA_SPECS.md` §ProjectCard (grid view)

```
Card: 463×418px | bg-surface rounded-xl

Área imagem: h-[244px] padding: 12px 12px 0 12px
  imagem: rounded-lg object-cover

Área conteúdo: padding: 16px 24px 24px 24px | gap=20px | HORIZONTAL
  Bloco texto: gap=16px | VERTICAL
    Título: 24px/700/text-content-primary
    Descrição: 16px/400/text-content-secondary | line-clamp-2
    Badges: gap=12px

  Botão seta (self-end): 54×54px | bg-brand-primary rounded-xl
    ícone: UI/arrow_forward (white, 24x24)
```

Integrar `Button.Clipboard` (já existe em `@repo/ui`) no hover do card.

---

### Tarefa 3.4 — ProjectsSection (row view)
**Arquivo:** `apps/site/src/features/projects/ProjectsSection/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §ProjectCard (row view)

```
Card: 950×339px | bg-surface rounded-xl | HORIZONTAL

Imagem (esquerda, 465×339px): padding: 12px
  imagem interna: 441×315px | rounded-lg

Conteúdo (direita, 485×339px): padding: 24px | gap=20px | HORIZONTAL
  Bloco texto (363px): gap=16px | título, descrição, badges
  Coluna botões (54px): SPACE_BETWEEN
    UI/share (24×24) — topo
    Botão seta 54×54px bg-brand-primary rounded-xl — rodapé

Lista: VERTICAL gap=24px
```

---

### Tarefa 3.5 — ExperienceCard: pixel-perfect + funcionalidades
**Arquivo:** `apps/site/src/features/about/ExperiencesSection/ExperienceCard.tsx`  
**Referência:** `FIGMA_SPECS.md` §ExperienceCard

Specs confirmadas do Figma:
- Empresa: `20px/700/text-content-primary` (não 16px)
- Gap entre cards: `gap-10` (40px)
- Localização: `16px/400/text-content-disabled`
- "Ver mais": `14px/400/text-content-disabled` (não brand-primary)

Implementar ou corrigir:
1. **Duração calculada:** `calculateDuration(start, end)` → `"1a 3m"` — fim `null` = hoje
2. **Toggle "Ver mais":** `line-clamp-1` default, estado local `expanded`
3. **Badges renderizadas:** máx. 3 + badge `+N` | `bg-surface-interactive rounded-badge h-7 px-3 py-1`
4. **Badge `+N` clicável** → abre `TechnologiesModal` (Tarefa 4.2)
5. **Separador:** `border-b border-border-default` entre cards

---

### Tarefa 3.6 — ProfessionalValue: pixel-perfect + rich text
**Arquivo:** `apps/site/src/features/about/ValuesSection/ProfessionalValue.tsx`  
**Referência:** `FIGMA_SPECS.md` §ProfessionalValueCard

```
Card: 225×199px | bg-surface rounded-xl | padding: 24px 16px | gap=10px | VERTICAL
  Ícone: 48×48px Iconify fill=brand-accent
  Texto: 16px/400/text-content-primary

Grid (ValuesSection): grid grid-cols-4 gap-4 items-stretch
Título seção: text-4xl font-bold text-content-primary text-left (32px — alinhado à esquerda)
Rich text: campo description aceita JSX com <strong class="text-brand-accent font-bold">
```

---

### Tarefa 3.7 — Input/Label: estilos de estado
**Arquivos:** `packages/ui/src/Control/Input/index.tsx`, `packages/ui/src/Control/Label/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §Input

```
Input: h-11 px-2 py-3 rounded-xl border

Estados dark:           Estados light:
  default:  border-content-disabled    default:  border-content-secondary
  focused:  border-content-secondary   hovered:  border-content-muted
  success:  border-success + check      success:  border-success + check
  error:    border-error + cancel       error:    border-error + cancel

Placeholder: 14px/400/text-content-secondary
Erro: text-xs text-error (abaixo do input)

Label dark:  16px/700/text-content-primary
Label light: 16px/700/text-content-secondary
```

---

### Tarefa 3.8 — Breadcrumb: pixel-perfect
**Arquivo:** `apps/site/src/features/shared/Breadcrumb/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §Breadcrumb

```
Row: flex items-center gap-1

Item default: px-3 py-1.5 | 14px/400/text-content-secondary | hover: underline
Item ativo:   px-3 py-1.5 | rounded-lg
              dark: bg-surface text-content-primary
              light: bg-border-subtle text-content-secondary
Separador: UI/arrow_forward_ios (20×20, text-content-disabled)

Barra nav: flex justify-between items-center h-12
  "← Voltar": UI/arrow_back (24×24) + "Voltar" 16px/400/text-content-primary
  Breadcrumb: à direita
```

---

### Tarefa 3.9 — ContactSection: pixel-perfect
**Arquivo:** `apps/site/src/features/contact/ContactSection/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §Contact Section

```
Container: 1272px wide
  fill: bg-surface-overlay (dark #262626 | light #FFFFFF)
  padding: py-10 px-[161px]

Layout interno: 950px | gap=64px | HORIZONTAL

Coluna formulário (560px): gap=24px
  Título: 20px/700/text-content-primary
  Campos: gap=24px
    Row 1: Nome* (268px) + Sobrenome (268px)
    Row 2: E-mail* (560px)
    Row 3: Mensagem* (textarea h-[124px])
  Botão: w-[216px] h-[46px] bg-brand-primary rounded-xl
  (usar react-hook-form + zod já instalados)

Coluna info (326px): gap=24px
  Título: 24px/700/text-content-primary
  Email + UI/content_copy (24×24, text-content-secondary)
  WhatsApp + UI/content_copy
  Separador: border-b-2 border-border-default
  Texto: 16px/400/text-content-primary
  Ghost links: LinkedIn + GitHub (w-[157px])
```

---

## Épico 4 — Implementar componentes ausentes

### Tarefa 4.1 — Modal: criar em @repo/ui
**Arquivo:** `packages/ui/src/Control/Modal/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §Modal de Tecnologias

```tsx
// Props: open, onClose, title?, children
// Container: bg-surface rounded-xl p-6 w-[690px] max-h-[80vh] overflow-y-auto
// Overlay: bg-black/60 fixed inset-0 z-50 flex items-center justify-center
// Fechar: botão UI/close + Escape + click no overlay
// Trap de foco quando aberto
// Usar portal (createPortal) para renderizar no body
```

---

### Tarefa 4.2 — TechnologiesModal: criar em features/about
**Arquivo:** `apps/site/src/features/about/TechnologiesModal/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §Modal de Tecnologias

Usa `Modal` de `@repo/ui` e `Accordion` (já existe em `@repo/ui`).

**Estado Basic (padrão ao abrir):**
```
Header:
  Título: "Tecnologias utilizadas" — 24px/700/text-content-primary
  Botão X: UI/close (24×24)
  Linha empresa: empresa 20px/700 + cargo 16px/400 (text-content-primary)

Badges pílula: bg-surface-interactive rounded-[44px] px-3 py-2 h-[38px]
  ícone 20×20 + texto 16px/400/text-content-primary | gap=10px
```

**Estado Detailed (via toggle):**
```
Título: 20px/700 (encolhe)
Empresa/cargo: text-content-secondary
Separador: border-b border-border-muted após header
Accordion items (usar @repo/ui/Control/Accordion):
  Trigger: ícone 24×24 + label 16px/700/text-content-primary + chevron
  Body: 14px/400/text-content-secondary
  Separador entre items: border-b border-border-default
```

---

### Tarefa 4.3 — CurriculumCTA: criar em features/about
**Arquivo:** `apps/site/src/features/about/CurriculumCTA/index.tsx`  
**Referência:** `FIGMA_SPECS.md` §CurriculumCTA

```
Container: 951×381px | bg-surface rounded-xl | padding: 32px | gap=56px | HORIZONTAL

Coluna esquerda: 320×317px — ilustração estática (imagem decorativa)

Coluna direita: 511×250px | gap=32px | VERTICAL
  Texto: 24px/400/text-content-primary
    "Acesse meu currículo para descobrir detalhes exclusivos..."
  Botão: w-[292px] h-[48px] | bg-brand-primary rounded-xl | gap=8px
    "Acessar currículo" + UI/open_in_new
    URL via prop ou variável de ambiente
```

---

### Tarefa 4.4 — ProjectDetail: completar implementação
**Arquivo:** `apps/site/src/features/projects/ProjectDetail/ProjectDetail.tsx`  
**Referência:** `FIGMA_SPECS.md` §ProjectDetail

Verificar se os seguintes blocos estão implementados e corretos:

```
Seção 1 — Navegação + Hero:
  Barra nav: "← Voltar" (UI/arrow_back) + Breadcrumb
  Imagem capa: 951×485px | rounded-lg | object-cover
  Título H1: 40px/700/text-content-primary
  Descrição: 20px/400/text-content-primary
  Badges row: gap=12px

Seção 2 — InfoGrid (ProjectMetaGrid):
  Card Resumo + Card Objetivos: 463×150px | bg-surface rounded-xl p-6
    Label: 20px/700/text-content-muted | Texto: 16px/400/text-content-primary
  Linha meta: Função | Habilidades | Equipe | Data (gap=40px)
    label 16px/700 + valor 16px/400

Seção 3 — ContentBlocks:
  Full: imagem 951×404px + overline 16px/700/text-content-muted + H2 32px/700 + corpo 20px/400
  Split: imagem 549×404px (esquerda) + texto 368px (direita)

Seção 4 — Outros projetos:
  Título: 32px/700/text-content-primary
  2 × ProjectCard grid view | gap=24px
```

---

## Épico 5 — Atualizar pages e integrar features

> Depende dos Épicos 3 e 4.

### Tarefa 5.1 — Integrar CurriculumCTA na página About
**Arquivo:** `apps/site/src/app/[locale]/about/page.tsx`

Adicionar `<CurriculumCTA />` após `<ExperiencesSection />`.

### Tarefa 5.2 — Garantir ContactSection no AppLayout
**Arquivo:** `apps/site/src/components/Layout/AppLayout/index.tsx`

Confirmar que `<ContactSection />` está renderizada abaixo do `<main>` em todas as páginas.

### Tarefa 5.3 — Garantir alias `~features` no tsconfig
**Arquivo:** `apps/site/tsconfig.json`

```json
"paths": {
  "~components":  ["./src/components/index.ts"],
  "~features/*":  ["./src/features/*"],
  "~hooks":       ["./src/hooks/index.ts"],
  "~assets/*":    ["./src/assets/*"],
  "~i18n/*":      ["./src/i18n/*"]
}
```

---

## Ordem de execução recomendada

```
Épico 1  (tokens — fundação obrigatória)
  ↓
Épico 2  (corrigir hardcoded — paralelo com Épico 3)
Épico 3  (pixel-perfect — paralelo com Épico 2)
  ↓
Épico 4  (implementar ausentes — depende de 1, 2 e 3)
  ↓
Épico 5  (integrar nas pages — depende de 4)
```

---

## Definição de pronto (DoD)

- [ ] `grep -rn "bg-dark-\|text-dark-\|\!text-white\|\!bg-dark\|\!text-dark" apps/site/src/ packages/ui/src/` → zero resultados fora de `components/Layout/`
- [ ] Dark mode e light mode funcionam via `ThemeToggle` em todas as páginas
- [ ] `packages/ui/src/Control/Modal/` existe e funciona
- [ ] `features/about/TechnologiesModal/` existe e abre ao clicar em `+N` nas experiências
- [ ] `features/about/CurriculumCTA/` existe e está visível na página About
- [ ] ExperienceCard mostra duração calculada, toggle "Ver mais" e badges
- [ ] HeroBanner Home: cargo `40px/700` | About: nome `48px/700`
- [ ] StatCard pixel-perfect conforme Figma
- [ ] ContactSection usa `bg-surface-overlay` e está visível em todas as páginas
- [ ] Breadcrumb pixel-perfect na página ProjectDetail
- [ ] `next build` passa sem erros ou warnings de CSS
# Figma Design Specs — Wallace Portfolio
> Extraído via Figma REST API + Figma Desktop Plugin Console.  
> Use como referência técnica pixel-perfect para implementação.  
> Arquivo: `wJAZ2UZ9dv3Z3tVorgsh0p` (Wallace Portfolio — Copy)
>
> **Atualização:** light mode + layouts responsivos adicionados via `figma-console-extractor.js`.

---

## Tokens Globais

### Cores (Dark Mode)
```
Background página:     #1C1C1C
Surface card:          #323232  (bg de cards, hero, modais)
Surface elevated:      #282828  (sidebar, footer bg)
Surface overlay:       #262626  (contact section bg)
Surface interactive:   #494949  (badges/pills, hover states)
Surface hover:         #3E3E3E  (hover de menu, bordas)

Text primary:          #FFFFFF
Text secondary:        #BABABA
Text muted:            #8D8D8D
Text disabled:         #555555

Brand primary:         #4452FF
Brand primary hover:   #323DCD
Brand primary active:  #A1A8FF
Brand accent:          #8EFB9D  (ícones, destaques verdes)

Error:                 #FF5274  (mensagens de erro, borda input error)
Success:               #71D875  (borda input success)

Border default:        #3E3E3E  (bordas de componentes interativos)
Border subtle:         #323232  (separadores)
Border muted:          #494949  (separador do modal)
```

### Cores (Light Mode) ✅ COMPLETO
```
Background página:     #F5F6FA
Surface card:          #FFFFFF
Surface elevated:      #EBEBEB  (hover fills, inputs com foco)
Surface selected:      #DADADA  (breadcrumb ativo, menu idioma/tema selecionado)
Surface interactive:   [sem correspondência direta — usar Surface card #FFFFFF]

Text primary:          #3E3E3E  (títulos, textos fortes, ícones em hover)
Text secondary:        #555555  (corpo de texto, labels, breadcrumb, ghost link default)
Text muted:            #8D8D8D  (placeholder de input, ícone separador)
Text disabled:         #A4A4A4  (ícone open_in_new no ghost link default)

Brand primary:         #5865FF  (diferente do dark #4452FF)
Brand primary hover:   #414FFF
Brand primary active:  #C0C5FF  (fill do botão active no light)
Brand primary active text: #3E3E3E (texto do botão active — inverte para escuro)
Brand accent:          [não extraído — usar #6FE37F por estimativa]

Error:                 #F43564  (border input error no light — ligeiramente diferente de #FF5274)
Success:               #52CE7A  (border input success no light — ligeiramente diferente de #71D875)

Border default:        #BABABA  (borda de ghost links, inputs default)
Border hover:          #555555  (borda de input hovered)

Accordion text:        #555555  (descrição expandida)
Accordion label:       #323232  (nome do framework/tech)
Accordion icon:        #A4A4A4  (chevron)
```

### Espaçamento (Sistema oficial do Figma)
```
gap-sm:   24px  — Entre título e componente / entre itens de uma lista
gap-md:   40px  — Entre componentes diferentes / entre blocos da mesma seção
gap-lg:   80px  — Entre áreas distintas (hero→content, content→footer, content→CTA)
gap-xl:   64px  — Entre colunas do contact section
```

### Tipografia
```
H1 — Section title:    32px / 700 / lh=44.8px  (#FFFFFF dark | #3E3E3E light)
H2 — Card title:       24px / 700 / lh=33.6px  (#FFFFFF dark | #3E3E3E light)
H3 — Stat number:      36px / 700 / lh=50.4px  (#FFFFFF dark | #3E3E3E light)
Body L bold:           20px / 700 / lh=28px     (#FFFFFF)
Body M bold:           16px / 700 / lh=22.4px   (#FFFFFF)
Body M regular:        16px / 400 / lh=22.4px   (#BABABA dark | #555555 light)
Body S bold:           14px / 700 / lh=19.6px
Body S regular:        14px / 400 / lh=19.6px   (#BABABA dark | #555555 light)
Caption:               12px / 400 / lh=16.8px   (#FF5274 erro dark | #F43564 erro light)
Overline:              16px / 700 uppercase      (#8D8D8D ou #BABABA)
```

### Border Radius
```
br-sm:   8px   — Menu items, breadcrumb item ativo, image dentro de card
br-md:   12px  — Botões, inputs, ghost links, cards de stat, sidebar items
br-lg:   15px  — Skill badges/pills pequenas
br-xl:   12px  — Cards principais (Hero, ProjectCard, Modal, ProfessionalValueCard)
br-pill: 44px  — Skill badges no modal (estilo pílula)
```

---

## Componentes — Specs Detalhadas

---

### Button (filled)
```
Tamanho Small:
  width: auto | height: 40px
  padding: 8px 24px
  gap: 8px
  border-radius: 12px
  font: 16px / 700 / #FFFFFF / lh=22.4px
  
Tamanho Large:
  width: auto | height: 48px
  padding: 12px 24px
  gap: 8px
  border-radius: 12px
  font: 16px / 700 / #FFFFFF / lh=22.4px

Estados dark:
  default:  fill=#4452FF  text=#FFFFFF
  hover:    fill=#323DCD  text=#FFFFFF
  active:   fill=#A1A8FF  text=#262626
  disabled: fill=#8D8D8D  text=#FFFFFF

Estados light: ✅ COMPLETO
  default:  fill=#5865FF  text=#FFFFFF
  hover:    fill=#414FFF  text=#FFFFFF
  active:   fill=#C0C5FF  text=#3E3E3E  ← texto inverte para escuro no active
  disabled: fill=#8D8D8D  text=#FFFFFF  (igual ao dark)

Botão icon-only (ProjectCard):
  width: 54px | height: 54px
  padding: 12px 24px
  border-radius: 12px
  fill: #4452FF (dark) | #5865FF (light)
  ícone: UI/arrow_forward (#FFFFFF, 24x24)
```

### Button (Ghost Link — sidebar/contact)
```
Estados dark:
  default:  border=1px solid #3E3E3E  fill=transparent  text=#FFFFFF  icon=#A4A4A4
  hover:    border=1px solid #3E3E3E  fill=#323232      text=#FFFFFF  icon=#BABABA

Estados light: ✅ COMPLETO
  default:  border=1px solid #BABABA  fill=transparent  text=#555555  icon=#A4A4A4
  hover:    border=1px solid #BABABA  fill=#EBEBEB       text=#3E3E3E  icon=#3E3E3E

Layout (ambos os modos):
  height: 48px
  padding: 12px 16px
  gap: 46px (SPACE_BETWEEN — afasta label e ícone direito às extremidades)
  border-radius: 12px
  font: 16px / 400 / lh=22.4px
  ícone direito: UI/open_in_new ou UI/arrow_drop_down (20x20)
```

---

### Input
```
height: 44px
padding: 12px 8px
gap: 10px
border-radius: 12px
font placeholder: 14px / 400 / lh=19.6px

Bordas por estado (dark):
  default:  1px solid #555555
  selected: 1px solid #BABABA  (foco)
  success:  1px solid #71D875  + ícone UI/check_circle fill=#71D875
  error:    1px solid #FF5274  + ícone UI/cancel fill=#FF5274

Bordas por estado (light): ✅ COMPLETO
  default:  1px solid #BABABA   ← mais suave que dark
  hovered:  1px solid #555555   ← escurece no hover (inverte lógica do dark)
  success:  1px solid #52CE7A  + ícone UI/check_circle fill=#52CE7A
  error:    1px solid #F43564  + ícone UI/cancel fill=#F43564

Placeholder text:
  dark:  #BABABA
  light: #8D8D8D

Mensagem de erro abaixo do input:
  dark:  12px / 400 / #FF5274 / lh=16.8px
  light: 12px / 400 / #F43564 / lh=16.8px

Wrapper (Text input = label + input + erro):
  layout: VERTICAL | gap: 4px
  
Label:
  dark:  16px / 700 / #FFFFFF / lh=22.4px
  light: 16px / 700 / #555555 / lh=22.4px
  * obrigatório: mesma cor do label (sem destaque especial)
```

---

### MenuItem (Sidebar Navigation)
```
width: 208px | height: 48px
padding: 12px 16px
gap: 16px
border-radius: 8px

Estados dark:
  default:  fill=transparent  text=#BABABA  font-weight=400
  hover:    fill=#323232      text=#BABABA  font-weight=700
  selected: fill=#3E3E3E      text=#FFFFFF  font-weight=700

Estados light: ✅ COMPLETO
  default:  fill=transparent  text=#555555  font-weight=400
  hover:    fill=#C0C5FF      text=#3E3E3E  font-weight=700  ← azul claro
  selected: fill=#5865FF      text=#FFFFFF  font-weight=700  ← azul brand

ícone: 24x24px (Iconify, cor herdada do texto)
font: 16px / lh=22.4px
```

---

### Sidebar Navigation
```
width: 240px
padding interna: layout com gap=12px entre itens

Dark mode:  fill=#282828
Light mode: fill= [não extraído diretamente — usar Surface elevated]

Seções (de cima para baixo):
  1. Logo Wallace Ferreira (179x66px)
  2. Menu items — gap=12px entre items
  3. [separador implícito]
  4. Ghost Links (LinkedIn, GitHub) — com ícone open_in_new
  5. Ghost Dropdown (Idioma) — com ícone arrow_drop_down
  6. Ghost Dropdown (Tema) — toggle Dark/Light, com ícone arrow_drop_down

Ghost Dropdown (Idioma/Tema) estados light: ✅ COMPLETO
  default:  fill=transparent  border=1px solid #BABABA  text=#555555  icon=#A4A4A4
  hover:    fill=#EBEBEB       border=1px solid #BABABA  text=#3E3E3E  icon=#3E3E3E
  selected: fill=#EBEBEB       border=1px solid #BABABA  text=#3E3E3E  icon=#3E3E3E
           padding: 12px 16px | gap: 12px

Toggle Tema (dark — para referência):
  height: 48px | border: 1px solid #3E3E3E | border-radius: 12px
```

---

### HeroBanner (Home e About)
```
Card container:
  width: 1144px (desktop 1512) | height: 424px
  fill: #323232
  border-radius: 12px

Layout interno (Home — nome à esquerda):
  Coluna texto: width=474px | gap=24px entre elementos
  Coluna foto: width=520px | altura=413px (foto recortada com bg de código)

Layout interno (About — nome é o H1 principal):
  Coluna texto: width=382px | gap=24px
  Hierarquia: overline (cargo) → H1 (nome, 32px/700) → parágrafo bio

Texto (Home):
  Nome: 16px / 400 (subtítulo acima do título)
  Título cargo: 32px / 700 / #FFFFFF
  Bio: 16px / 400 / #FFFFFF

Texto (About):
  Overline cargo: 16px / 400 (acima do nome)
  Nome (H1): 32px / 700 / #FFFFFF ← hierarquia principal
  Bio: 16px / 400 / #FFFFFF
```

---

### StatCard
```
width: 463px | height: 152px
fill: #323232
border: 1px solid #323232
border-radius: 12px

Layout interno: HORIZONTAL | gap=16px | align=CENTER
  Ícone container: 72x72px (ícone Iconify fill=#8EFB9D, 54x54)
  Texto wrapper: VERTICAL | gap=4px | padding-bottom=10px
    Número: 36px / 700 / #FFFFFF / lh=50.4px
    Label:  18px / 400 / #FFFFFF / lh=25.2px | padding-left=20px

Grid de stats: HORIZONTAL | gap=24px | 2 colunas (pode ser N por decisão do dev)
```

---

### ProjectCard (grid view — Home)
```
Card:
  width: 463px | height: 418px
  fill: #323232
  border-radius: 12px
  layout: VERTICAL

Área de imagem (topo):
  height: 244px | padding: 12px 12px 0 12px
  imagem: border-radius: 8px | object-fit: cover

Área de conteúdo (rodapé):
  padding: 16px 24px 24px 24px
  gap: 20px
  layout: HORIZONTAL (conteúdo texto à esquerda + botão à direita)

  Bloco de texto (esquerda):
    gap: 16px
    Título: 24px / 700 / #FFFFFF / lh=33.6px | 341px wide
    Descrição: 16px / 400 / #BABABA / lh=22.4px | 2 linhas truncadas

  Badges:
    HORIZONTAL | gap=12px
    Badge: fill=#494949 | border-radius=15px | padding=4px 12px | height=28px
      ícone: 20x20 + texto: 14px / 400 / #FFFFFF / lh=19.6px | gap=8px
    Badge "+N": fill=#494949 | border-radius=15px | padding=4px 12px
      texto: 14px / 400 / #FFFFFF

  Botão (direita, alinhado ao rodapé):
    54x54px | fill=#4452FF | border-radius=12px
    ícone: UI/arrow_forward (#FFFFFF, 24x24)

Grid de cards: HORIZONTAL | gap=24px | 2 colunas (950px wide)
Título seção "Projetos": 32px / 700 / #FFFFFF acima do grid | gap=24px
```

---

### ProjectCard (row view — Projects page)
```
Card:
  width: 950px | height: 339px
  fill: #323232
  border-radius: 12px
  layout: HORIZONTAL

Imagem (esquerda): ~40% da largura (~380px) | object-fit: cover | border-radius: 12px 0 0 12px
Conteúdo (direita): padding relativo | gap entre elementos

  Overline: uppercase | 14px / 700 / #8D8D8D (cor muted)
  Título: 24px / 700 / #FFFFFF
  Descrição: 16px / 400 / #BABABA | sem truncamento (descrição longa)
  Badges: igual ao grid view
  Botão seta: 54x54px | fill=#4452FF | border-radius=12px (canto inferior direito)
  Ícone share: canto superior direito do card (20x20, #BABABA)

Lista: VERTICAL | gap=24px
```

---

### ProfessionalValueCard
```
Card:
  width: 225px | height: 199px
  fill: #323232
  border: 1px solid #323232
  border-radius: 12px
  padding: 24px 16px
  gap: 10px

Layout interno: VERTICAL | gap=16px
  Ícone: 48x48px (Iconify, fill=#8EFB9D — sem container quadrado, ícone solto)
  Texto: 16px / 400 / #FFFFFF / lh=22.4px | width=194px
    (palavras em destaque usam <strong> com text=#8EFB9D font-weight=700)

Grid: 4 colunas | gap=16px | items-stretch (altura uniforme)
Título seção: 32px / 700 / #FFFFFF | alinhado à ESQUERDA | margin-bottom=24px
  (NÃO centralizado)
```

---

### ExperienceCard
```
Layout da lista: VERTICAL | gap=24px
Separador entre cards: border-bottom: 2px solid #3E3E3E (ou <hr>)

Card (sem container próprio — layout flat na lista):
  Cargo (H2): 24px / 700 / #FFFFFF
  
  Linha empresa:
    Empresa: uppercase / 16px / 700 / #FFFFFF
    Separador: " | "
    Período: "Out 2023 - Dez 2023 (1a 3m)"
      — duração calculada automaticamente: format "Xa Xm"
      — font: 16px / 400 / #BABABA
  
  Localização + tipo:
    "São Paulo, Brasil • Full-time • Remoto"
    font: 16px / 400 / #BABABA

  Descrição:
    font: 16px / 400 / #BABABA | truncada com "Ver mais" inline
    "Ver mais": link #4452FF underline

  Badges de tecnologia:
    HORIZONTAL | gap=12px | margin-top após descrição
    Badge: fill=#494949 | border-radius=15px | padding=4px 12px | height=28px
    Máximo visível: 3 badges + badge "+N" se houver mais
    Badge "+N": clicável → abre Modal de Tecnologias
```

---

### Modal de Tecnologias
```
Container:
  width: 690px
  fill: #323232
  border-radius: 12px
  padding: 24px
  gap: 24px (entre header e corpo)

Header:
  Título: "Tecnologias utilizadas" — 24px / 700 / #FFFFFF (estimado)
  Subtítulo: "EMPRESA | Cargo" — uppercase / 16px / 700 / #FFFFFF
  Botão X: canto superior direito

Estado BASIC (ao abrir):
  Corpo: linha horizontal de badges (igual ao ExperienceCard)
  badge: fill=#494949 | border-radius=44px (pílula) | padding=8px 12px | height=38px
    ícone + texto | gap=10px

Estado DETAILED (ao clicar numa badge ou expandir):
  Separador: 1px solid #494949 (após header)
  Lista de Accordion items: VERTICAL | gap=12px
  
  Accordion item (collapsed):
    height: 48px | padding: 12px 0
    layout: HORIZONTAL | gap=12px
    [ícone 24x24] [label 16px/700/#FFFFFF] [chevron-down à direita, fill=#BABABA]
    
  Accordion item (expanded):
    padding: 12px 0 | gap=12px
    [linha do trigger igual ao collapsed mas com chevron-up]
    [texto descrição: 14px / 400 / #BABABA / lh=19.6px]
  
  Separador entre items: 1px solid #3E3E3E
```

### Accordion (Light Mode) ✅ COMPLETO
```
Estados:
  collapsed:
    label (framework): 16px / 700 / #323232
    chevron icon: fill=#A4A4A4
    fill: transparent
    
  expanded:
    label: 16px / 700 / #323232
    chevron icon: fill=#A4A4A4
    descrição: 14px / 400 / #555555 / lh=19.6px
    fill: transparent
    
Separador entre items: border-bottom (cor não extraída — usar #DADADA no light)
Ícone de tech: fill herdado do asset (ex: React = #61DAFB)
```

---

### Breadcrumb (Project Detail)
```
Container: height=48px | padding: 8px 0 | gap=8px | VERTICAL
Row de items: HORIZONTAL | gap=4px

Item (default/hover) — dark:
  padding: 6px 12px | height=32px
  border-radius: 0 (sem fill)
  font: 14px / 400 / #BABABA | hover: underline

Item (ativo/atual — último) — dark:
  padding: 6px 12px | height=32px
  border-radius: 8px
  fill: #323232
  font: 14px / 400 / #FFFFFF

Item (default/hover) — light: ✅ COMPLETO
  padding: 6px 12px | height=32px
  border-radius: 0 (sem fill)
  font: 14px / 400 / #555555 | hover: underline

Item (ativo/atual) — light: ✅ COMPLETO
  padding: 6px 12px | height=32px
  border-radius: 8px
  fill: #DADADA
  font: 14px / 400 / #555555  ← texto permanece escuro (não inverte para branco)

Separador entre items: UI/arrow_forward_ios (20x20)
  dark:  fill=#BABABA
  light: fill=#8D8D8D

Layout da página (topo):
  HORIZONTAL | justify-between
  Esquerda: "← Voltar" (link com ícone arrow-left + texto "Voltar")
    font: 16px / 700 / #FFFFFF (dark) | #3E3E3E (light)
  Direita: Breadcrumb component
```

---

### CurriculumCTA (About page)
```
Container:
  width: 951px | height: 381px
  fill: #323232
  border: 1px solid #323232
  border-radius: 12px
  padding: 32px
  gap: 56px
  layout: HORIZONTAL

Coluna esquerda (ilustração):
  width: 320px | height: 317px
  [imagem decorativa de dev/código]

Coluna direita (conteúdo):
  width: 511px
  gap: 32px | VERTICAL

  Textos:
    Título: ~20px / 700 / #FFFFFF (texto longo sobre currículo)
    Subtítulo: ~16px / 400 / #FFFFFF
  
  Botão:
    "Acessar currículo" + ícone UI/open_in_new
    Estilo: Button filled Large (#4452FF, border-radius=12px)
    width: 216px | height: 48px
```

---

### Contact Section (footer de cada página)
```
Container:
  width: 1272px | height: 565px
  fill: #262626
  border: 2px solid #323232
  padding: 40px 161px

  Layout interno: HORIZONTAL | gap=64px | align=MAX (esquerda alinhada ao topo)

Coluna esquerda — Formulário (width=560px):
  Título: "Entre em contato" — 20px / 700 / #FFFFFF
  gap: 24px entre título e campos

  Campos (layout VERTICAL, gap=24px entre campos):
    Row 1: Nome* (268px) + Sobrenome (268px) → 2 colunas, gap=24px
    Row 2: E-mail* (560px full width)
    Row 3: Mensagem* (560px, textarea 124px height)
  
  Botão Enviar:
    width: 216px | height: 48px | fill=#4452FF | border-radius=12px

Coluna direita — Info (width=326px):
  Título: "Entre em contato" — 24px / 700 / #FFFFFF
  
  Email:
    Label: 16px / 700 / #FFFFFF
    Valor + ícone copy: 16px / 400 / #BABABA + UI/content_copy (24x24, #BABABA)
  
  WhatsApp:
    Label: 16px / 700 / #FFFFFF
    Valor + ícone copy: 16px / 400 / #BABABA
  
  Separador: 2px solid #3E3E3E
  
  Texto alternativo: 16px / 400 / #FFFFFF / lh=22.4px
    Exemplo: "Não gosta de preencher formulário? Sem problemas! Sinta-se à vontade
    para me enviar uma mensagem no WhatsApp ou me enviar um e-mail."
  
  Botões LinkedIn + GitHub:
    Ghost link | width=157px | height=51px
    border: 1px solid #3E3E3E | border-radius=12px
    padding: 12px 16px | gap=SPACE_BETWEEN
    ícone social (24x24) + label (16px/400/#FFFFFF) + UI/open_in_new (20x20/#A4A4A4)
```

---

## Breakpoints e Responsividade ✅ COMPLETO

```
1512px — Desktop large (base de design)
1280px — Desktop         ← EXTRAÍDO
1024px — Laptop          ← EXTRAÍDO
 640px — Tablet          ← EXTRAÍDO (mobile nav com hambúrguer)
 375px — Mobile          ← EXTRAÍDO
```

---

### Header por breakpoint

#### Desktop/Laptop (≥1024px) — Sidebar visível
```
Sidebar: width=240px | fill=#282828 | posição fixa à esquerda
Content: max-width=950px | centralizado na área restante
```

#### Tablet 640px — Header hambúrguer ✅
```
Header:
  width: 640px | height: 68px
  fill: #323232
  padding: 12px 16px
  gap: 105px (entre logo e hambúrguer — SPACE_BETWEEN)
  layout: HORIZONTAL

  Logo: 120x44px (esquerda)
  Hambúrguer button: 40x40px | fill=#555555 | border-radius=? | padding=4px
    ícone: UI/menu (32x32, #FFFFFF)

Quando menu aberto (Dark 640px Menu):
  Ícone muda para: UI/close (32x32, #FFFFFF) — mesmo container fill=#555555

Drawer do menu (Discovery Categories):
  width: 375px | height: 690px
  fill: #282828
  posição: fixa à direita (drawer lateral)
  padding interno: gap=24px entre seções

  Seção 1 (nav principal):
    Container: 327x240px | gap=16px
    4 menu items (mesmas specs que sidebar desktop)
  
  Separador: linha horizontal
  
  Seção 2 (links externos):
    Container: 327x240px | gap=16px
    LinkedIn + GitHub + Idioma + Tema (4 ghost links/dropdowns)
    ⚠️ gap entre items: 16px (maior que desktop 12px)
```

#### Mobile 375px — Header hambúrguer ✅
```
Header:
  width: 375px | height: 68px
  fill: #323232
  padding: 12px 16px
  gap: 105px (SPACE_BETWEEN)

  Logo: 120x44px
  Hambúrguer: 40x40px | fill=#555555 | padding=4px
    ícone: UI/menu (32x32, #FFFFFF)

Drawer do menu (Mobile 375px Menu):
  Mesmo layout que 640px — width=375px | fill=#282828
  (ocupa tela inteira na prática em 375px)
```

---

### StatCards por breakpoint ✅

```
1512px (base): 2 cards × ~463px | gap=24px | total ≈ 950px
1280px:        2 cards × 366px  | gap=24px | total = 756px
1024px:        2 cards × 340px  | gap=24px | total = 704px
640px:         2 cards × 300px  | gap=12px | total ≈ 612px
375px:         2 cards × 300px  | gap=12px | total ≈ 360px (scroll horizontal? ou full-width)

Layout interno dos cards é mantido em todos os breakpoints.
Em 1024px o card encolhe: height passa de 152px para 136px.
```

---

### ProjectCards por breakpoint ✅

```
1512px (base): 2 colunas × 463px | gap=24px (grid)
1280px:        2 colunas × 372px | gap=12px | container=756px
1024px:        2 colunas × 346px | gap=12px | container=704px
640px:         1 coluna  | width=576px | gap=12px (empilhado)
375px:         1 coluna  | width=343px | gap=16px (empilhado)

Card interno (1280px): 372×474px | imagem: 372×244px | conteúdo: padding 16/24/24/12 | gap=20px
Card interno (1024px): 346×468px | imagem: 346×244px | conteúdo: padding 16/24/24/12 | gap=20px
```

---

### Hero por breakpoint ✅

```
1512px: width=1144px height=424px (base)
640px:  Hero 640×535px | fill=#323232 | padding: 24px/24px/32px/24px | gap=24px
  Coluna foto: 376×277px
  Coluna texto: 376×178px | gap=12px
  Dentro do texto: Frame 375×100px | gap=4px + parágrafo 375×66px
375px:  Hero 375×507px | fill=#323232 | padding: 24px/24px/32px/24px | gap=24px
  Coluna foto: 327×241px
  Coluna texto: 327×178px | gap=12px
  Dentro do texto: Frame 285×100px | gap=4px + parágrafo 327×66px
```

---

### Contact Section por breakpoint ✅

```
640px — Contact (dentro de um frame 640×1118px, fill=#262626):
  padding: 40px 32px (reduz horizontal de 161px → 32px)
  gap: 24px (reduz de 64px → 24px)
  Layout: VERTICAL (empilha formulário em cima, info embaixo)
  Formulário: width=576px | gap=24px
  Botão enviar: width=260px (centralizado)

375px — Contact (dentro de frame 375×1118px, fill=#262626):
  padding: 40px 16px (ainda menor — 16px horizontal)
  gap: 24px
  Layout: VERTICAL
  Formulário: width=343px
  Botão enviar: width=343px (full-width no mobile)
```

---

### Sidebar Navigation por breakpoint ✅

```
1512px / 1280px / 1024px:
  Sidebar fixa lateral: width=240px | fill=#282828

640px / 375px:
  Sidebar oculta → substituta: Drawer (Discovery Categories)
  Posição: sobreposto à direita, aparece ao clicar no hambúrguer
  width=375px (ocupa boa parte da tela) | fill=#282828
  
  Animação: slide-in da direita (inferido pelo layout)
  Fechar: ícone UI/close no header substitui UI/menu
```

---

## Mapeamento Tailwind → Tokens Figma

```css
/* tailwind-config/index.ts — cores semânticas */
colors: {
  surface: {
    DEFAULT:     '#323232',    /* dark: cards, hero, modal */
    sunken:      '#282828',    /* dark: sidebar, footer */
    overlay:     '#262626',    /* dark: contact section */
    interactive: '#494949',    /* dark: badges, hover states */
  },
  content: {
    primary:   '#FFFFFF',      /* dark */
    secondary: '#BABABA',      /* dark */
    muted:     '#8D8D8D',      /* dark */
    disabled:  '#555555',      /* dark */
  },
  border: {
    DEFAULT: '#3E3E3E',        /* dark */
    subtle:  '#323232',
    muted:   '#494949',
  },
  brand: {
    primary:         '#4452FF',   /* dark */
    'primary-hover': '#323DCD',
    'primary-active':'#A1A8FF',
    accent:          '#8EFB9D',
  },
  error:   '#FF5274',
  success: '#71D875',
}

/* CSS Variables para light mode (globals.css) */
.light {
  --tw-surface:              #FFFFFF;      /* cards */
  --tw-surface-sunken:       #F5F6FA;      /* página */
  --tw-surface-interactive:  #EBEBEB;      /* hover fills */
  --tw-surface-selected:     #DADADA;      /* breadcrumb ativo, menu selected */
  
  --tw-content-primary:      #3E3E3E;
  --tw-content-secondary:    #555555;
  --tw-content-muted:        #8D8D8D;
  --tw-content-disabled:     #A4A4A4;
  
  --tw-border-default:       #BABABA;      /* mais claro que dark */
  --tw-border-hover:         #555555;
  
  --tw-brand-primary:        #5865FF;
  --tw-brand-hover:          #414FFF;
  --tw-brand-active:         #C0C5FF;
  --tw-brand-active-text:    #3E3E3E;     /* texto em botão active inverte */
  
  --tw-error:                #F43564;
  --tw-success:              #52CE7A;
}

/* Tailwind classes por componente */
.stat-card:       bg-surface rounded-xl (12px) w-[463px] h-[152px]
.project-card:    bg-surface rounded-xl (12px)
.value-card:      bg-surface rounded-xl (12px) p-6 (24px)
.input:           border border-content-disabled rounded-xl h-11 px-2 py-3
.button-primary:  bg-brand-primary rounded-xl px-6 py-2 (sm) / py-3 (lg)
.badge:           bg-surface-interactive rounded-[15px] px-3 py-1 h-7
.badge-pill:      bg-surface-interactive rounded-[44px] px-3 py-2 h-[38px]
.menu-item:       rounded-lg px-4 py-3 (8px 16px 12px)
.ghost-link:      border border-border rounded-xl px-4 py-3
.modal:           bg-surface rounded-xl p-6
.sidebar:         bg-surface-sunken w-60
.breadcrumb-item: rounded-lg px-3 py-[6px] (ativo: bg-surface text-content-primary)

/* Responsividade — breakpoints Tailwind sugeridos */
sm:   640px   (tablet — hambúrguer, single column)
md:   1024px  (laptop — sidebar aparece, 2 colunas)
lg:   1280px  (desktop)
xl:   1512px  (desktop large — base de design)
```

---

## Status de cobertura

| Dado | Status |
|---|---|
| Tokens dark mode (cores, tipografia, espaçamento) | ✅ Completo |
| Tokens light mode — componentes UI | ✅ Completo |
| Button estados light | ✅ Completo |
| Ghost Link estados light | ✅ Completo |
| MenuItem estados light | ✅ Completo |
| Input estados light (bordas, cores) | ✅ Completo |
| Accordion light | ✅ Completo |
| Breadcrumb light | ✅ Completo |
| Idioma/Tema dropdown light | ✅ Completo |
| Header mobile (640px e 375px) | ✅ Completo |
| Drawer de menu mobile | ✅ Completo |
| StatCards por breakpoint (1512/1280/1024/640/375) | ✅ Completo |
| ProjectCards por breakpoint | ✅ Completo |
| Hero por breakpoint | ✅ Completo |
| Contact Section por breakpoint | ✅ Completo |
| Sidebar por breakpoint | ✅ Completo |
| Light mode — Surface da sidebar/footer | ⚠️ Estimado (não extraído diretamente) |
| ExperienceCard specs | ⏳ Pendente (rate limit da API REST) |
| HeroBanner specs detalhadas | ⏳ Pendente (rate limit da API REST) |
| ProjectCard row view specs | ⏳ Pendente (rate limit da API REST) |
| CurriculumCTA specs exatas | ⏳ Pendente (rate limit da API REST) |
| ProjectDetail layout completo | ⏳ Pendente (rate limit da API REST) |

---

## Componentes Extraídos — Specs Completas ✅

> Seção adicionada via extração direta dos frames de layout 1512px dark/light.

---

### HeroBanner (Home) ✅ COMPLETO
```
Container (GROUP Hero):
  width: 1144px | height: 424px
  fill: #323232 | border-radius: 12px

Coluna texto (esquerda) — Frame 8:
  width: 474px | height: 244px
  layout: VERTICAL | gap: 24px

  Bloco título — Frame 6:
    gap: 8px | VERTICAL
    Nome (overline):  24px / 400 / #FFFFFF       ← subtítulo acima do cargo
    Cargo (H1):       40px / 700 / #FFFFFF        ← título principal
    
  Bio (parágrafo):    16px / 400 / #FFFFFF | width=358px

Coluna foto (direita) — Group 23:
  width: 520px | height: 413px
  Foto recortada com máscara circular/retangular
  Decoração: vetores fill=#8EFB9D (72x72px e menores) no canto

⚠️ Correção vs PRD: o título do cargo é 40px/700 (não 32px/700 como estimado anteriormente)
```

---

### HeroBanner (About/Experiências) ✅ COMPLETO
```
Container (GROUP Hero):
  width: 1144px | height: 424px
  fill: #323232 | border-radius: 12px

Coluna texto — Frame 8:
  width: 382px | height: 233px
  layout: VERTICAL | gap: 24px

  Bloco título — Frame 6:
    gap: 8px | VERTICAL
    Cargo (overline): 24px / 400 / #FFFFFF   ← acima do nome
    Nome (H1):        48px / 700 / #FFFFFF   ← MAIOR que Home (48px vs 40px)
    
  Bio:              16px / 400 / #FFFFFF | width=358px

Coluna foto (direita) — Group 23:
  Ilustração de código/dev (não foto real) — width: 520px | height: 413px
  Decoração: fill=#8EFB9D nos cantos

⚠️ Correção importante: nome na About usa 48px/700, não 32px/700 como estimado
```

---

### HeroBanner (Portfólio) ✅ COMPLETO
```
Container: width=1144px | height=424px | fill=#323232 | br=12px

Coluna texto — Frame 8:
  width: 402px | height: 244px | gap: 24px

  Frame 6 (gap: 8px):
    Overline: "Portfólio" — 24px / 400 / #FFFFFF
    Título:   "Conheça alguns dos meus projetos" — 40px / 700 / #FFFFFF
  
  Bio: 16px / 400 / #FFFFFF | width=358px

Coluna direita: ilustração (imagem decorativa, sem foto)
```

---

### ExperienceCard ✅ COMPLETO
```
Seção "Experiências":
  Título: 32px / 700 / #FFFFFF
  Lista (Experience frame): VERTICAL | gap=40px

Card individual (ex: Frame 43): 950x190px | gap=24px | VERTICAL

  Bloco principal (Frame 42): 950x138px | gap=16px | VERTICAL

    Coluna info (Frame 4686): 400x100px | gap=8px | VERTICAL
      Cargo (H2): 24px / 700 / #FFFFFF
      
      Linha empresa (Frame 40): gap=12px | HORIZONTAL
        Empresa: 20px / 700 / #FFFFFF (ex: "GALAXIES")
        Frame 4687: gap=8px (período + duração inline)
      
      Localização (Frame 41): gap=8px | HORIZONTAL
        "São Paulo, Brasil" — 16px / 400 / #A4A4A4
        "•"                 — 16px / 400 / #A4A4A4
        "Full-time"         — 16px / 400 / #A4A4A4
        "•"                 — 16px / 400 / #A4A4A4
        "Remoto"            — 16px / 400 / #A4A4A4

    Linha descrição + "Ver mais" (Frame 4688): 949x22px | gap=8px | HORIZONTAL
      Descrição: 16px / 400 / #FFFFFF | width=883px (truncado)
      "Ver mais": 14px / 400 / #A4A4A4  ← cor muted (não brand-primary como estimado)

  Badges row (Frame 43): 950x28px | gap=12px | HORIZONTAL
    Badge: fill=#494949 | br=15px | padding=4px 12px | height=28px
      Frame 11: gap=8px | ícone 20x20 + texto 14px/400/#FFFFFF
    Badge "+N": fill=#494949 | br=15px | padding=4px 12px
      Texto "+1" etc: 14px / 400 / #FFFFFF

⚠️ Correções vs estimativas anteriores:
  - "Ver mais" usa #A4A4A4 (não #4452FF)
  - Descrição/localização usam #A4A4A4 (não #BABABA)
  - Empresa usa 20px/700 (não 16px/700)
  - Gap entre cards: 40px (não 24px)
```

---

### ProfessionalValueCard ✅ COMPLETO
```
Seção (Frame 4624): 950x268px | gap=24px | VERTICAL
  Título: "Meus valores profissionais" — 32px / 700 / #FFFFFF

Grid (Frame 4623): 948x199px | gap=16px | HORIZONTAL
  Card (ex: Frame 4620): 225x199px | fill=#323232 | stroke=#323232 | br=12px
  padding: 24px (top/bottom) / 16px (left/right) | gap=10px | VERTICAL

  Conteúdo (Frame 4618): 193x151px | gap=16px | VERTICAL
    Ícone: 48x48px (Skills/* — ex: acute, diamond, sdk, 3p)
    Texto: 16px / 400 / #FFFFFF | width=194px

4 colunas | gap=16px | items-stretch
```

---

### CurriculumCTA ✅ COMPLETO
```
Container (Currículo): 951x381px
  fill: #323232 | stroke: #323232 | border-radius: 12px
  padding: 32px (todos os lados)
  gap: 56px | layout: HORIZONTAL

Coluna esquerda (ilustração): 320x317px
  Imagem decorativa (não foto — ilustração de dev)

Coluna direita (Frame 4627): 511x250px | gap=32px | VERTICAL
  Texto: 24px / 400 / #FFFFFF | width=511px | height=170px
    "Acesse meu currículo para descobrir detalhes exclusivos sobre
     meus projetos, conquistas e habilidades técnicas."
  
  Botão: 292x48px | fill=#4452FF | br=12px | padding=12px 24px | gap=8px
    Label: 16px / 700 / #FFFFFF
    Ícone: UI/open_in_new (24x24)

⚠️ Correções vs estimativas anteriores:
  - Texto é 24px/400 (não 20px/700 para título + 16px para subtítulo)
  - Botão width=292px (não 216px)
  - Coluna direita height=250px (não 317px)
```

---

### ProjectCard (row view — Portfólio) ✅ COMPLETO
```
Card (Large Card): 950x339px | fill=#323232 | br=12px
layout: HORIZONTAL | gap=0 | padding=0

Área imagem (esquerda — Frame 4601): 465x339px
  padding: 12px (todos os lados)
  Imagem interna (Rectangle 5): 441x315px | br=8px

Área conteúdo (direita — Frame 14): 485x339px
  padding: 24px (todos os lados) | gap=20px | HORIZONTAL

  Bloco texto (Frame 4602): 363x291px | gap=16px | VERTICAL
    Frame 8: gap=8px (título + overline?)
    Frame 12: gap=12px (badges row) | height=28px
  
  Coluna botões (Frame Buttons/56px): 54x291px | gap=201px | VERTICAL
    Ícone share: UI/share (24x24) — topo
    Botão seta: 54x54px | fill=#4452FF | br=12px | padding=12px 24px

Layout da lista: VERTICAL | gap=24px
```

---

### Modal de Tecnologias — Estado Basic ✅ COMPLETO
```
Container (Frame 4695): 642x132px | gap=24px | VERTICAL

Header (Frame 4691): 642x70px | gap=8px | VERTICAL

  Linha título (Frame 4697): 642x34px | gap=8px | HORIZONTAL
    Título: "Tecnologias utilizadas" — 24px / 700 / #FFFFFF
    Botão X: UI/close (24x24) — alinhado à direita (SPACE_BETWEEN)

  Linha empresa (Frame 40): 320x28px | gap=12px | HORIZONTAL
    Empresa: 20px / 700 / #FFFFFF (ex: "GALAXIES")
    Cargo: 16px / 400 / #FFFFFF (ex: "Desenvolvedor Front End")

Badges row (Frame 4693): 642x38px | gap=12px | HORIZONTAL
  Badge pílula: fill=#494949 | br=44px | padding=8px 12px | height=38px
    Frame 11 (gap=8px): ícone tech 20x20 + texto 16px/400/#FFFFFF
```

---

### Modal de Tecnologias — Estado Detailed ✅ COMPLETO
```
Container (Frame 4695): 642x404px | gap=24px | VERTICAL

Header (Frame 4691): 642x60px | gap=8px | VERTICAL

  Linha título (Frame 4697): 642x28px | gap=8px | HORIZONTAL
    Título: "Tecnologias utilizadas" — 20px / 700 / #FFFFFF  ← menor no detailed
    Botão X: UI/close (24x24)

  Linha empresa (Frame 40): 299x24px | gap=12px | HORIZONTAL
    Empresa: 16px / 700 / #BABABA  ← cor secondary no detailed (não primary)
    Cargo:   16px / 400 / #BABABA

Separador horizontal: stroke=#494949

Lista Accordion (Frame 4702): 642x296px | gap=12px | VERTICAL
  Accordion item expanded: 642x80px | padding=12px 0 | gap=12px | VERTICAL
    Trigger (Frame 4699): 642x24px | HORIZONTAL | SPACE_BETWEEN
      Frame 11: gap=8px → ícone 24x24 + label 16px/700/#FFFFFF
      Chevron: UI/expand_less (24x24) — expand_more quando fechado
    Descrição: 14px / 400 / #BABABA | width=355px
  
  Separador entre items: stroke=#3E3E3E
  
  Accordion item collapsed: 642x48px | padding=12px 0 | gap=12px
    Trigger igual ao expanded mas sem descrição abaixo
    Chevron: UI/expand_more
```

---

### ProjectDetail — Layout da Página ✅ COMPLETO
```
Container (Content): 1272x4033px (dark) | 1272x4678px (light)
Largura útil: 951px (centralizado dentro do Content)

── Seção 1: Navegação + Hero do projeto (Frame 4615) ──
  height: 773px | gap=40px | VERTICAL

  Barra de nav (Frame 4685): 951x48px | gap=16px | HORIZONTAL
    "← Voltar" (Frame 4677): gap=8px
      UI/arrow_back (24x24) + "Voltar" 16px/400/#FFFFFF
    Breadcrumb: 335x48px — componente padrão (dir. alinhado)

  Hero do projeto (Frame 4705): 951x685px | gap=24px | VERTICAL
    Imagem capa (Rectangle 2): 951x485px | br=8px | object-fit: cover
    
    Info abaixo (Frame 4704): 951x176px | gap=24px | VERTICAL
      Título + descrição (Frame 4703): 951x124px | gap=12px
        Título H1: 40px / 700 / #FFFFFF
        Descrição: 20px / 400 / #FFFFFF
      Badges row (Frame 12): 951x28px | gap=12px
        Badge: fill=#494949 | br=15px | padding=4px 12px

── Seção 2: InfoGrid (Frame 4711) ──
  height: 1129px | gap=24px | VERTICAL

  Linha 1 — Resumo + Objetivos (Frame 4706): 951x150px | gap=24px | HORIZONTAL
    Card "Resumo do projeto" (Frame 2):  463x150px | fill=#323232 | br=12px | padding=24px | gap=8px
      Label: 20px / 700 / #8D8D8D
      Texto: 16px / 400 / #FFFFFF | width=415px
    Card "Objetivos" (Frame 4616): 463x150px — mesmo estilo

  Linha 2 — Meta-info (Frame 27): 951x104px | gap=40px | HORIZONTAL
    Função (Frame 23):    label 16px/700/#FFFFFF + valor 16px/400/#FFFFFF
    Habilidades (Frame 24): idem
    Equipe (Frame 25):    idem
    Data (Frame 26):      idem
    (sem bordas — apenas gap=40px entre colunas)

  Imagem full-width (Rectangle 12): 951x404px | br=8px

  ContentBlock full (Frame 29): 951x399px | gap=16px | VERTICAL
    Overline + subtítulo (Frame 28): 145x75px | gap=8px
      Overline: 16px / 700 / #8D8D8D (uppercase)
      Subtítulo H2: 32px / 700 / #FFFFFF
    Corpo: 20px / 400 / #FFFFFF | width=951px

── Seção 3: ContentBlock split (Frame 4707) ──
  951x404px | gap=32px | HORIZONTAL
  Imagem esquerda (Rectangle 13): 549x404px | br=8px (~58% largura)
  Texto direita (Frame 30): 368x371px | gap=16px | VERTICAL
    Overline + subtítulo: igual ao full
    Corpo: 20px / 400 / #FFFFFF | width=368px

── Seção 4: Outros Projetos (Frame 4716) ──
  951x487px | gap=24px | VERTICAL
  Título: "Outros projetos" — 32px / 700 / #FFFFFF
  Grid (Frame 4715): 951x418px | gap=24px | HORIZONTAL
    2 × ProjectCard (grid view): 463x418px
```

---

### Contact Section (Footer) ✅ COMPLETO (dados exatos)
```
Container (Frame 4690): 1272x565px
  fill: #262626 | padding: 40px 161px | gap=10px

Layout interno (Frame 4689): 950x444px | gap=64px | HORIZONTAL

  Coluna formulário (Frame 4607): 560x444px | gap=24px | VERTICAL
    Título: "Entre em contato" — 20px / 700 / #FFFFFF
    Campos (Frame 4606): 560x322px | gap=24px | VERTICAL
      (inputs individuais dentro)
    Botão Enviar: 216x46px | fill=#4452FF | br=12px | padding=12px 24px

  Coluna info (Frame 4609): 326x392px | gap=24px | VERTICAL
    Frame 4613: 326x316px | gap=24px (email, whatsapp, separador)
    Frame 4610: 326x51px | gap=12px (ghost links sociais)

Light mode — Contact Section:
  fill: #FFFFFF (confirmado pelo Rectangle 3 fill=#FFFFFF na seção light)
  Layout e dimensões idênticos ao dark
```

---

## Diferenças Light Mode — Dados Confirmados

### HeroBanner (light)
```
Sem diferença estrutural — cores mudam via CSS variables
fill do container: usar --tw-surface (→ #FFFFFF no light)
Texto: --tw-content-primary (→ #3E3E3E no light)
```

### ExperienceCard (light)
```
Localização / "Ver mais": #A4A4A4 → equivale a --tw-content-disabled no light
Empresa uppercase: --tw-content-primary
Descrição: --tw-content-primary
```

### CurriculumCTA (light)
```
fill: --tw-surface (→ #FFFFFF no light)
stroke: --tw-surface (transparente visualmente)
Texto: --tw-content-primary
Botão: --tw-brand-primary (→ #5865FF no light)
```

### Contact Section (light)
```
fill do container: #FFFFFF (confirmado — não #F5F6FA)
Todos os outros tokens seguem o padrão light
```

---

## Status de cobertura — ATUALIZADO

| Dado | Status |
|---|---|
| Tokens dark mode | ✅ Completo |
| Tokens light mode — componentes UI | ✅ Completo |
| Button estados dark + light | ✅ Completo |
| Ghost Link estados dark + light | ✅ Completo |
| MenuItem estados dark + light | ✅ Completo |
| Input estados dark + light | ✅ Completo |
| Accordion dark + light | ✅ Completo |
| Breadcrumb dark + light | ✅ Completo |
| HeroBanner Home specs exatas | ✅ Completo |
| HeroBanner About specs exatas | ✅ Completo |
| HeroBanner Portfólio specs | ✅ Completo |
| ExperienceCard layout completo | ✅ Completo |
| ProfessionalValueCard specs exatas | ✅ Completo |
| CurriculumCTA specs exatas | ✅ Completo |
| ProjectCard row view specs exatas | ✅ Completo |
| Modal Tecnologias Basic + Detailed | ✅ Completo |
| ProjectDetail layout completo | ✅ Completo |
| Contact Section specs exatas | ✅ Completo |
| StatCards por breakpoint | ✅ Completo |
| ProjectCards por breakpoint | ✅ Completo |
| Responsividade 640px + 375px | ✅ Completo |
| Light mode — superfícies de página | ✅ Completo |
| ExperienceCard light mode cores | ✅ Parcial (via tokens) |
| ProjectDetail light mode | ✅ Parcial (via tokens) |
