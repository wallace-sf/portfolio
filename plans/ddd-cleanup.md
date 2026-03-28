# DDD Cleanup Plan

## Contexto

Revisão de decisões de modelagem identificadas em conversa, visando maior aderência ao DDD e ao Dependency Rule do projeto.

---

## 1. Remover `ExperienceSkill` — referenciar `Skill` por `Id`

**Motivação:** `ExperienceSkill` foi criado para carregar `workDescription` por skill dentro de uma experiência. Decidimos que `description` na própria `Experience` é suficiente, tornando o VO supérfluo. Em DDD estrito, aggregates distintos se referenciam por `Id`, não por objeto completo.

**Arquivos a modificar:**

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

**Consequência no use case:** `ExperienceDTO.skills` passa a ser `string[]` (IDs). Para exibir nome/ícone/tipo das skills de uma experiência, a camada de apresentação ou o use case deverá consultar o `ISkillRepository` separadamente.

---

## 2. Converter `SkillType`, `Fluency`, `LocationType`, `EmploymentType` em enums inline

**Motivação:** O próprio `CLAUDE.md` estabelece que enums estáveis com uma única regra de validação não devem ser VOs — devem ser primitivos/enums validados com `Validator.of(...).in([...])` dentro do `create()` da entidade que os usa. Esses quatro "VOs" são exatamente esse caso: cada um é usado por uma única entidade, tem apenas a regra `.in([...])`, e não agrega comportamento adicional.

Além disso, como são usados por apenas um bounded context, não pertencem ao Shared Kernel.

**Mudanças por entidade:**

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

## 3. Criar interface base `IRepository<T>`

**Motivação:** Os repositórios `IExperienceRepository`, `ISkillRepository` e `IProjectRepository` repetem as mesmas quatro assinaturas (`findAll`, `findById`, `save`, `delete`) sem um contrato comum declarado. Uma interface base garante nomenclatura e assinaturas consistentes e torna explícito que esses três seguem o mesmo padrão. `IProfileRepository` fica independente — `Profile` é singleton, sem `findById` nem `delete`, e essa independência comunica sua natureza especial.

**Arquivos a criar/modificar:**

| Arquivo | Mudança |
|---|---|
| `core/src/shared/base/IRepository.ts` | Criar interface genérica `IRepository<T>` |
| `core/src/shared/base/index.ts` | Exportar `IRepository` |
| `core/.../experience/repositories/IExperienceRepository.ts` | Estender `IRepository<Experience>` |
| `core/.../skill/repositories/ISkillRepository.ts` | Estender `IRepository<Skill>` |
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

## 4. Criar classe `AggregateRoot` e classificar entidades internas

**Motivação:** Já existem 4 aggregate roots (`Project`, `Experience`, `Skill`, `Profile`) e o bounded context `blog` (previsto no roadmap) introduzirá pelo menos mais um (`BlogPost`). O benefício de `AggregateRoot` não depende de domain events — ele comunica intenção: quem lê o código sabe que `Experience extends AggregateRoot` é uma raiz, não um objeto interno. O custo é mínimo (classe vazia por ora); o ganho semântico é imediato.

**Arquivos a criar/modificar:**

| Arquivo | Mudança |
|---|---|
| `core/src/shared/base/AggregateRoot.ts` | Criar `AggregateRoot<T, TProps> extends Entity<T, TProps>` (vazia por ora) |
| `core/src/shared/base/index.ts` | Exportar `AggregateRoot` |
| `core/.../experience/model/Experience.ts` | Estender `AggregateRoot` em vez de `Entity` |
| `core/.../skill/model/Skill.ts` | Estender `AggregateRoot` em vez de `Entity` |
| `core/.../project/model/Project.ts` | Estender `AggregateRoot` em vez de `Entity` |
| `core/.../profile/model/Profile.ts` | Estender `AggregateRoot` em vez de `Entity` |

**Pendência — classificar `Language`, `ProfessionalValue`, `SocialNetwork`:**

Essas três entidades existem no domínio mas não têm repositório. Precisam ser avaliadas:
- Se têm identidade própria e ciclo de vida independente → são aggregate roots (ganham repositório e estendem `AggregateRoot`)
- Se só fazem sentido dentro de `Profile` → são objetos internos (estendem `Entity` ou são VOs dentro do aggregate de `Profile`)

`ProfileStat` já está implicitamente como objeto interno de `Profile`, mas não estende `Entity` nem `ValueObject` — é uma classe simples. Avaliar se deve adotar uma das bases ou permanecer assim.
