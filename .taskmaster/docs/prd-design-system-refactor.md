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
