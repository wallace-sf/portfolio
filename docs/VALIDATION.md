# Validação — Zod na borda, invariantes no domínio e migração do Validator

Onde validar, com o quê e como evoluir o `Validator` atual em `@repo/utils`.

---

## Índice

- [Resumo](#resumo)
- [Zod na borda](#zod-na-borda)
- [Invariantes no domínio](#invariantes-no-domínio)
- [O que validar onde](#o-que-validar-onde)
- [Migração do Validator](#migração-do-validator)

---

## Resumo

- **Borda (API, forms, decoding)**: **Zod** — input HTTP, query, body, decoding de linhas do BD.
- **Domínio**: **invariantes** em construtores e métodos; em falha, `throw new ValidationError(CODE, message)`.
- **Validator** (`@repo/utils`): em uso **no domínio** (Core e utils); a **borda** deve migrar para Zod. O Validator pode permanecer no domínio ou ser gradualmente substituído por checagens explícitas + `ValidationError`.

---

## Zod na borda

- **Onde**: Route Handlers, formulários (substituindo ou complementando Yup), decode de rows do BD na Infra.
- **Uso**:
  - **API**: `bodySchema.parse(req.body)` ou `querySchema.parse(Object.fromEntries(req.nextUrl.searchParams))`; em falha, Zod lança; a borda converte em 400 com `{ "error": { "code": "VALIDATION_ERROR", "message": ... } }` ou em múltiplos `details` (formato a definir).
  - **Forms**: schema Zod em vez de (ou em adição a) Yup; `form.validate()` ou `schema.safeParse(values)`.
  - **Infra**: `rowSchema.parse(dbRow)` antes do mapper; garante que a linha tem a forma esperada antes de montar entidade/VO.
- **Vantagens**: tipos inferidos, composição, mensagens customizáveis e i18n via `zod-i18n-map` ou mensagens no `.refine()`/`.superRefine()`.

### Exemplo (API)

```ts
const bodyContact = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

const parsed = bodyContact.safeParse(await req.json());
if (!parsed.success) {
  return Response.json(
    { error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } },
    { status: 400 }
  );
}
```

---

## Invariantes no domínio

- **Onde**: construtores de entidades e VOs em `@repo/core` (e em métodos que alteram estado).
- **Como**: checagens lógicas; em violação, `throw new ValidationError(ERROR_CODE, message)`.
- **Exemplos**:
  - **`Experience`**: `start_at <= end_at` (quando `end_at` existe) — já implementado com `Validator.combine` e `ValidationError(Experience.ERROR_CODE, error)`.
  - **`Text`**, **`Id`**, **`DateTime`**, etc.: restrições de formato e tamanho nos construtores; usam `Validator` de `@repo/utils` e `ValidationError`.
- O domínio **não** usa Zod; as regras são expressas com o `Validator` atual ou com `if/throw` puro. O que vem “de fora” (HTTP, BD) deve ser **decodificado/validado na borda** (Zod) antes de chegar ao domínio; assim o domínio recebe dados já “limpos” e só garante invariantes internas.

---

## O que validar onde

| Camada | O quê | Ferramenta |
|--------|-------|------------|
| **API (body, query)** | Estrutura, tipos, formatos (email, UUID, datas), tamanhos | Zod |
| **Formulários (web)** | Campos do form antes de submit | Zod (ou Yup durante migração) |
| **Infra (decode de rows)** | Forma da linha do BD antes do mapper | Zod |
| **Domínio (construtor, métodos)** | Invariantes (ex.: `start_at <= end_at`), regras de VO (UUID, min/max) | Validator (atual) ou `if/throw` + `ValidationError` |

---

## Migração do Validator

### Estado atual

- **`Validator`** e **`ValidationError`** em `@repo/utils`.
- **Uso**: `@repo/core` (Id, Text, DateTime, Experience, etc.) e possivelmente em `@repo/utils` (formatters, etc.).
- **Validations** em `@repo/utils`: `isLength`, `isUUID`, `isDateTime`, `isIn`, `isUrl`, etc., usados pelo `Validator`.

### Estratégia

1. **Borda (API, forms, Infra)**  
   - Introduzir **Zod** para:
     - body/query em Route Handlers,
     - schemas de form (substituir Yup aos poucos, se fizer sentido),
     - decode de rows na Infra.
   - **Não** usar o `Validator` em código de borda novo.

2. **Domínio**  
   - **Manter** o `Validator` no Core por enquanto: a migração para “só invariantes + `if/throw`” ou para outro padrão é mais invasiva e pode ser feita depois.
   - Ou: em VOs/entidades novos, preferir checagens explícitas e `throw new ValidationError(CODE, message)` sem o `Validator`, se isso simplificar.
   - O `Validator` tem **Mustache** para mensagens (ex.: `'O texto deve ter entre {{min}} e {{max}} caracteres.'`); isso é compatível com a ideia de códigos estáveis: o `message` no `ValidationError` pode ser a string interpolada “interna”; a borda pode, se quiser, ignorar e usar apenas o `code` + dicionário i18n.

3. **Utils**  
   - As funções puras (`isLength`, `isUUID`, etc.) podem continuar; Zod não as substitui necessariamente. O `Validator` em si pode ficar apenas como dependência do Core, ou ser marcado como “legacy” e deixar de ser usado em código novo na borda.

4. **Ordem sugerida**  
   - (1) Zod na API (body/query).  
   - (2) Zod no decode de rows na Infra (quando existir).  
   - (3) Avaliar Zod nos forms (Contact, etc.) e migrar Yup → Zod se for o caso.  
   - (4) Opcional: simplificar domínio removendo `Validator` e usando apenas `if/throw` + `ValidationError` em novos VOs; migrar os antigos gradualmente.

### O que não fazer

- **Não** colocar Zod como dependência do `@repo/core`; o Core permanece sem libs de schema.
- **Não** quebrar assinaturas ou `ERROR_CODE` em uso; a migração deve ser interna ou aditiva.
