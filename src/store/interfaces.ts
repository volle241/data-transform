type Parser = (object: { value: any; source?: any; target?: any; meta?: any; }) => any;

export type Name = string[] | { [key: string]: string } | string;

export interface Handler {
  from: Parser;
  to: Parser;
}

export interface Props {
  [key: string]: {
    name?: Name;
    handlers: Handler[];
  }
}

export interface Model {
  props: Props;
  handlers: Handler[];
}
