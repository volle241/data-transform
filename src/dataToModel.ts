import { store } from './store';
import { Name, Props } from './store/interfaces';
import { structure } from './structure';
import { isArray, isObject, isFunction } from './helpers';

export const dataToModel = async (Model: any, data: any, options?: object): Promise<any[] | object> => {
  const { props, handlers } = store.get(Model);

  const { output, meta } = Object(options);

  let source = data;

  for (const { from } of handlers) {
    if (isFunction(from)) {
      source = await from({ value: data, meta });
    }
  }

  if (output === Array) {
    const result = [];

    for (const item of [].concat(source)) {
      const target = await toTarget(props, item, meta);

      result.push(target);
    }

    return result;
  }

  return toTarget(props, source, meta);
};

const toTarget = async (props: Props, source: object, meta: any): Promise<object> => {
  const target = {};

  for (const [key, { handlers, name }] of Object.entries(props)) {
    let value = getInitialValue(source, name);

    for (const { from } of handlers) {
      if (isFunction(from)) {
        value = await from({ value, target, source, meta });
      }
    }

    target[key] = value;
  }

  return target;
};

const getInitialValue = (source: any, name: Name): any => {
  if (isArray(name)) {
    return (name as string[]).map(item => structure.get(source, item));
  }

  if (isObject(name)) {
    return Object.entries(name).reduce(
      (target, [key, value]) => ({
        ...target,
        [key]: structure.get(source, value),
      }),
      {},
    );
  }

  return structure.get(source, name);
};
