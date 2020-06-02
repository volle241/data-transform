import { createDecorator } from './createDecorator';
import { isNumeric } from '../helpers';

export const Enum = createDecorator(map => ({
  from: ({ value }) => map[value],
  to: ({ value }) => {
    const [result] = Object.entries(map).find(item => item[1] === value) || [];
    return result;
  },
}));
