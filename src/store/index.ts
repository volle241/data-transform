import { Model } from './interfaces';

class Store extends WeakMap {
  get(constructor: any): Model {
    if (!this.has(constructor)) {
      const parent = Object.getPrototypeOf(constructor);
      const config = super.get(parent) || { props: {}, handlers: [] };

      this.set(constructor, config);
    }

    return super.get(constructor);
  }
}

export const store = new Store();
