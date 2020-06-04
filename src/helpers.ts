export const isArray = (value: any): boolean => Array.isArray(value);

export const isFunction = (value: any): boolean => typeof value === 'function';

export const isObject = (value: any): boolean => (
  value instanceof Object &&
  value.constructor === Object
);

export const isNumeric = (value: any): boolean => /^\d+$/.test(String(value));
