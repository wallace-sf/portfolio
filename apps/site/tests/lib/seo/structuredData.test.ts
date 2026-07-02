import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildPersonJsonLd,
  buildProjectJsonLd,
} from '../../../src/lib/seo/structuredData';
import { SITE_URL } from '../../../src/lib/og';

const PROFILE = {
  name: 'Wallace Ferreira',
  headline: 'Software Engineer',
  photo: { url: '/photo.jpg', alt: 'Wallace' },
};

const PROJECT = {
  title: 'My Project',
  caption: 'A cool project',
  coverImage: { url: '/cover.jpg' },
  slug: 'my-project',
  locale: 'pt-BR' as const,
  homeLabel: 'Início',
  projectsLabel: 'Projetos',
};

describe('buildPersonJsonLd', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_LINKEDIN_URL', 'https://linkedin.com/in/wallace');
    vi.stubEnv('NEXT_PUBLIC_GITHUB_URL', 'https://github.com/wallace');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should include required schema.org fields for Person and WebSite', () => {
    const result = buildPersonJsonLd(PROFILE);
    const [person, website] = result['@graph'];

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@graph']).toHaveLength(2);
    expect(person['@type']).toBe('Person');
    expect(website['@type']).toBe('WebSite');
  });

  it('should map name, headline to jobTitle, and photo to image', () => {
    const [person] = buildPersonJsonLd(PROFILE)['@graph'];

    expect(person.name).toBe('Wallace Ferreira');
    expect(person.jobTitle).toBe('Software Engineer');
    expect(person.image).toBe('/photo.jpg');
    expect(person.url).toBe(SITE_URL);
  });

  it('should include both LinkedIn and GitHub URLs when both env vars are defined', () => {
    const [person] = buildPersonJsonLd(PROFILE)['@graph'];

    expect(person.sameAs).toEqual([
      'https://linkedin.com/in/wallace',
      'https://github.com/wallace',
    ]);
  });

  it('should omit falsy entries from sameAs when env vars are undefined', () => {
    vi.unstubAllEnvs();

    const [person] = buildPersonJsonLd(PROFILE)['@graph'];

    expect(person.sameAs).toEqual([]);
  });
});

describe('buildProjectJsonLd', () => {
  it('should include required schema.org fields for CreativeWork and BreadcrumbList', () => {
    const result = buildProjectJsonLd(PROJECT);
    const [creativeWork, breadcrumbList] = result['@graph'];

    expect(result['@context']).toBe('https://schema.org');
    expect(creativeWork['@type']).toBe('CreativeWork');
    expect(breadcrumbList['@type']).toBe('BreadcrumbList');
  });

  it('should map title to name, caption to description, and coverImage.url to image', () => {
    const [creativeWork] = buildProjectJsonLd(PROJECT)['@graph'];

    expect(creativeWork.name).toBe('My Project');
    expect(creativeWork.description).toBe('A cool project');
    expect(creativeWork.image).toBe('/cover.jpg');
  });

  it('should construct the project URL with locale and slug', () => {
    const [creativeWork] = buildProjectJsonLd(PROJECT)['@graph'];

    expect(creativeWork.url).toBe(`${SITE_URL}/pt-BR/projects/my-project`);
  });

  it('should generate a 3-item breadcrumb list with correct positions and URLs', () => {
    const [, breadcrumbList] = buildProjectJsonLd(PROJECT)['@graph'];
    const [home, projects, project] = breadcrumbList.itemListElement;

    expect(breadcrumbList.itemListElement).toHaveLength(3);
    expect(home).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: `${SITE_URL}/pt-BR`,
    });
    expect(projects).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Projetos',
      item: `${SITE_URL}/pt-BR/projects`,
    });
    expect(project).toEqual({
      '@type': 'ListItem',
      position: 3,
      name: 'My Project',
      item: `${SITE_URL}/pt-BR/projects/my-project`,
    });
  });
});
