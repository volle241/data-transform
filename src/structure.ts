import { isArray } from './helpers';

interface Result {
  key: string;
  structure: any;
}

export const structure = new class Structure {
  static parse(structure: any[] | object, path: string): Result {
    const keys = (path || '').split(/[[\].]/g).filter(Boolean);
    const rounds = keys.length - 1;

    for (let index = 0; index < rounds; index++) {
      const property = keys[index];

      if (structure.hasOwnProperty(property)) {
        structure = structure[property];
      } else {
        structure = {};
        break;
      }
    }

    return {
      key: keys.pop(),
      structure,
    };
  }

  static format(structure: any[] | object, path: string): Result {
    const keys = (path || '').split(/(\w*\S)(\[\d*\])|\./g).filter(Boolean);
    const rounds = keys.length - 1;

    for (let index = 0; index < rounds; index++) {
      const current = keys[index].replace(/\[(\w+)\]/g, '$1');
      const next = keys[index + 1].replace(/\[(\w+)\]/g, '$1');

      if (structure.hasOwnProperty(current)) {
        structure = structure[current];
        continue;
      }

      if (/^\[.*\]$/.test(keys[index])) {
        structure = isArray(structure) ? structure : Array(Number(current) + 1);
        structure[current] = {};
        structure = structure[current];
        continue;
      }

      structure[current] = /^\[.*\]$/.test(keys[index + 1])
        ? Array(Number(next) + 1)
        : {};
      structure = structure[current];
    }

    return {
      key: keys.pop(),
      structure,
    };
  }

  get(structure, path): any {
    const result = Structure.parse(structure, path);

    if (!result.structure) {
      return undefined;
    }

    return result.structure[result.key];
  }

  set(structure, path, value): void {
    const result = Structure.format(structure, path);

    result.structure[result.key] = value;
  }
}();
