export const content = `Este monorepo sigue una regla por encima de todas: las dependencias apuntan hacia dentro.

\`\`\`text
core ← application ← infra ← site / admin
\`\`\`

El dominio no sabe nada de los use cases, los use cases no saben nada de Prisma, y solo las apps
saben de Next.js. Una regla así no se sostiene porque esté en un diagrama. Se sostiene donde una
herramienta se niega a dejar que se rompa. Aquí está dónde lo hace cada herramienta, y dónde
ninguna lo hace todavía.

## Barrera 1: el package.json es el grafo de dependencias

Cada capa es su propio paquete, y un paquete solo puede importar lo que declara:

\`\`\`jsonc
// packages/core/package.json
"dependencies": { "@repo/utils": "workspace:*", "uuid": "^10.0.0" }

// packages/application/package.json
"dependencies": { "@repo/core": "workspace:*", "@repo/utils": "workspace:*" }
\`\`\`

Añadir \`next\` o \`@prisma/client\` a \`core\` no es un import silencioso. Es un cambio visible en un
manifiesto, y aparece en la revisión exactamente como lo que es.

## Barrera 2: el lint prohíbe frameworks en la capa de aplicación

\`application\` tiene su propia config de ESLint, con una entrada \`no-restricted-imports\` por
framework:

\`\`\`js
{
  group: ['@prisma/*', 'prisma'],
  message:
    'Application layer cannot import Prisma — violates Clean Architecture dependency rule.',
},
\`\`\`

React, Next.js, los clientes HTTP y el SDK de email reciben el mismo trato. El mensaje nombra la
regla, así que quien se la encuentra aprende el porqué, no solo el qué.

## Barrera 3: solo exports públicos, y los helpers de test se quedan en los tests

Todos los paquetes comparten dos patrones más. \`SRC_PATHS\` prohíbe entrar en el \`/src\` de otro
paquete, así que los paquetes se comunican por sus exports. \`TEST_HELPERS\` mantiene
\`@repo/core/testing\`, los builders de datos de test, fuera del código de producción. Los archivos de
test reciben la misma regla sin esa prohibición.

## Barrera 4: dentro de la app, las features no alcanzan las rutas

\`apps/site\` aplica la misma idea un nivel más abajo: el código en \`src/features/\` no puede importar
de \`src/app/\`. Los archivos de ruta componen features; una feature nunca depende de una ruta.

## Dónde terminan las barreras

Dos partes de la regla siguen siendo convenciones, verificadas en la revisión:

- **\`core\` no tiene prohibición de frameworks en el lint.** Solo su \`package.json\` mantiene fuera a
  React o Prisma.
- **Los componentes \`'use client'\` no deben importar \`@repo/application\`.** Hoy nada falla si uno
  lo hace. Un import de \`server-only\` en el container del servidor lo convertiría en un error de
  build.

Dejar por escrito las brechas es parte de la regla. Una barrera que crees que existe es peor que
una que sabes que falta.
`;
