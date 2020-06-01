import { createDecorator } from "./createDecorator";

export const Enum = createDecorator(map => ({
  from: ({ value }) => map[value],
  to: ({ value }) => {
    const [result] = Object.entries(map).find(item => item[1] === value) || [];
    return result;
  }
}));
