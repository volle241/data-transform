import { dataToModel, modelToData, Property, Date  } from '../../src';

describe('@Date decorator', () => {
  const data = {
    create: '20.11.2019',
  };

  it('transform correct', async () => {
    expect.assertions(2);

    class Model {
      @Property('create')
      @Date({
        from: 'DD.MM.YYYY',
        to: 'X',
      })
      create;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ create: 1574200800 });
    expect(source).toEqual(data);
  });
});
