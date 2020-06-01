import { createDecorator } from "./createDecorator";
import { store } from "../store";
import { dataToModel, modelToData } from "../index";

export const Type = createDecorator((Constructor, output) => ({
  from({ value }) {
    switch (true) {
      case [Number, Boolean, String].includes(Constructor):
        return Constructor(value);
      case store.has(Constructor):
        return dataToModel(Constructor, value, { output });
      default:
        return value;
    }
  },
  to({ value }) {
    switch (true) {
      case [Number, Boolean, String].includes(Constructor):
        return Constructor(value);
      case store.has(Constructor):
        return modelToData(Constructor, value, { output });
      default:
        return value;
    }
  }
}));
