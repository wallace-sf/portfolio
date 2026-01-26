# Application — Use cases, ports e view models

**Status: WIP** — A pasta `packages/application` **ainda não existe**. Este documento descreve como a camada de aplicação será organizada e como se integra ao Core e à Infra.

---

## Índice

- [Objetivo](#objetivo)
- [Ports](#ports)
- [Use cases](#use-cases)
- [View models](#view-models)
- [Estrutura planejada](#estrutura-planejada)
- [Fluxo de leitura](#fluxo-de-leitura)

---

## Objetivo

- **Orquestrar** o domínio: use cases que chamam repositórios (ports) e devolvem dados prontos para a interface (web/API).
- **Manter o Core puro**: a Application depende do Core e define **interfaces** (ports); a Infra **implementa** esses ports.
- **View models**: DTOs ou projeções que a Web/API consomem, sem expor entidades internas quando não for desejado.

---

## Ports

Interfaces que a Infra implementa:

| Port | Métodos (planejado) | Uso |
|------|---------------------|-----|
| **`IProjectRepository`** | `findAll()`, `findById(id)` | Projects |
| **`IPostRepository`** | `findPublished( opts )`, `findBySlug(slug)` | Blog |
| **`ITagRepository`** | `findAll()` | Tags |
| **`IContactSender`** | `send(payload)` | Formulário de contato (WIP) |

A Application **depende** dessas interfaces (inversão de dependência); quem instancia e injeta as implementações é a borda (Route Handlers, `apps/api` ou container de DI, se houver).

---

## Use cases

| Use case | Port(s) | Entrada | Saída |
|----------|---------|---------|-------|
| **GetProjects** | `IProjectRepository` | — | `Project[]` ou `ProjectViewModel[]` |
| **GetProjectById** | `IProjectRepository` | `id: string` | `Project` ou `ProjectViewModel` \| null |
| **ListPosts** | `IPostRepository` | `{ limit?, offset?, tag? }` | `PostViewModel[]`, `meta` |
| **GetPostBySlug** | `IPostRepository` | `slug: string` | `PostViewModel` \| null |
| **ListTags** | `ITagRepository` | — | `TagViewModel[]` |
| **SendContact** (WIP) | `IContactSender` | `{ name, email, subject, message }` | `{ ok }` ou erro |

Os use cases **não** conhecem Supabase nem detalhes de HTTP; erros do domínio são propagados (ex.: `ValidationError` com código) e mapeados para HTTP na borda.

---

## View models

Estruturas simples para a Web/API, por exemplo:

- **`ProjectViewModel`**: `id`, `title`, `caption`, `content`, `skills` (array de `{ id, description, icon, type }`). Pode ser o próprio `IProjectProps` ou uma projeção.
- **`PostViewModel`**: `id`, `slug`, `title`, `body`, `publishedAt`, `tags`.
- **`TagViewModel`**: `slug`, `name`.

Quando a entidade do Core já for “serializável” e suficiente, o use case pode devolvê-la diretamente; quando precisar de projeção (listagem resumida, campos extra), usa-se um view model explícito.

---

## Estrutura planejada

```
packages/application/
├── src/
│   ├── ports/
│   │   ├── IProjectRepository.ts
│   │   ├── IPostRepository.ts
│   │   ├── ITagRepository.ts
│   │   └── IContactSender.ts
│   ├── use-cases/
│   │   ├── GetProjects.ts
│   │   ├── GetProjectById.ts
│   │   ├── ListPosts.ts
│   │   ├── GetPostBySlug.ts
│   │   ├── ListTags.ts
│   │   └── SendContact.ts  # WIP
│   ├── view-models/
│   │   ├── ProjectViewModel.ts
│   │   ├── PostViewModel.ts
│   │   └── TagViewModel.ts
│   └── index.ts
├── package.json
└── README.md
```

- **Dependências**: apenas `@repo/core` (e tipos de `@repo/utils` se necessário). **Não** depende de `packages/infra` nem de `apps/web`/`apps/api`.

---

## Fluxo de leitura

Exemplo: **listar projetos**.

1. **Web/API** (Route Handler ou controller): chama `GetProjects.execute()`.
2. **GetProjects**: usa `IProjectRepository.findAll()` (implementado na Infra).
3. **Infra**: Supabase → rows → **Mapper** → `Project[]` (ou `IProjectProps`).
4. **GetProjects**: retorna `Project[]` ou `ProjectViewModel[]`.
5. **Web/API**: serializa JSON, aplica status HTTP; em caso de erro do domínio, mapeia código → status e mensagem i18n. Ver [docs/ERROR_HANDLING.md](ERROR_HANDLING.md).

Quando `packages/application` for criado, um `README.md` dentro do pacote poderá resumir estes tópicos e apontar para este documento.
