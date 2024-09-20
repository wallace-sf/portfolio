import { Entity, IEntityProps, Name, ShortText } from '../../shared';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  public readonly name: Name;
  public readonly fluency: ShortText;

  constructor(props: ILanguageProps) {
    super(props);
    this.name = Name.new(props.name);
    this.fluency = ShortText.new(props.fluency);
  }
}
