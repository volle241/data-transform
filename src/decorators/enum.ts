import { createDecorator, DECORATOR_TYPES } from './createDecorator';

export const Enum = createDecorator(map => ({
  type: DECORATOR_TYPES.ENUM,
  from: ({ value }) => map[value],
  to: ({ value }) => {
    const [result] = Object.entries(map).find(item => item[1] === value) || [];
    return result;
  },
}));
