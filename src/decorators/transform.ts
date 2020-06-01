import { createDecorator } from "./createDecorator";

export const Transform = createDecorator(({ from, to }) => ({
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
