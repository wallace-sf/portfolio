import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';
import { FIGURE } from './figures';

import type { BlogPostSeed } from '../types';

export const firstFreelanceLessons: BlogPostSeed = {
  id: ID.blogPosts.firstFreelanceLessons,
  slug: 'first-freelance-lessons',
  title: loc(
    'My first freelance project as a developer: expectations, mistakes and lessons',
    'Meu primeiro freelance como desenvolvedor: expectativas, erros e lições',
    'Mi primer freelance como desarrollador: expectativas, errores y lecciones',
  ),
  description: loc(
    'What my first freelance project taught me about commercial proposals, scope, schedules and the limits of the concessions we make to gain experience.',
    'O que meu primeiro freelance me ensinou sobre propostas comerciais, escopo, cronogramas e os limites das concessões que fazemos para ganhar experiência.',
    'Lo que mi primer freelance me enseñó sobre propuestas comerciales, alcance, cronogramas y los límites de las concesiones que hacemos para ganar experiencia.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['career', 'freelance', 'lessons-learned'],
  // Provisional: the text is still a draft; the final date is set on publish.
  publishedAt: new Date('2026-11-05T00:00:00Z'),
  featured: true,
  coverImage: {
    url: FIGURE.cover,
    alt: loc(
      'Illustration of a commercial proposal with a checklist and a payment bar split into 40%, 30% and 30% milestones',
      'Ilustração de uma proposta comercial com uma lista de verificação e uma barra de pagamento dividida em marcos de 40%, 30% e 30%',
      'Ilustración de una propuesta comercial con una lista de verificación y una barra de pago dividida en hitos del 40 %, 30 % y 30 %',
    ),
  },
  thumbnailImage: {
    url: FIGURE.thumbnail,
    alt: loc(
      'Commercial proposal with a checklist and 40/30/30 payment milestones',
      'Proposta comercial com lista de verificação e marcos de pagamento 40/30/30',
      'Propuesta comercial con lista de verificación e hitos de pago 40/30/30',
    ),
  },
};
