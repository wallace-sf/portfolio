# @repo/core — Domínio e Shared Kernel

Pacote de **domínio** do portfolio: entidades, value objects, shared kernel e padrões de erro. **Não depende** de infra, web ou API.

---

## Índice

- [Conteúdo](#conteúdo)
- [Shared Kernel](#shared-kernel)
- [Entidades e agregados](#entidades-e-agregados)
- [Value Objects](#value-objects)
- [Padrões de erro](#padrões-de-erro)
- [Uso](#uso)
- [Scripts](#scripts)

---

## Conteúdo

```
packages/core/src/
├── experience/       # Experience (entidade)
├── language/         # Language
├── professional-value/
├── project/          # Project (entidade)
├── shared/
│   ├── base/         # Entity, ValueObject
│   ├── i18n/         # ERROR_MESSAGE (códigos)
│   └── vo/           # Id, Text, DateTime, Name, Url, enums
├── skill/            # Skill, SkillFactory
├── social-network/
└── index.ts
```

---

## Shared Kernel

Elementos compartilhados entre bounded contexts (Portfolio, Blog, etc.):

- **`Entity`**, **`ValueObject`**, **`IEntityProps`** — base para entidades e VOs
- **`Id`** — UUID (uuid v4)
- **`Text`** — string com min/max (ex.: 3–50, 3–200)
- **`DateTime`** — data/hora (ISO)
- **`Name`**, **`Url`**
- **Enums / VOs**: `EmploymentType`, `LocationType`, `SkillType`, `Fluency`
- **`ERROR_MESSAGE`** — mapa de códigos → `{ code, message }` em pt-BR e en-US (i18n de mensagens na borda)

---

## Entidades e agregados

| Classe | Contexto | Descrição |
|--------|----------|-----------|
| **Project** | Portfolio | title, caption, content, skills (Skill[]) |
| **Experience** | Portfolio | company, position, start_at, end_at, location, location_type, employment_type, skills |
| **Skill** | Portfolio | description, icon, type |
| **ProfessionalValue** | Portfolio | valor profissional |
| **Language** | Portfolio | idioma e fluência |
| **SocialNetwork** | Portfolio | rede e URL |

Regras de invariante (ex.: `start_at <= end_at` em `Experience`) são validadas no construtor; em falha, `throw new ValidationError(ERROR_CODE, message)`.

---

## Value Objects

- **`Id`** — UUID; usa `Validator.uuid` de `@repo/utils`
- **`Text`** — `Text.new(value, { min, max })`; validação via `Validator.length`
- **`DateTime`** — `DateTime.new(isoString)`; `Validator.datetime`
- **`Name`** — nome 3–100
- **`Url`** — `Validator.url`
- **`EmploymentType`**, **`LocationType`**, **`SkillType`**, **`Fluency`** — enums com `.new(value)` e validação `isIn`

---

## Padrões de erro

- **Códigos estáveis**: cada VO/entidade define `static readonly ERROR_CODE` (ex.: `Id.ERROR_CODE = 'ERROR_INVALID_ID'`).
- **`ValidationError`** (de `@repo/utils`): `throw new ValidationError(ERROR_CODE, message)`.
- **Mensagens**: o Core usa `ERROR_MESSAGE` (pt-BR, en-US) como referência; a **tradução e o mapeamento para HTTP** ficam na borda (web/API). Ver [docs/ERROR_HANDLING.md](../../docs/ERROR_HANDLING.md).

---

## Uso

```ts
import {
  Project,
  Skill,
  SkillFactory,
  Id,
  Text,
  ERROR_MESSAGE,
} from '@repo/core';
```

- **Dependências**: `@repo/utils` (Validator, ValidationError), `uuid`.
- **Consumido por**: `apps/web` (hoje, dados estáticos ou instanciação local); no futuro, Application e Infra.

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm test` | Jest |
| `pnpm lint` | ESLint --fix |
| `pnpm lint:check` | ESLint sem --fix |
| `pnpm format` | Prettier |
| `pnpm format:check` | Prettier check |
| `pnpm types` | `tsc --noEmit --skipLibCheck` |

Na raiz: `pnpm lint:core`, `pnpm test:core`, etc.
