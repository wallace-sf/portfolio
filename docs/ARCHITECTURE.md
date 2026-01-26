# Arquitetura — DDD e Clean Architecture

Este documento descreve como **Clean Architecture** e **DDD** são aplicados no portfolio: camadas, dependências, bounded contexts e decisões principais.

---

## Índice

- [Clean Architecture aplicada](#clean-architecture-aplicada)
- [DDD no projeto](#ddd-no-projeto)
- [Read Path do MVP](#read-path-do-mvp)
- [Decisões importantes](#decisões-importantes)

---

## Clean Architecture aplicada

### Regra de dependência

- **Core (domain)** não depende de infra, web ou API.
- **Application** (use cases, ports) depende apenas do Core.
- **Infra** implementa os *ports* definidos na Application.
- **Web** e **API** consomem a Application (ou chamam use cases diretamente).

```
     Web / API
          │
          ▼
   Application (use cases, ports)  ◄─── WIP
          │
          ▼
       Core (domain)
          ▲
          │
      Infra (adapters, repos)  ◄─── WIP
```

### Camadas

| Camada | Pacote / local | Responsabilidade |
|--------|----------------|------------------|
| **Domain** | `@repo/core` | Entidades, VOs, invariantes, agregações, shared kernel. Zero dependência de framework ou persistência. |
| **Application** | `packages/application` ou `docs/APPLICATION.md` (WIP) | Use cases, ports (interfaces de repositório, serviços externos), view models. Orquestra o domínio. |
| **Infra** | `packages/infra` (WIP) | Implementação de repositórios (Supabase), mappers (DB ↔ dominio), clientes externos. |
| **Interface** | `apps/web`, `apps/api` (futuro) | HTTP, rotas, formulários, i18n de UI. Chama Application ou use cases. |

### Core não depende de nada externo

- `@repo/core` importa apenas `@repo/utils` (Validator, ValidationError) e `uuid`.  
- Não há import de Next, Supabase, React ou libs de HTTP.  
- Erros de domínio usam **códigos** (ex.: `ERROR_INVALID_ID`, `ERROR_INVALID_TEXT`); a **tradução** e o mapeamento para HTTP ficam na borda (web/API). Ver [docs/ERROR_HANDLING.md](ERROR_HANDLING.md).

---

## DDD no projeto

### Shared Kernel

Elementos compartilhados entre bounded contexts, em `@repo/core`:

- **Base**: `Entity`, `ValueObject`, `IEntityProps`
- **VOs comuns**: `Id`, `Text`, `DateTime`, `Url`, `Name`  
- **Enums/Tipos**: `EmploymentType`, `LocationType`, `SkillType`, `Fluency`
- **i18n de erros do domínio**: `ERROR_MESSAGE` (pt-BR, en-US) — códigos estáveis, mensagens traduzidas na borda

### Bounded Contexts

| Contexto | Responsabilidade | Modelos principais | Estado |
|----------|------------------|--------------------|--------|
| **Portfolio** | Projetos, experiência, skills, perfil, valores | `Project`, `Experience`, `Skill`, `ProfessionalValue`, `Language`, `SocialNetwork` | Implementado no Core |
| **Blog** | Posts, tags, publicação | `BlogPost`, `Tag` (a definir no Core) | WIP |
| **Contact** | Formulário, envio de mensagem | DTOs / formulário (web) | Parcial (form; backend WIP) |

Detalhes: [docs/BOUNDED_CONTEXTS.md](BOUNDED_CONTEXTS.md).

### Agregados (atuais e planejados)

- **Project** — raiz: `Project`; entidades associadas: `Skill` (como valor ou referência).
- **Experience** — raiz: `Experience`; `Skill` associado.
- **Skill** — pode ser raiz ou parte de Project/Experience.
- **ProfessionalValue**, **Language**, **SocialNetwork** — entidades do contexto Portfolio.
- **BlogPost** (WIP) — raiz; **Tag** como valor ou entidade dentro do agregado.

---

## Read Path do MVP

Fluxo de leitura (ex.: listar projetos) quando Application e Infra estiverem em uso:

```
Web (page/route)
    │
    ▼
Use case (ex.: GetProjects)
    │
    ▼
Port (ex.: IProjectRepository)
    │
    ▼
Infra (ProjectRepositorySupabase)
    │  └─ mapper: row DB → IProjectProps / Project
    ▼
Domain (Project, Skill, …)
    │
    ▼
ViewModel (DTO ou entidade “serializável”)
    │
    ▼
UI (componentes, next-intl para UI)
```

Hoje, parte do conteúdo (ex.: projetos) ainda vem de **dados estáticos** na própria página; o path acima é o alvo para dados em BD (Supabase).

---

## Decisões importantes

### Conteúdo em BD via Supabase no MVP

- **Decisão**: Usar Supabase (e supabase-js) para Blog e, em seguida, para Projects/dados dinâmicos.
- **Motivo**: Acelerar MVP com Auth, Realtime e Postgres sem operar servidor próprio. A Infra abstrai Supabase atrás de ports.

### i18n: UI e domínio

- **UI**: next-intl; mensagens em `apps/web/messages/{pt-BR,en-US,es}.json`.
- **Domínio**: códigos de erro no Core (`ERROR_MESSAGE`); mensagens traduzidas na borda (web/API) com base no locale.  
- **Conteúdo de domínio** (ex.: descrições de projetos em vários idiomas): estratégia **LocalizedText** ou colunas `title_pt`, `title_en` etc. está em definição. Ver [docs/I18N.md](I18N.md).

### Erros: códigos no Core, tradução na borda

- O domínio lança `ValidationError` (ou equivalente) com **código** estável (ex.: `ERROR_INVALID_ID`).
- Core mantém `ERROR_MESSAGE` (ou mapa de códigos → chave i18n) para pt-BR e en-US; **es** a ser incluído.
- Web/API: mapeiam código → HTTP status e → mensagem no locale do request. Ver [docs/ERROR_HANDLING.md](ERROR_HANDLING.md).

### Validação: Zod na borda, invariantes no domínio

- **Borda (forms, API, decoding de rows)**: Zod (ou similar) para input, query, body e para “decodificar” linhas do BD.
- **Domínio**: invariantes garantidos em construtores e métodos (ex.: `Experience`: `start_at <= end_at`); em caso de violação: `throw` com `ValidationError` e código.
- **Migração**: o `Validator` em `@repo/utils` segue em uso no domínio; a borda deve migrar para Zod. Ver [docs/VALIDATION.md](VALIDATION.md).
