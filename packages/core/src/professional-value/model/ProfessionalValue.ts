import { Entity, IEntityProps, Text } from '../../shared';

export interface IProfessionalValueProps extends IEntityProps {
  icon: string;
  content: string;
}

export class ProfessionalValue extends Entity<
  ProfessionalValue,
  IProfessionalValueProps
> {
  public readonly icon: Text;
  public readonly content: Text;

  constructor(props: IProfessionalValueProps) {
    super(props);
    this.icon = Text.new(props.icon, { min: 2, max: 50 });
    this.content = Text.new(props.content, { min: 1, max: 125000 });
  }
}
