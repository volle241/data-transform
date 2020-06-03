import { createDecorator, DECORATOR_TYPES } from './createDecorator';

export const Transform = createDecorator(({ from, to }) => ({
  type: DECORATOR_TYPES.TRANSFORM,
  from: ({ value, ...props }) => {
    if (typeof from === 'function') {
      return from({ value, ...props });
    }

    return value;
  },
  to: ({ value, ...props }) => {
    if (typeof to === 'function') {
      return to({ value, ...props });
    }

    return value;
  },
}));
