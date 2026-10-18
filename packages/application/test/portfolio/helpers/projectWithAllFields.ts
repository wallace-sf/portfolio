import { ProjectStatus } from '@repo/core/portfolio';
import { ProjectBuilder } from '@repo/core/testing';

/**
 * A published project with every field the DTO mappers read set explicitly,
 * so mapping tests can assert each one. Chain overrides (e.g.
 * `.withFeatured(true)`) before `.now()`.
 */
export function projectWithAllFields() {
  return ProjectBuilder.build()
    .withSlug('my-project')
    .withCoverImage({
      url: 'https://example.com/cover.jpg',
      alt: { 'pt-BR': 'Capa do projeto', 'en-US': 'Project cover' },
    })
    .withThumbnailImage({
      url: 'https://example.com/thumbnail.webp',
      alt: { 'pt-BR': 'Thumbnail do projeto', 'en-US': 'Project thumbnail' },
    })
    .withTitle({ 'pt-BR': 'Título do Projeto', 'en-US': 'Project Title' })
    .withCaption({ 'pt-BR': 'Legenda do projeto', 'en-US': 'Project caption' })
    .withContent({
      'en-US': 'Detailed project content here.',
      'pt-BR': 'Conteúdo detalhado do projeto aqui.',
    })
    .withSkills([])
    .withPeriod({ start: '2023-01-01T00:00:00.000Z' })
    .withFeatured(false)
    .withStatus(ProjectStatus.PUBLISHED);
}
