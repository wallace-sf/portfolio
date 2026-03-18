import { describe, expect, it, vi } from 'vitest';

import {
  IProfileProps,
  IProfileRepository,
  IProfileStatProps,
  Profile,
} from '@repo/core/portfolio';
import { DomainError, NotFoundError } from '@repo/core/shared';

import { ProfileDTO } from '~/portfolio/dtos/ProfileDTO';
import { GetProfile } from '~/portfolio/use-cases/GetProfile';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_STAT: IProfileStatProps = {
  label: { 'pt-BR': 'Anos de experiência', 'en-US': 'Years of experience' },
  value: '5+',
  icon: 'calendar',
};

const BASE_PROPS: IProfileProps = {
  name: 'Wallace Ferreira',
  headline: { 'pt-BR': 'Engenheiro de Software', 'en-US': 'Software Engineer' },
  bio: { 'pt-BR': 'Desenvolvedor apaixonado por código.', 'en-US': 'Developer passionate about code.' },
  photo: {
    url: 'https://example.com/photo.jpg',
    alt: { 'pt-BR': 'Foto do perfil', 'en-US': 'Profile photo' },
  },
  stats: [BASE_STAT],
  featuredProjectSlugs: ['my-project', 'another-project'],
};

function makeProfile(overrides: Partial<IProfileProps> = {}): Profile {
  const result = Profile.create({ ...BASE_PROPS, ...overrides });
  if (result.isLeft()) throw new Error(`makeProfile failed: ${result.value.message}`);
  return result.value;
}

function makeRepository(overrides: Partial<IProfileRepository> = {}): IProfileRepository {
  return {
    find: vi.fn(),
    save: vi.fn(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GetProfile', () => {
  describe('execute()', () => {
    it('should return Right with ProfileDTO when profile exists', async () => {
      const profile = makeProfile();
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeDefined();
    });

    it('should return Left with NotFoundError when repository returns null', async () => {
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(null) });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        find: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should map all top-level DTO fields correctly for pt-BR locale', async () => {
      const profile = makeProfile();
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = result.value as ProfileDTO;

      expect(dto.id).toBe(profile.id.value);
      expect(dto.name).toBe('Wallace Ferreira');
      expect(dto.headline).toBe('Engenheiro de Software');
      expect(dto.bio).toBe('Desenvolvedor apaixonado por código.');
      expect(dto.photo).toEqual({ url: 'https://example.com/photo.jpg', alt: 'Foto do perfil' });
    });

    it('should map localized fields using the requested locale', async () => {
      const profile = makeProfile();
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const ptResult = await useCase.execute({ locale: 'pt-BR' });
      const enResult = await useCase.execute({ locale: 'en-US' });

      const ptDto = ptResult.value as ProfileDTO;
      const enDto = enResult.value as ProfileDTO;

      expect(ptDto.headline).toBe('Engenheiro de Software');
      expect(ptDto.bio).toBe('Desenvolvedor apaixonado por código.');
      expect(ptDto.photo.alt).toBe('Foto do perfil');
      expect(enDto.headline).toBe('Software Engineer');
      expect(enDto.bio).toBe('Developer passionate about code.');
      expect(enDto.photo.alt).toBe('Profile photo');
    });

    it('should map stats array with localized label and non-localized value/icon', async () => {
      const profile = makeProfile({
        stats: [
          { label: { 'pt-BR': 'Anos', 'en-US': 'Years' }, value: '5+', icon: 'calendar' },
          { label: { 'pt-BR': 'Projetos', 'en-US': 'Projects' }, value: '20+', icon: 'code' },
        ],
      });
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      const dto = result.value as ProfileDTO;
      expect(dto.stats).toHaveLength(2);
      expect(dto.stats[0]).toEqual({ label: 'Anos', value: '5+', icon: 'calendar' });
      expect(dto.stats[1]).toEqual({ label: 'Projetos', value: '20+', icon: 'code' });
    });

    it('should map stat label using the requested locale', async () => {
      const profile = makeProfile({
        stats: [{ label: { 'pt-BR': 'Anos', 'en-US': 'Years' }, value: '5+', icon: 'calendar' }],
      });
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const ptResult = await useCase.execute({ locale: 'pt-BR' });
      const enResult = await useCase.execute({ locale: 'en-US' });

      expect((ptResult.value as ProfileDTO).stats[0]!.label).toBe('Anos');
      expect((enResult.value as ProfileDTO).stats[0]!.label).toBe('Years');
    });

    it('should map featuredProjectSlugs as string array', async () => {
      const profile = makeProfile({
        featuredProjectSlugs: ['project-a', 'project-b', 'project-c'],
      });
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      const dto = result.value as ProfileDTO;
      expect(dto.featuredProjectSlugs).toEqual(['project-a', 'project-b', 'project-c']);
    });

    it('should respect the domain invariant of max 6 featuredProjectSlugs', async () => {
      const profile = makeProfile({
        featuredProjectSlugs: ['p-one', 'p-two', 'p-three', 'p-four', 'p-five', 'p-six'],
      });
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect((result.value as ProfileDTO).featuredProjectSlugs).toHaveLength(6);
    });

    it('should return empty arrays when stats and featuredProjectSlugs are empty', async () => {
      const profile = makeProfile({ stats: [], featuredProjectSlugs: [] });
      const repo = makeRepository({ find: vi.fn().mockResolvedValue(profile) });
      const useCase = new GetProfile(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      const dto = result.value as ProfileDTO;
      expect(dto.stats).toEqual([]);
      expect(dto.featuredProjectSlugs).toEqual([]);
      expect(dto.socialNetworks).toEqual([]);
    });

    it('should call find() on the repository', async () => {
      const find = vi.fn().mockResolvedValue(null);
      const repo = makeRepository({ find });
      const useCase = new GetProfile(repo);

      await useCase.execute({ locale: 'pt-BR' });

      expect(find).toHaveBeenCalledOnce();
    });
  });
});
