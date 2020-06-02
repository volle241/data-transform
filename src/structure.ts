import { isArray } from './helpers';

interface Result {
  key: string;
  object: any;
}

export const structure = new class Structure {
  static parse(object: any[] | object, path: string): Result {
    const keys = (path || '').split(/[[\].]/g).filter(Boolean);
    const rounds = keys.length - 1;

    for (let index = 0; index < rounds; index++) {
      const property = keys[index];

      if (object.hasOwnProperty(property)) {
        object = object[property];
      } else {
        object = {};
        break;
      }
    }

    return {
      key: keys.pop(),
      object,
    };
  }

  static format(object: any[] | object, path: string): Result {
    const keys = (path || '').split(/(\w*\S)(\[\d*\])|\./g).filter(Boolean);
    const rounds = keys.length - 1;

    for (let index = 0; index < rounds; index++) {
      const current = keys[index].replace(/\[(\w+)\]/g, '$1');
      const next = keys[index + 1].replace(/\[(\w+)\]/g, '$1');

      if (object.hasOwnProperty(current)) {
        object = object[current];
        continue;
      }

      if (/^\[.*\]$/.test(keys[index])) {
        object = isArray(object) ? object : Array(Number(current) + 1);
        object[current] = {};
        object = object[current];
        continue;
      }

      object[current] = /^\[.*\]$/.test(keys[index + 1])
        ? Array(Number(next) + 1)
        : {};
      object = object[current];
    }

    return {
      key: keys.pop(),
      object,
    };
  }

  parsePath(value: string, withBrackets?: boolean) {
    const regexp = withBrackets ? /(\w*\S)(\[\d*\])|\./g : /[[\].]/g;

    return (value || '').split(regexp).filter(Boolean);
  }

  get(object, path): any {
    const result = Structure.parse(object, path);

    if (!result.object) {
      return undefined;
    }

    return result.object[result.key];
  }

  set(object, path, value): void {
    const result = Structure.format(object, path);

    result.object[result.key] = value;
  }
}();
