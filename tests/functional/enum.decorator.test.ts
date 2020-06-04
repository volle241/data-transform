import { dataToModel, modelToData, Property, Enum } from '../../src';

describe('@Enum decorator', () => {
  const data = {
    eye_color: '006400',
  };

  it('transform correct', async () => {
    expect.assertions(2);

    class Model {
      @Property('eye_color')
      @Enum({
        '006400': 'green',
      })
      eye;
    }

    const target = await dataToModel(Model, data);
    const source = await modelToData(Model, target);

    expect(target).toEqual({ eye: 'green' });
    expect(source).toEqual(data);
  });
});
