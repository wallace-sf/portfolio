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
      'Cover reading "More Than a Proposal: Lessons in software freelancing" beside a commercial proposal listing scope, expectations and delivery, with milestones for planning, development and delivery',
      'Capa com o título em inglês "More Than a Proposal: Lessons in software freelancing" ao lado de uma proposta comercial com escopo, expectativas e entrega, e marcos de planejamento, desenvolvimento e entrega',
      'Portada con el título en inglés "More Than a Proposal: Lessons in software freelancing" junto a una propuesta comercial con alcance, expectativas y entrega, e hitos de planificación, desarrollo y entrega',
    ),
  },
  thumbnailImage: {
    url: FIGURE.thumbnail,
    alt: loc(
      '"More Than a Proposal: Lessons from my first freelance" beside a project proposal with scope, timeline and payment checked',
      'Título em inglês "More Than a Proposal: Lessons from my first freelance" ao lado de uma proposta com escopo, cronograma e pagamento marcados',
      'Título en inglés "More Than a Proposal: Lessons from my first freelance" junto a una propuesta con alcance, cronograma y pago marcados',
    ),
  },
};
