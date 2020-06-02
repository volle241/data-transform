import { store } from '../store';
import { Handler } from '../store/interfaces';

type Callback = (...args: any[]) => Handler;

export const DECORATOR_TYPES = {
  DATE: Symbol('@Date'),
  ENUM: Symbol('@Enum'),
  TRANSFORM: Symbol('@Transform'),
  TYPE: Symbol('@Type'),
  CUSTOM: Symbol('@Custom'),
};

export const createDecorator = (callback: Callback) => (...decoratorOptions) => (target: any, key: string) => {
  const { props } = store.get(target.constructor);

  if (!props[key]) {
    props[key] = { handlers: [] };
  }

  const { from, to, type } = callback(...decoratorOptions);

  props[key].handlers.unshift({
    from,
    to,
    type: type || DECORATOR_TYPES.CUSTOM,
    options: decoratorOptions,
  });
};

export const createClassDecorator = (callback: Callback) => (...options) => (target: any) => {
  const { handlers } = store.get(target);

  const { from, to } = callback(...options);

  handlers.unshift({ from, to });
};
