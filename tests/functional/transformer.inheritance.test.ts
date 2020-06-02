import { Property, Transform, Date, Enum } from '../../src/decorators';
import { dataToModel, modelToData } from '../../src';

describe('Transformation model inheritance', () => {
  const data = {
    first_name: 'John',
    second_name: 'Doe',
    role: '1',
    last_modify: '20.11.2019',
  };

  class User {
    @Property({
      first: 'first_name',
      second: 'second_name',
    })
    @Transform({
      from: ({ value }) => [value.first, value.second].join(' '),
      to: ({ value }) => {
        const [first, second] = value.split(' ');
        return { first, second };
      },
    })
    name;

    @Property('last_modify')
    @Date({
      from: 'DD.MM.YYYY',
      to: 'X',
    })
    lastModify;
  }

  class Employee extends User {
    @Property('role')
    @Enum({
      1: 'ADMIN',
    })
    role;
  }

  it('correct inheritance', async () => {
    expect.assertions(2);

    const target = await dataToModel(Employee, data);
    const source = await modelToData(Employee, target);

    expect(target).toEqual({ name: 'John Doe', lastModify: 1574200800, role: 'ADMIN' });
    expect(source).toEqual(data);
  });
});
