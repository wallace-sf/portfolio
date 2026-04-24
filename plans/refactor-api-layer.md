# Refactor: API Layer — apps/web/src/lib/api

> Melhorias identificadas após a entrega do sprint-3 task 17 (PR #472).
> Nenhuma dessas mudanças altera comportamento externo — são puramente internas.

---

## 1. `error-mapper.ts` — substituir `instanceof` chain por registry declarativo

**Problema atual**

```ts
if (error instanceof NotFoundError)    return { status: 404, ... }
if (error instanceof ValidationError)  return { status: 400, ... }
if (error instanceof UnauthorizedError) return { status: 401, ... }
return { status: 500, code: 'INTERNAL_ERROR', ... }
```

Cada novo tipo de erro de domínio exige um novo `if` e importação manual.
A lógica é procedimental onde o dado poderia ser declarativo.

**Proposta**

```ts
type DomainErrorConstructor = new (...args: any[]) => DomainError;

const HTTP_STATUS_REGISTRY: ReadonlyArray<readonly [DomainErrorConstructor, number]> = [
  [NotFoundError, 404],
  [ValidationError, 400],
  [UnauthorizedError, 401],
] as const;

export function mapDomainErrorToHttp(error: DomainError): HttpError {
  for (const [ErrorClass, status] of HTTP_STATUS_REGISTRY) {
    if (error instanceof ErrorClass) {
      return { status, code: error.code, message: error.message };
    }
  }
  return { status: 500, code: 'INTERNAL_ERROR', message: 'Internal server error' };
}
```

**Benefícios**
- Adicionar suporte a `AuthSubjectConflictError` (futuro) = 1 linha no array
- Nenhuma lógica de ramificação a ler ou manter
- A lista de mapeamentos é legível de relance

---

## 2. Route handlers — extrair `handleRequest` para eliminar boilerplate

**Problema atual**

Os 6 handlers repetem ~10 linhas idênticas de try/catch/Either/errorResponse:

```ts
// projects/route.ts
export async function GET(request: NextRequest) {
  try {
    const locale = resolveLocale(request);
    const { projectRepository } = getContainer();
    const useCase = new GetPublishedProjects(projectRepository);
    const result = await useCase.execute({ locale });
    if (result.isLeft()) {
      const { status, code, message } = mapDomainErrorToHttp(result.value);
      return NextResponse.json(errorResponse(code, message, status), { status });
    }
    return NextResponse.json(successResponse(result.value));
  } catch {
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'Internal server error', 500), { status: 500 });
  }
}
```

**Proposta** — novo arquivo `src/lib/api/handler.ts`

```ts
export async function handleRequest<T>(
  factory: () => Promise<Either<DomainError, T>>,
  successStatus = 200,
): Promise<NextResponse> {
  try {
    const result = await factory();
    if (result.isLeft()) {
      const { status, code, message } = mapDomainErrorToHttp(result.value);
      return NextResponse.json(errorResponse(code, message, status), { status });
    }
    return NextResponse.json(successResponse(result.value), { status: successStatus });
  } catch {
    return NextResponse.json(errorResponse('INTERNAL_ERROR', 'Internal server error', 500), { status: 500 });
  }
}
```

Cada handler passa a ser:

```ts
// projects/route.ts — depois
export async function GET(request: NextRequest) {
  return handleRequest(() => {
    const locale = resolveLocale(request);
    const { projectRepository } = getContainer();
    return new GetPublishedProjects(projectRepository).execute({ locale });
  });
}
```

**Benefícios**
- Remove ~60 linhas de boilerplate distribuídas pelos 6 handlers
- O `catch` de exceções inesperadas vive em um único lugar
- Cada handler expressa só o que é específico dele: qual use case, quais args

---

## 3. `contact/route.ts` — substituir early-return por `left(ValidationError)`

**Problema atual**

O handler retorna um `NextResponse` diretamente quando o body é inválido,
quebrando o padrão Either antes mesmo de chegar no use case:

```ts
if (!body || typeof body !== 'object') {
  return NextResponse.json(errorResponse('INVALID_INPUT', 'Invalid JSON body', 400), { status: 400 });
}
```

**Proposta** — após adotar `handleRequest`, o caso inválido vira um `left`:

```ts
export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return left(new ValidationError({ code: 'INVALID_INPUT', message: 'Invalid JSON body' }));
    }
    const { emailService } = getContainer();
    return new SendContactMessage(emailService).execute({ ... });
  }, 201);
}
```

**Benefícios**
- O handler tem um único ponto de saída (`return handleRequest(...)`)
- O caminho de erro JSON inválido passa pelo mesmo `mapDomainErrorToHttp`

---

## 4. (Discussão — não implementar ainda) Onde esse mapeamento deveria viver?

O mapeamento "código de erro de domínio → HTTP status" é conhecimento da
borda REST. Hoje vive em `apps/web`, o que é correto. Mas se surgir `apps/api`,
esse `HTTP_STATUS_REGISTRY` precisaria ser duplicado.

**Opção A** — cada classe de erro expõe `static readonly httpStatus: number`
(em `@repo/core`). Simples, mas introduz conhecimento HTTP no domínio.

**Opção B** — extrair o registry para `@repo/application/shared` como módulo
opcional de mapeamento REST. Reutilizável, sem poluir o domínio puro.

**Decisão atual:** deixar em `apps/web` até existir um segundo app HTTP.
Registrar essa decisão antes de escalar.

---

## Ordem sugerida de commits

1. `refactor(web): extract handleRequest helper in lib/api/handler`
2. `refactor(web): replace instanceof chain with registry in error-mapper`
3. `refactor(web): simplify route handlers using handleRequest`
4. `refactor(web): replace contact early-return with left(ValidationError)`

Todos os testes existentes devem continuar passando sem alteração.
