import { faker } from '@faker-js/faker';
import { ValidationError } from '@repo/utils';

import { Project, Text } from '../../src';
import { ProjectBuilder, SkillBuilder } from '../data';
describe('Project', () => {
  it('should be valid when props are valid', () => {
    const project = ProjectBuilder.build().now();

    expect(project).toBeInstanceOf(Project);
  });

  it('should be invalid when title is invalid', () => {
    expect(() => ProjectBuilder.build().withoutTitle().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 3 e 60 caracteres.',
      ),
    );
  });

  it('should be invalid when caption is invalid', () => {
    expect(() => ProjectBuilder.build().withoutCaption().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 3 e 200 caracteres.',
      ),
    );
  });

  it('should be invalid when content is invalid', () => {
    expect(() => ProjectBuilder.build().withoutContent().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 3 e 12500 caracteres.',
      ),
    );
  });

  it('should create new project from valid props', () => {
    const title = 'Fieldlink Form Builder';
    const caption =
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.';
    const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    const skills = SkillBuilder.listToProps(
      faker.number.int({ min: 0, max: 10 }),
    );

    const project = ProjectBuilder.build()
      .withTitle(title)
      .withCaption(caption)
      .withContent(content)
      .withSkills(skills)
      .now();

    expect(project).toBeInstanceOf(Project);
    expect(project.title.value).toBe(title);
    expect(project.caption.value).toBe(caption);
    expect(project.content.value).toBe(content);
    expect(project.skills.map((s) => s.props)).toEqual(skills);
  });

  it('should create multiple projects from valid props', () => {
    const projects = ProjectBuilder.list(2);

    expect(projects).toHaveLength(2);
  });
});
