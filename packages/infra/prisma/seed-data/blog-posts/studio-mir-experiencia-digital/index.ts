import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';
import { FIGURE } from './figures';

import type { BlogPostSeed } from '../types';

export const studioMirExperienciaDigital: BlogPostSeed = {
  id: ID.blogPosts.studioMirExperienciaDigital,
  slug: 'studio-mir-experiencia-digital',
  title: loc(
    "When the work is extraordinary, but the digital experience doesn't keep up",
    'Quando o trabalho é extraordinário, mas a experiência digital não acompanha',
    'Cuando el trabajo es extraordinario, pero la experiencia digital no está a la altura',
  ),
  description: loc(
    'A visit to the website of Studio Mir, the studio behind animations such as Devil May Cry, made me reflect on performance, user experience and how technology shapes the perceived value of a company.',
    'Uma visita ao site do Studio Mir, responsável por animações como Devil May Cry, me fez refletir sobre performance, experiência do usuário e como a tecnologia influencia a percepção de valor de uma empresa.',
    'Una visita al sitio web de Studio Mir, responsable de animaciones como Devil May Cry, me hizo reflexionar sobre rendimiento, experiencia de usuario y cómo la tecnología influye en la percepción de valor de una empresa.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['performance', 'ux', 'case-study'],
  publishedAt: new Date('2026-10-19T00:00:00Z'),
  featured: true,
  coverImage: {
    url: FIGURE.cover,
    alt: loc(
      "Studio Mir's portfolio grid, with thumbnails of productions such as Devil May Cry and X-Men '97",
      "Grade do portfólio do Studio Mir, com miniaturas de produções como Devil May Cry e X-Men '97",
      "Cuadrícula del portafolio de Studio Mir, con miniaturas de producciones como Devil May Cry y X-Men '97",
    ),
  },
  thumbnailImage: {
    url: FIGURE.thumbnail,
    alt: loc(
      "A 7952 × 5304 image shown at 566 × 283, over Studio Mir's blurred portfolio",
      'Uma imagem de 7952 × 5304 exibida em 566 × 283, sobre o portfólio desfocado do Studio Mir',
      'Una imagen de 7952 × 5304 mostrada en 566 × 283, sobre el portafolio desenfocado de Studio Mir',
    ),
  },
};
