import { createClassDecorator } from "./createDecorator";

export const ClassTransform = createClassDecorator(({ from, to }) => ({
  from: ({ value, ...props }) => {
    if (typeof from === "function") {
      return from({ value, ...props });
    }

    return value;
  },
  to: ({ value, ...props }) => {
    if (typeof to === "function") {
      return to({ value, ...props });
    }

    return value;
  }
}));
