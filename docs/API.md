# API REST — Planejada e atual

O projeto **não possui** `apps/api` nem servidor REST dedicado. Este documento descreve a **API planejada** para Projects e Blog e como ela se encaixa na arquitetura.

---

## Índice

- [Visão geral](#visão-geral)
- [Endpoints planejados](#endpoints-planejados)
- [Formato de respostas](#formato-de-respostas)
- [Erros](#erros)
- [Autenticação e CORS](#autenticação-e-cors)
- [Implementação futura](#implementação-futura)

---

## Visão geral

- **Objetivo**: Expor Projects e Blog (posts, tags) via REST para o front-end e possíveis integrações.
- **Fonte de dados (planejado)**: Supabase (Postgres) via `packages/infra`; repositórios atrás de ports da Application.
- **Stack sugerida**: Next.js Route Handlers (`app/api/...`) ou app dedicado (Node/Express/Fastify) no monorepo. A decisão será feita na implementação.

---

## Endpoints planejados

### Projects

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/api/projects` | Lista projetos (query: `?locale=pt-BR` para conteúdo localizado, se suportado) |
| `GET` | `/api/projects/:id` | Projeto por ID (UUID) |

### Blog

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/api/posts` | Lista posts (query: `?status=published`, `?tag=slug`, `?limit`, `?offset`) |
| `GET` | `/api/posts/:slug` | Post por slug (apenas publicados) |
| `GET` | `/api/tags` | Lista de tags |

### Contact (WIP)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `POST` | `/api/contact` | Envio do formulário de contato (payload: nome, email, assunto, mensagem) |

---

## Formato de respostas

### Sucesso (200)

- **Lista**: `{ "data": [...], "meta": { "total": number } }` (opcional)
- **Item único**: `{ "data": { ... } }`

### Exemplo — `GET /api/projects`

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "caption": "string",
      "content": "string",
      "skills": [
        { "id": "uuid", "description": "string", "icon": "string", "type": "TECHNOLOGY" }
      ]
    }
  ]
}
```

### Exemplo — `GET /api/posts/:slug`

```json
{
  "data": {
    "id": "uuid",
    "slug": "string",
    "title": "string",
    "body": "string",
    "publishedAt": "ISO8601",
    "tags": [{ "slug": "string", "name": "string" }]
  }
}
```

---

## Erros

- **Envelope**: `{ "error": { "code": "string", "message": "string" } }`
- **Códigos**: estáveis (ex.: `ERROR_INVALID_ID`, `NOT_FOUND`); `message` traduzida conforme `Accept-Language` ou `?locale`.
- **HTTP**: 400 (validação), 404 (recurso inexistente), 500 (erro interno).

Ver [docs/ERROR_HANDLING.md](ERROR_HANDLING.md) para códigos do Core e mapeamento na borda.

---

## Autenticação e CORS

- **Projects e Blog (leitura)**: Público; Supabase com RLS ou leitura anônima conforme política do projeto.
- **Contact (POST)**: Avaliar rate limit e, se necessário, token/CAPTCHA; definição na implementação.
- **CORS**: Permitir origem do front (ex.: mesmo domínio ou URLs de produção/staging).

---

## Implementação futura

1. **`packages/infra`**: Repositórios Supabase e mappers para Project, BlogPost, Tag.
2. **`packages/application`** (ou equivalente): Use cases `GetProjects`, `GetProjectById`, `ListPosts`, `GetPostBySlug`, `ListTags`; port `IContactSender` para Contact.
3. **Rotas**: Em `apps/web/app/api/...` (Route Handlers) ou em `apps/api` (futuro) que chame a Application.
4. **Envio de Contact**: Integração com Supabase (tabela `contacts`), Resend, ou outro; atrás de `IContactSender`.

Quando `apps/api` for criado, este doc será migrado ou referenciado em `apps/api/README.md`.
