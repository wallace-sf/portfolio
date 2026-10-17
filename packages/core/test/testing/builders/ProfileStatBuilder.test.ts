import { ProfileStat } from '~/index';
import { ProfileStatBuilder } from '~/testing';

describe('ProfileStatBuilder', () => {
  it('should build a valid stat when using the defaults', () => {
    const stat = ProfileStatBuilder.build().now();

    expect(stat).toBeInstanceOf(ProfileStat);
    expect(stat.value).toBe('5+');
  });

  it('should apply overrides when with* methods are chained', () => {
    const stat = ProfileStatBuilder.build()
      .withLabel({ 'en-US': 'Projects', 'pt-BR': 'Projetos' })
      .withValue('20')
      .withIcon('rocket')
      .now();

    expect(stat.label.get('pt-BR')).toBe('Projetos');
    expect(stat.value).toBe('20');
    expect(stat.icon.value).toBe('rocket');
  });

  it('should throw when the props are invalid', () => {
    expect(() => ProfileStatBuilder.build().withIcon('').now()).toThrow();
  });
});
