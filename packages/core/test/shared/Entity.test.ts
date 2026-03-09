import { DateTime, Entity, IEntityProps } from '../../src';

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
  it('should initialize created_at and updated_at as DateTime when not provided', () => {
    const e = MyClass.new({ name: 'John', age: 20 });

    expect(e.created_at).toBeInstanceOf(DateTime);
    expect(e.updated_at).toBeInstanceOf(DateTime);
    expect(e.created_at.isNew).toBe(true);
    expect(e.updated_at.isNew).toBe(true);
  });

  it('should accept provided created_at and updated_at timestamps', () => {
    const timestamp = '2024-01-01T00:00:00.000Z';
    const e = MyClass.new({ name: 'John', age: 20, created_at: timestamp, updated_at: timestamp });

    expect(e.created_at.value).toBe(timestamp);
    expect(e.updated_at.value).toBe(timestamp);
    expect(e.created_at.isNew).toBe(false);
    expect(e.updated_at.isNew).toBe(false);
  });

  it('should have null deleted_at by default', () => {
    const e = MyClass.new({ name: 'John', age: 20 });

    expect(e.deleted_at).toBeNull();
  });

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
