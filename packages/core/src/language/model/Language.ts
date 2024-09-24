import { Entity, IEntityProps, Name, Text } from '../../shared';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: string;
  locale: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  public readonly name: Name;
  public readonly fluency: Text;
  public readonly locale: Text;

  constructor(props: ILanguageProps) {
    super(props);
    this.name = Name.new(props.name);
    this.fluency = Text.new(props.fluency);
    this.locale = Text.new(props.locale, { min: 2, max: 50 });
  }
}
