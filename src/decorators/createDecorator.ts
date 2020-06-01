import { store } from '../store';
import { Handler } from '../store/interfaces';

type Callback = (...args: any[]) => Handler;

export const createDecorator = (callback: Callback) => (...options) => (target: any, key: string) => {
  const { props } = store.get(target.constructor);

  if (!props[key]) {
    props[key] = { handlers: [] };
  }

  const { from, to } = callback(...options);

  props[key].handlers.unshift({ from, to });
};

export const createClassDecorator = (callback: Callback) => (...options) => (target: any) => {
  const { handlers } = store.get(target);

  const { from, to } = callback(...options);

  handlers.unshift({ from, to });
};
