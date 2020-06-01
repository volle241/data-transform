import { store } from '../store';

export const Property = name => (target, key) => {
  const config = store.get(target.constructor);

  if (!config.props[key]) {
    config.props[key] = {
      name,
      handlers: [],
    };
  }

  config.props[key].name = name;
};
