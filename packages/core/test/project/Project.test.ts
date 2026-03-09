import { Project, SkillType, Text, ValidationError } from '../../src';
import { ProjectBuilder, SkillBuilder } from '../data';

const expectValidationError = (
  action: () => unknown,
  expectedCode: string,
  expectedMessage?: string,
): void => {
  try {
    action();
    throw new Error('Expected a ValidationError to be thrown.');
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).code).toBe(expectedCode);
    if (expectedMessage) {
      expect((error as ValidationError).message).toContain(expectedMessage);
    }
  }
};

describe('Project', () => {
  it('should be valid when props are valid', () => {
    const project = ProjectBuilder.build().now();

    expect(project).toBeInstanceOf(Project);
  });

  it('should be invalid when title is invalid', () => {
    expectValidationError(
      () => ProjectBuilder.build().withoutTitle().now(),
      Text.ERROR_CODE,
      'O texto deve ter entre 3 e 60 caracteres.',
    );
  });

  it('should be invalid when caption is invalid', () => {
    expectValidationError(
      () => ProjectBuilder.build().withoutCaption().now(),
      Text.ERROR_CODE,
      'O texto deve ter entre 3 e 200 caracteres.',
    );
  });

  it('should be invalid when content is invalid', () => {
    expectValidationError(
      () => ProjectBuilder.build().withoutContent().now(),
      Text.ERROR_CODE,
      'O texto deve ter entre 3 e 12500 caracteres.',
    );
  });

  it('should create new project from valid props', () => {
    const title = 'Fieldlink Form Builder';
    const caption =
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.';
    const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    const skills = SkillBuilder.listToProps(2);

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

  it('should allow projects without related skills when the list is empty', () => {
    const project = ProjectBuilder.build().withSkills([]).now();

    expect(project.skills).toEqual([]);
  });

  it('should reject projects when skills are not provided', () => {
    expectValidationError(
      () => ProjectBuilder.build().withoutSkills().now(),
      'ERROR_INVALID_SKILL_LIST',
      'Skills must be provided as an array.',
    );
  });

  it('should propagate nested skill validation errors', () => {
    const skills = SkillBuilder.listToProps(2);
    skills[0]!.type = '' as SkillType['value'];

    expectValidationError(
      () => ProjectBuilder.build().withSkills(skills).now(),
      SkillType.ERROR_CODE,
      'O valor deve ser um tipo de habilidade válido.',
    );
  });
});
