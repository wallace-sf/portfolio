# Bounded Contexts — Context Map e responsabilidades

Visão dos bounded contexts do portfolio, suas responsabilidades, modelos e integrações.

---

## Context Map (resumo)

| Contexto | Responsabilidade principal | Modelos-chave | Integrações |
|----------|----------------------------|---------------|-------------|
| **Portfolio** | Projetos, experiência, skills, perfil, valores profissionais | Project, Experience, Skill, ProfessionalValue, Language, SocialNetwork | Shared Kernel; futura API REST |
| **Blog** | Posts, tags, publicação, listagem | BlogPost, Tag | Shared Kernel; Supabase; API REST (WIP) |
| **Contact** | Captura e envio de mensagem de contato | DTOs, payload de formulário | Web (form); backend/Newsletter WIP |
| **Shared Kernel** | Id, Text, DateTime, Entity, ValueObject, códigos de erro, enums | Id, Text, DateTime, Name, Url, EmploymentType, LocationType, SkillType, Fluency, ERROR_MESSAGE | Usado por Portfolio e Blog (e Contact se fizer sentido) |

---

## Portfolio

- **Responsabilidade**: Representar projetos (case studies), experiência profissional, skills, valores e perfil (idiomas, redes sociais).
- **Modelos** (em `@repo/core`):
  - `Project` — título, caption, conteúdo, skills
  - `Experience` — empresa, cargo, período, local, tipo de emprego, skills
  - `Skill` — descrição, ícone, tipo (TECHNOLOGY, etc.)
  - `ProfessionalValue`, `Language`, `SocialNetwork`
- **VOs e enums**: `Text`, `DateTime`, `EmploymentType`, `LocationType`, `SkillType`, `Fluency`, `Id`, `Name`, `Url`
- **Integrações**: Consumido pela web (e, no futuro, pela API). Dados hoje em parte estáticos; persisting em Supabase (Infra) é planejado.

---

## Blog

- **Responsabilidade**: Posts de blog, tags, estados de publicação (rascunho/publicado).
- **Modelos (planejados)**:
  - `BlogPost` — título, slug, corpo, data, tags, status
  - `Tag` — nome, slug (como VO ou entidade)
- **Integrações**: Supabase (tabelas `posts`, `tags`); API REST para listar e obter post por slug. Shared Kernel para `Id`, `DateTime`, `Text`, erros.

---

## Contact

- **Responsabilidade**: Receber mensagem do formulário e (no futuro) enviar (e-mail, serviço externo ou Supabase).
- **Modelos**: DTOs/payload (nome, e-mail, assunto, mensagem). Pode usar VOs do Shared Kernel (ex.: `Text`, `Name`) se houver regras de domínio.
- **Integrações**: Web (Formik + Yup); backend/Newsletter WIP.

---

## Shared Kernel

- **O que entra**:
  - `Entity`, `ValueObject`, `IEntityProps`
  - `Id`, `Text`, `DateTime`, `Name`, `Url`
  - `EmploymentType`, `LocationType`, `SkillType`, `Fluency`
  - `ERROR_MESSAGE` (códigos de erro do domínio; pt-BR, en-US; es planejado)
- **O que não entra**: Regras específicas de um único contexto (ex.: “post só pode ser publicado com pelo menos uma tag” fica no contexto Blog).
- **Onde vive**: `@repo/core` (em `shared/` e VOs compartilhados).

---

## Diagrama de relação (ASCII)

```
                    ┌──────────────────┐
                    │  Shared Kernel   │
                    │  Id, Text, VO,   │
                    │  Entity, Errors  │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│   Portfolio    │  │      Blog      │  │    Contact     │
│  Project       │  │   BlogPost     │  │  (DTOs/forms)  │
│  Experience    │  │   Tag          │  │                │
│  Skill, etc.   │  │                │  │                │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    ┌───────▼───────┐
                    │  Web / API    │
                    └───────────────┘
```

---

## Convênios de integração

- **Portfolio ↔ Web**: DTOs ou view models; domínio não expõe entidades “nuas” se houver necessidade de projeção (ex.: listagem resumida).
- **Blog ↔ Supabase**: Repositórios em `packages/infra`; mappers convertem linhas em entidades/VOs do Core.
- **Contact ↔ Backend**: WIP; contrato de API (payload, códigos de erro) a ser alinhado com [docs/ERROR_HANDLING.md](ERROR_HANDLING.md) e [docs/API.md](API.md).
