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
    'My first freelance project was supposed to take six months',
    'Meu primeiro freelance era para durar seis meses',
    'Mi primer freelance iba a durar seis meses',
  ),
  description: loc(
    'I accepted a modest fee to gain experience and closed the deal with a very simple proposal. The project took years and taught me what a commercial proposal needs to make clear.',
    'Aceitei um valor modesto para ganhar experiência e fechei o projeto com uma proposta bem simples. Ele levou anos e me ensinou o que uma proposta comercial precisa deixar claro.',
    'Acepté un valor modesto para ganar experiencia y cerré el proyecto con una propuesta muy simple. Llevó años y me enseñó lo que una propuesta comercial necesita dejar claro.',
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
