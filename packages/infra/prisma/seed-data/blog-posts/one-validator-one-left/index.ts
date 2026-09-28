import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const oneValidatorOneLeft: BlogPostSeed = {
  id: ID.blogPosts.oneValidatorOneLeft,
  slug: 'one-validator-one-left',
  title: loc(
    'One Validator, One Left',
    'Um Validator, um Left',
    'Un Validator, un Left',
  ),
  description: loc(
    'How chaining domain rules through a single Validator — and returning exactly one Left per validation flow — keeps entity factories readable and error handling predictable.',
    'Como encadear regras de domínio por um único Validator — e retornar exatamente um Left por fluxo de validação — mantém as factories de entidade legíveis e o tratamento de erro previsível.',
    'Cómo encadenar reglas de dominio a través de un único Validator — y devolver exactamente un Left por flujo de validación — mantiene las factories de entidad legibles y el manejo de errores predecible.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['ddd', 'validation', 'clean-architecture'],
  publishedAt: new Date('2026-08-15T00:00:00Z'),
  featured: false,
};
