export const content = `Este monorepo segue uma regra acima de todas: as dependências apontam para dentro.

\`\`\`text
core ← application ← infra ← site / admin
\`\`\`

O domínio não sabe nada dos use cases, os use cases não sabem nada do Prisma, e só os apps sabem do
Next.js. Uma regra assim não se sustenta porque está num diagrama. Ela se sustenta onde uma
ferramenta se recusa a deixá-la quebrar. Eis onde cada ferramenta faz isso, e onde nenhuma faz
ainda.

## Barreira 1: o package.json é o grafo de dependências

Cada camada é um pacote próprio, e um pacote só pode importar o que declara:

\`\`\`jsonc
// packages/core/package.json
"dependencies": { "@repo/utils": "workspace:*", "uuid": "^10.0.0" }

// packages/application/package.json
"dependencies": { "@repo/core": "workspace:*", "@repo/utils": "workspace:*" }
\`\`\`

Adicionar \`next\` ou \`@prisma/client\` ao \`core\` não é um import silencioso. É uma mudança visível
num manifesto, e aparece no review exatamente como o que é.

## Barreira 2: o lint proíbe frameworks na camada de aplicação

O \`application\` tem a sua própria config de ESLint, com uma entrada \`no-restricted-imports\` por
framework:

\`\`\`js
{
  group: ['@prisma/*', 'prisma'],
  message:
    'Application layer cannot import Prisma — violates Clean Architecture dependency rule.',
},
\`\`\`

React, Next.js, clientes HTTP e o SDK de e-mail recebem o mesmo tratamento. A mensagem cita a
regra, então quem a encontra aprende o porquê, não só o quê.

## Barreira 3: só exports públicos, e helpers de teste ficam nos testes

Todo pacote compartilha mais dois padrões. O \`SRC_PATHS\` proíbe entrar no \`/src\` de outro pacote,
então os pacotes conversam pelos seus exports. O \`TEST_HELPERS\` mantém o \`@repo/core/testing\`, os
builders de dados de teste, fora do código de produção. Os arquivos de teste recebem a mesma regra
sem essa proibição.

## Barreira 4: dentro do app, features não alcançam as rotas

O \`apps/site\` tem a mesma ideia um nível abaixo: código em \`src/features/\` não pode importar de
\`src/app/\`. Os arquivos de rota compõem features; uma feature nunca depende de uma rota.

## Onde as barreiras param

Duas partes da regra ainda são convenções, verificadas no review:

- **O \`core\` não tem proibição de frameworks no lint.** Só o \`package.json\` dele mantém React ou
  Prisma de fora.
- **Componentes \`'use client'\` não devem importar \`@repo/application\`.** Hoje nada falha se um
  importar. Um import de \`server-only\` no container do servidor transformaria isso em erro de
  build.

Registrar as lacunas faz parte da regra. Uma barreira que você acha que existe é pior do que uma
que você sabe que falta.
`;
