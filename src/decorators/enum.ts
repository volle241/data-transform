import { createDecorator, DECORATOR_TYPES } from './createDecorator';

interface EnumMap {
  [key: string]: any;
}

export const Enum: (map: EnumMap) => void = createDecorator(map => ({
  type: DECORATOR_TYPES.ENUM,
  from: ({ value }) => map[value],
  to: ({ value }) => {
    const [result] = Object.entries(map).find(item => item[1] === value) || [];
    return result;
  },
}));

const test = (ops: StringConstructor | NumberConstructor | BooleanConstructor) => '';

test(String);
test(Number);
test(Boolean);
