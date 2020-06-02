import { Property, Transform } from '../../src/decorators';
import { dataToModel, modelToData } from '../../src';

describe('@Transform decorator', () => {
  const data = {
    first_name: 'John',
    surname: 'Doe',
    nickname: null,
  };

  class Model {
    @Property('first_name')
    @Transform({
      from: ({ value, source }) => [value, source.surname].join(' '),
      to: ({ value }) => value.split(' ')[0],
    })
    name;

    @Transform({
      from: ({ source, target }) => source.nickname || target.name.match(/\b(\w)/g).join(''),
    })
    nickname;
  }

  it('correct transformation', async () => {
    expect.assertions(2);

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ name: 'John Doe', nickname: 'JD' });
    expect(source).toEqual({ first_name: 'John' });
  });
});
