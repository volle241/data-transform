import { Property } from '../../src/decorators';
import { dataToModel, modelToData } from '../../src';

describe('@Property decorator', () => {
  const data = {
    first_name: 'John',
    second_name: 'Doe',
  };

  it('property "name" is string', async () => {
    expect.assertions(2);

    class Model {
      @Property('first_name')
      name;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ name: 'John' });
    expect(source).toEqual({ first_name: 'John' });
  });

  it('property "name" is path', async () => {
    expect.assertions(2);

    const data = {
      contacts: [
        {
          email: 'test@tt.tt'
        }
      ],
    };

    class Model {
      @Property('contacts[0].email')
      email;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ email: 'test@tt.tt' });
    expect(source).toEqual(data);
  });

  it('property "name" is object', async () => {
    class Model {
      @Property({
        first: 'first_name',
        second: 'second_name',
      })
      name;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ name: { first: 'John', second: 'Doe' } });
    expect(source).toEqual(data);
  });

  it('property "name" is array', async () => {
    class Model {
      @Property(['first_name', 'second_name'])
      name;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ name: ['John', 'Doe'] });
    expect(source).toEqual(data);
  });
});
