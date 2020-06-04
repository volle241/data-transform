import { dataToModel, Property, DataTransform } from '../../src';

describe('@ClassTransform decorator', () => {
  const data = [
    {
      price: 10,
      quantity: 2,
    },
    {
      price: 11,
      quantity: 3,
    },
    {
      price: 9,
      quantity: 3,
    },
  ];

  it('simple transformation', async () => {
    @DataTransform({
      from: ({ value }) => value.filter(({ price }) => price >= 10),
    })
    class Model {
      @Property('price')
      price;
    }

    const target = await dataToModel(Model, data, { output: Array });

    expect(target).toHaveLength(2);
  });

  it('mutable transformation', async () => {
    @DataTransform({
      from: ({ value }) => value
        .map(item => ({
          amount: item.price * item.quantity,
        }))
        .filter(({ amount }) => amount > 20),
    })
    class Model {
      @Property('amount')
      amount;
    }

    const target = await dataToModel(Model, data, { output: Array });

    expect(target).toHaveLength(2);
  });
});
