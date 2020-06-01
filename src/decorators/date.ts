import * as moment from 'moment';
import { createDecorator } from './createDecorator';

export const Date = createDecorator(props => ({
  from({ value }) {
    const date = moment(value, props.from).format(props.to);
    return ['x', 'X'].includes(props.to) ? Number(date) : date;
  },
  to({ value }) {
    const date = moment(value, props.to).format(props.from);
    return ['x', 'X'].includes(props.from) ? Number(date) : date;
  },
}));
