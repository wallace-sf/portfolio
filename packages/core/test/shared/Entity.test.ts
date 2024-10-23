import { Entity, IEntityProps } from '../../src';

interface IMyClassProps extends IEntityProps {
  name?: string;
  age?: number;
}

class MyClass extends Entity<MyClass, IMyClassProps> {
  readonly name: string;
  readonly age: number;

  private constructor(props: IMyClassProps) {
    super(props);
    this.name = props.name ?? '';
    this.age = props.age ?? 0;
  }

  static new(props: IMyClassProps) {
    return new MyClass(props);
  }
}

describe('Entity', () => {
  it('should compare two different entities', () => {
    const e1 = MyClass.new({ name: 'John', age: 20 });
    const e2 = MyClass.new({ name: 'John', age: 20 });

    expect(e1.equals(e2)).toBe(false);
    expect(e1.diff(e2)).toBe(true);
  });

  it('should compare two equal entities with same props', () => {
    const e1 = MyClass.new({ name: 'John', age: 20 });
    const e2 = MyClass.new({ id: e1.id.value, name: 'Denis', age: 30 });

    expect(e1.equals(e2)).toBe(true);
    expect(e1.diff(e2)).toBe(false);
  });

  it('should clone a entity with different props', () => {
    const e2Name = 'Jane';
    const e2Age = 25;

    const e1 = MyClass.new({ name: 'John', age: 20 });
    const e2 = e1.clone({ name: e2Name, age: e2Age });

    expect(e2.equals(e1)).toBe(true);
    expect(e2.name).toBe(e2Name);
    expect(e2.age).toBe(e2Age);
  });
});
