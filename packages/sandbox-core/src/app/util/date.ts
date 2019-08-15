import * as moment from 'moment';

function _dealStrTimestamp(date) {
  if (/^\d+$/.test(date)) {
    date = parseInt(date, 10);
  }

  return date;
}

export function timeFormat(date): string {
  return toMoment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function toMoment(date): moment.Moment {
  date = _dealStrTimestamp(date);
  return moment(date);
}
