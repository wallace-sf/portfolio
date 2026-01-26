# Tratamento de erros — Códigos no Core, mapeamento na borda e i18n

Estratégia de erros: **códigos estáveis no domínio**, mapeamento para **HTTP** e **mensagens traduzidas** na borda (web/API).

---

## Índice

- [DomainError / ValidationError e códigos no Core](#domainerror--validationerror-e-códigos-no-core)
- [Mapeamento para HTTP e envelope](#mapeamento-para-http-e-envelope)
- [Tradução de mensagens](#tradução-de-mensagens)
- [Exemplos](#exemplos)

---

## DomainError / ValidationError e códigos no Core

- **`ValidationError`** (de `@repo/utils`): `new ValidationError(code: string, message?: string)`; `name` recebe o `code`.
- **Uso no Core**: ao falhar invariante ou validação de VO/entidade, `throw new ValidationError(ERROR_CODE, message)`.
  - Ex.: `Id.ERROR_CODE = 'ERROR_INVALID_ID'`, `Text.ERROR_CODE = 'ERROR_INVALID_TEXT'`, `Experience.ERROR_CODE = 'ERROR_INVALID_EXPERIENCE'`.
- **`ERROR_MESSAGE`** (`@repo/core`): mapa `{ 'pt-BR': { [code]: { code, message } }, 'en-US': { ... } }` para códigos como `INVALID_DATE_TIME`, `INVALID_ID`, `INVALID_NAME`. Outros códigos (ex.: `ERROR_INVALID_TEXT`) podem ter mensagem em `message` no `ValidationError` ou em dicionários adicionais na borda.
- O Core **não** escolhe locale; apenas lança com **código** (e opcionalmente `message` em uma língua “interna” para log).

---

## Mapeamento para HTTP e envelope

Na **borda** (Route Handlers, controllers, catch em apps/web ou apps/api):

1. **Capturar** `ValidationError` e outros erros de domínio ou de aplicação.
2. **Mapear código → HTTP status**:
   - `ERROR_INVALID_*`, `ERROR_INVALID_ID`, `ERROR_INVALID_TEXT`, `ERROR_INVALID_EXPERIENCE`, etc. → **400**
   - `NOT_FOUND` (recurso inexistente) → **404**
   - Erro não mapeado / falha de infra → **500**
3. **Envelope de erro** (ex.: `{ "error": { "code": "string", "message": "string" } }`).
4. **`message`**: obter via i18n a partir do **código** e do **locale** do request (header `Accept-Language` ou `?locale=`). Se o código não existir no dicionário, usar `message` do `ValidationError` ou um texto genérico.

---

## Tradução de mensagens

- **Fonte**: `ERROR_MESSAGE` em `@repo/core` (pt-BR, en-US) e, na borda, extensões para códigos que só existem na aplicação (ex.: `NOT_FOUND`).
- **Idioma**: do request (`Accept-Language`, `?locale=pt-BR`, ou cookie/sessão, conforme a app).
- **Fallback**: se não houver entrada para o locale, usar `en-US` ou `pt-BR`; se ainda faltar, usar `error.message` ou `"Erro inesperado"` / `"Unexpected error"`.

---

## Exemplos

### Payload de erro (API)

**400 — validação**

```json
{
  "error": {
    "code": "ERROR_INVALID_ID",
    "message": "O id deve ser um UUID."
  }
}
```

**404**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado."
  }
}
```

**500**

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Erro interno. Tente novamente mais tarde."
  }
}
```

### Exibição no front (toast / error page)

- **Formulário (ex.: Contact)**: ao receber `400` com `error.code` e `error.message`, exibir `error.message` no toast ou ao lado do campo (o `message` já vem traduzido pela API conforme o locale).
- **Páginas (ex.: projeto inexistente)**: ao receber `404`, exibir página de “Não encontrado” com `error.message` ou chave do next-intl, ex.: `t('Errors.notFound')`.
- **Erro genérico**: para `500` ou erros de rede, mensagem genérica traduzida via next-intl.

### Trecho de mapeamento (pseudocódigo na borda)

```ts
// Ex.: em um Route Handler ou wrapper
try {
  const result = await getProjectById(id);
  return Response.json({ data: result });
} catch (e) {
  if (e instanceof ValidationError) {
    const status = 400;
    const message = translateError(e.name, locale) ?? e.message;
    return Response.json({ error: { code: e.name, message } }, { status });
  }
  if (e.code === 'NOT_FOUND') {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: t('Errors.notFound') } },
      { status: 404 }
    );
  }
  return Response.json(
    { error: { code: 'INTERNAL_ERROR', message: t('Errors.internal') } },
    { status: 500 }
  );
}
```

`translateError(code, locale)` pode ler `ERROR_MESSAGE[locale][code]?.message` e ter entradas adicionais para `NOT_FOUND`, `INTERNAL_ERROR`, etc.
