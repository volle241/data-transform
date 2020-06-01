import { Property, Type } from '../../src/decorators';
import { dataToModel, modelToData } from '../../src';

describe('@Type decorator', () => {
  it('property "type" is String', async () => {
    const data = {
      value: '24',
    };

    class Model {
      @Property('value')
      @Type(String)
      value;
    }

    const target: any = await dataToModel(Model, data);

    expect(typeof target.value).toBe('string');
  });

  it('property "type" is Number', async () => {
    const data = {
      value: 24,
    };

    class Model {
      @Property('value')
      @Type(Number)
      value;
    }

    const target: any = await dataToModel(Model, data);

    expect(typeof target.value).toBe('number');
  });

  it('property "type" is Boolean', async () => {
    const data = {
      value: undefined,
    };

    class Model {
      @Property('value')
      @Type(Boolean)
      value;
    }

    const target: any = await dataToModel(Model, data);

    expect(typeof target.value).toBe('boolean');
  });

  it('property "type" is Transformer, Transformer type is "object"', async () => {
    expect.assertions(2);

    const data = {
      contacts: {
        phone_number: '+38 012 345 67 89',
        email_value: 'test@test.tt',
      },
    };

    class Contact {
      @Property('phone_number')
      phone;

      @Property('email_value')
      email;
    }

    class Model {
      @Property('contacts')
      @Type(Contact)
      contacts;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ contacts: { phone: '+38 012 345 67 89', email: 'test@test.tt' } });
    expect(source).toEqual(data);
  });

  it('property "type" is Transformer, Transformer type is "array"', async () => {
    expect.assertions(2);

    const data = {
      friends_list: [
        {
          first_name: 'Blanche',
          second_name: 'Mclaughlin',
        },
      ],
    };

    class Friend {
      @Property('first_name')
      firstName;

      @Property('second_name')
      secondName;
    }

    class Model {
      @Property('friends_list')
      @Type(Friend, Array)
      friends;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ friends: [{ firstName: 'Blanche', secondName: 'Mclaughlin' }] });
    expect(source).toEqual(data);
  });
});
