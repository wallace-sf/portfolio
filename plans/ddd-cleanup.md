# DDD Cleanup Plan

## Contexto

Revisão de decisões de modelagem identificadas em conversa, visando maior aderência ao DDD e ao Dependency Rule do projeto.

---

## Classificação de Domínio (decisão)

| Tipo | Entidade | Repositório | Observação |
|---|---|---|---|
| Aggregate Root | `Project` | `IProjectRepository` | Referencia Skills por ID |
| Aggregate Root | `Experience` | `IExperienceRepository` | Referencia Skills por ID |
| Aggregate Root | `Profile` | `IProfileRepository` | Singleton; dono do ciclo de vida das Skills |
| Entity interna | `Skill` | — | Dono: `Profile`; sem repositório próprio |
| Entity interna | `SocialNetwork` | — | Dono: `Profile` |
| Entity interna | `Language` | — | Dono: `Profile` |
| Entity interna | `ProfessionalValue` | — | Dono: `Profile` |
| Value Object | `ProfileStat` | — | Plain class, sem `id` |
| Value Object | `ExperienceSkill` | — | A remover — ver item 1 |

**Princípio:** apenas Aggregate Roots têm repositório. Entidades internas são acessadas exclusivamente através do repositório do seu agregado.

---

## 1. Remover `ExperienceSkill` — referenciar `Skill` por `Id`

**Motivação:** `ExperienceSkill` embute `ISkillProps` completo por valor dentro de `Experience`. Em DDD estrito, agregados distintos se referenciam por `Id`, não por objeto. Além disso, `workDescription` é redundante com a `description` da própria `Experience`.

| Arquivo | Mudança |
|---|---|
| `core/.../experience/model/Experience.ts` | `skills: ExperienceSkill[]` → `skills: Id[]`; `IExperienceProps.skills: string[]` |
| `core/.../experience/model/ExperienceSkill.ts` | Deletar |
| `core/.../experience/index.ts` | Remover export de `ExperienceSkill` |
| `core/test/experience/ExperienceSkill.test.ts` | Deletar |
| `core/test/experience/Experience.test.ts` | Ajustar testes que usam `workDescription` |
| `core/test/helpers/builders/ExperienceBuilder.ts` | `withSkills` aceita `string[]` (IDs) |
| `application/.../dtos/ExperienceDTO.ts` | `skills: ExperienceSkillDTO[]` → `skills: string[]` |
| `application/.../dtos/ExperienceSkillDTO.ts` | Deletar |
| `application/.../dtos/index.ts` | Remover export de `ExperienceSkillDTO` |
| `application/.../use-cases/GetExperiences.ts` | Remover `toSkillDTO`; `skills: experience.skills.map(id => id.value)` |
| `infra/.../experience/ExperienceMapper.ts` | `toDomain` mapeia skill IDs; `toPrisma` sem `workDescription` |
| `infra/.../experience/PrismaExperienceRepository.ts` | `save` usa `{ skillId: id.value }` |
| `infra/prisma/schema.prisma` | Remover coluna `workDescription` do model `ExperienceSkill` |
| Nova migration Prisma | Dropar coluna `workDescription` |

**Consequência no use case:** `ExperienceDTO.skills` passa a ser `string[]` (IDs). Para exibir nome/ícone/tipo de uma skill, o use case resolve via `IProfileRepository` (que carrega Skills junto com o Profile).

---

## 2. Remover `ISkillRepository` e `PrismaSkillRepository`

**Motivação:** `Skill` é uma entidade interna do agregado `Profile` — não um Aggregate Root. Pelo DDD, apenas Aggregate Roots têm repositório próprio. Criar `ISkillRepository` viola essa regra: dá a `Skill` um ciclo de vida independente que ela não possui no domínio. Skills são definidas pelo desenvolvedor (Profile) e acessadas por ID a partir de `Experience` e `Project`.

| Arquivo | Mudança |
|---|---|
| `core/.../skill/repositories/ISkillRepository.ts` | Deletar |
| `core/.../skill/repositories/` (pasta) | Deletar se vazia |
| `core/.../skill/index.ts` | Remover export de `ISkillRepository` |
| `infra/.../skill/PrismaSkillRepository.ts` | Deletar |
| `infra/.../skill/SkillMapper.ts` | Mover lógica para `ProfileMapper` (Skills são carregadas com Profile) |
| `infra/.../container.ts` | Remover binding de `ISkillRepository` / `PrismaSkillRepository` |
| `application/.../use-cases/GetExperiences.ts` | Remover dependência de `ISkillRepository` se existir |
| `application/.../use-cases/GetProjects.ts` | Idem |

**Como Skills são lidas após a remoção:** o `IProfileRepository` carrega Skills junto com o Profile (já fazem parte do mesmo agregado). Use cases que precisam de Skills resolvem via Profile ou recebem os IDs de Skills que estão embarcados em `Experience.skills` e `Project.skills`.

**Impacto no Prisma:** o model `Skill` no schema permanece — o que muda é que não há mais um repositório Prisma dedicado. Skills são persistidas via `ProfileMapper` dentro do `save(profile)`.

---

## 3. Referenciar `Skill` por `Id` em `Project`

**Motivação:** `Project.skills` atualmente embute `ISkillProps[]` por valor, pelo mesmo problema de `ExperienceSkill`. `Project` é um Aggregate Root separado de `Profile`; deve referenciar Skills por ID.

| Arquivo | Mudança |
|---|---|
| `core/.../project/model/Project.ts` | `skills: Skill[]` → `skills: Id[]`; `IProjectProps.skills: string[]` |
| `core/test/project/Project.test.ts` | Ajustar testes para `skills: string[]` |
| `core/test/helpers/builders/ProjectBuilder.ts` | `withSkills` aceita `string[]` (IDs) |
| `application/.../dtos/ProjectDTO.ts` | `skills: SkillDTO[]` → `skills: string[]` |
| `application/.../use-cases/GetProjects.ts` | `skills: project.skills.map(id => id.value)` |
| `infra/.../project/ProjectMapper.ts` | `toDomain` mapeia skill IDs; `toPrisma` usa `{ skillId: id.value }` |
| `infra/.../project/PrismaProjectRepository.ts` | `save` alinhado com nova estrutura |

---

## 4. Converter `SkillType`, `Fluency`, `LocationType`, `EmploymentType` em enums inline

**Motivação:** O próprio `CLAUDE.md` estabelece que enums estáveis com uma única regra de validação não devem ser VOs — devem ser primitivos/enums validados com `Validator.of(...).in([...])` dentro do `create()` da entidade que os usa. Esses quatro "VOs" são exatamente esse caso: cada um é usado por uma única entidade, tem apenas a regra `.in([...])`, e não agrega comportamento adicional. Além disso, como são usados por apenas um bounded context, não pertencem ao Shared Kernel.

| VO a remover | Entidade dona | Mudança na entidade |
|---|---|---|
| `shared/vo/SkillType.ts` | `Skill` | Exportar `SKILL_TYPES` e `SkillTypeValue`; validar com `.in()` em `Skill.create()` |
| `shared/vo/Fluency.ts` | `Language` | Exportar `FLUENCY_LEVELS` e `FluencyValue`; validar com `.in()` em `Language.create()` |
| `shared/vo/LocationType.ts` | `Experience` | Exportar `LOCATION_TYPES` e `LocationTypeValue`; validar com `.in()` em `Experience.create()` |
| `shared/vo/EmploymentType.ts` | `Experience` | Exportar `EMPLOYMENT_TYPES` e `EmploymentTypeValue`; validar com `.in()` em `Experience.create()` |

**Outros arquivos afetados:**
- `shared/vo/index.ts` — remover os quatro exports
- Todos os importadores atuais dos VOs (entidades, mappers, DTOs, testes) passam a importar o tipo/constante da entidade dona
- `ExperienceMapper.ts` — `LOCATION_TYPE_MAP` e `LOCATION_TYPE_REVERSE_MAP` permanecem, apenas mudam o import

---

## 5. Criar interface base `IRepository<T>`

**Motivação:** `IExperienceRepository` e `IProjectRepository` repetem as mesmas quatro assinaturas (`findAll`, `findById`, `save`, `delete`) sem um contrato comum. Uma interface base garante nomenclatura e assinaturas consistentes. `IProfileRepository` fica independente — `Profile` é singleton, sem `findById` nem `delete`, e essa independência comunica sua natureza especial. `ISkillRepository` não entra nessa interface — será removido no item 2.

| Arquivo | Mudança |
|---|---|
| `core/src/shared/base/IRepository.ts` | Criar interface genérica `IRepository<T>` |
| `core/src/shared/base/index.ts` | Exportar `IRepository` |
| `core/.../experience/repositories/IExperienceRepository.ts` | Estender `IRepository<Experience>` |
| `core/.../project/repositories/IProjectRepository.ts` | Estender `IRepository<Project>` (mantém métodos extras) |

**Interface resultante:**
```typescript
// core/src/shared/base/IRepository.ts
export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: Id): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: Id): Promise<void>;
}
```

---

## 6. Criar classe `AggregateRoot` e classificar entidades internas

**Motivação:** `AggregateRoot` comunica intenção: quem lê o código sabe que `Experience extends AggregateRoot` é uma raiz de consistência, não um objeto interno. O custo é mínimo (classe vazia por ora); o ganho semântico é imediato. `Skill` **não** estende `AggregateRoot` — é entidade interna de `Profile`.

| Arquivo | Mudança |
|---|---|
| `core/src/shared/base/AggregateRoot.ts` | Criar `AggregateRoot<T, TProps> extends Entity<T, TProps>` |
| `core/src/shared/base/index.ts` | Exportar `AggregateRoot` |
| `core/.../experience/model/Experience.ts` | Estender `AggregateRoot` em vez de `Entity` |
| `core/.../project/model/Project.ts` | Estender `AggregateRoot` em vez de `Entity` |
| `core/.../profile/model/Profile.ts` | Estender `AggregateRoot` em vez de `Entity` |
| `core/.../skill/model/Skill.ts` | Manter `extends Entity` — entidade interna de `Profile` |

**Entidades internas já classificadas:**

| Entidade | Base | Dono |
|---|---|---|
| `Skill` | `Entity` | `Profile` |
| `SocialNetwork` | `Entity` | `Profile` |
| `Language` | `Entity` | `Profile` |
| `ProfessionalValue` | `Entity` | `Profile` |
| `ProfileStat` | plain class | `Profile` |
