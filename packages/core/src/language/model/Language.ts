import { Entity, IEntityProps, Name, ShortText } from '../../shared';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: string;
  locale: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  public readonly name: Name;
  public readonly fluency: ShortText;
  public readonly locale: ShortText;

  constructor(props: ILanguageProps) {
    super(props);
    this.name = Name.new(props.name);
    this.fluency = ShortText.new(props.fluency);
    this.locale = ShortText.new(props.locale);
  }
}
