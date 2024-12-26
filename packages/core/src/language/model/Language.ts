import {
  Entity,
  IEntityProps,
  Name,
  Text,
  Fluency,
  FluencyValue,
} from '../../shared';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: FluencyValue;
  locale: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  public readonly name: Name;
  public readonly fluency: Fluency;
  public readonly locale: Text;

  constructor(props: ILanguageProps) {
    super(props);
    this.name = Name.new(props.name);
    this.fluency = Fluency.new(props.fluency);
    this.locale = Text.new(props.locale, { min: 2, max: 50 });
  }
}
