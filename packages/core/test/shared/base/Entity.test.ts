import { DateTime, Entity, IEntityProps } from '~/index';

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
  it('should auto-generate created_at and updated_at when not provided', () => {
    const e = MyClass.new({ name: 'John', age: 20 });

    expect(e.created_at).toBeInstanceOf(DateTime);
    expect(e.updated_at).toBeInstanceOf(DateTime);
    expect(DateTime.create(e.created_at.value).isRight()).toBe(true);
    expect(DateTime.create(e.updated_at.value).isRight()).toBe(true);
  });

  it('should accept provided created_at and updated_at timestamps', () => {
    const timestamp = '2024-01-01T00:00:00.000Z';
    const e = MyClass.new({
      name: 'John',
      age: 20,
      created_at: timestamp,
      updated_at: timestamp,
    });

    expect(e.created_at.value).toBe(timestamp);
    expect(e.updated_at.value).toBe(timestamp);
  });

  it('should have null deleted_at by default', () => {
    const e = MyClass.new({ name: 'John', age: 20 });

    expect(e.deleted_at).toBeNull();
  });

  it('should freeze props to prevent external mutation', () => {
    const e = MyClass.new({ name: 'John', age: 20 });

    expect(Object.isFrozen(e.props)).toBe(true);
  });

  it('should not mutate the original props object passed to constructor', () => {
    const original: IMyClassProps = { name: 'John', age: 20 };
    const before = { ...original };

    MyClass.new(original);

    expect(original).toEqual(before);
  });

  it('should compare two different entities as not equal', () => {
    const e1 = MyClass.new({ name: 'John', age: 20 });
    const e2 = MyClass.new({ name: 'John', age: 20 });

    expect(e1.equals(e2)).toBe(false);
    expect(e1.diff(e2)).toBe(true);
  });

  it('should compare two entities with the same id as equal', () => {
    const e1 = MyClass.new({ name: 'John', age: 20 });
    const e2 = MyClass.new({ id: e1.id.value, name: 'Denis', age: 30 });

    expect(e1.equals(e2)).toBe(true);
    expect(e1.diff(e2)).toBe(false);
  });

  it('should clone entity preserving id while merging new props', () => {
    const e1 = MyClass.new({ name: 'John', age: 20 });
    const e2 = e1.clone({ name: 'Jane', age: 25 });

    expect(e2.equals(e1)).toBe(true);
    expect(e2.name).toBe('Jane');
    expect(e2.age).toBe(25);
  });
});
