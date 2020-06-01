export const isArray = (value: any): boolean => Array.isArray(value);

export const isFunction = (value: any): boolean => typeof value === 'function';

export const isObject = (value: any): boolean => Object(value) === Object(value);
