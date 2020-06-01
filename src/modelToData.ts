import { store } from './store';
import { Props } from './store/interfaces';
import { structure } from './structure';
import { isArray, isObject, isFunction } from './helpers';

export const modelToData = async (Model: any, data: any, options?: object): Promise<any[] | object> => {
  const { props, handlers } = store.get(Model);

  const { output } = Object(options);

  let target;

  if (output === Array) {
    target = [];

    for (let source of data) {
      const result = await toSource(props, source);

      target.push(result);
    }
  } else {
    target = await toSource(props, data);
  }

  for (let { to } of [...handlers].reverse()) {
    if (isFunction(to)) {
      target = await to({ value: target });
    }
  }

  return target;
};

const toSource = async (props: Props, source: any): Promise<object> => {
  let target = {};

  const properties = Object.entries(props).filter(([key, { name }]) => name);

  for (let [key, { handlers, name }] of properties) {
    let value = source[key];

    for (let { to } of [...handlers].reverse()) {
      if (isFunction(to)) {
        value = await to({ value, target, source });
      }
    }

    switch (true) {
      case isArray(name):
        (name as string[]).forEach((path, index) => {
          structure.set(target, path, value[index]);
        });
        break;
      case isObject(name):
        Object.entries(name).forEach(([key, path]) => {
          structure.set(target, path, value[key]);
        });
        break;
      default:
        structure.set(target, name, value);
    }
  }

  return target;
};
