import * as moment from 'moment';

function _dealStrTimestamp(date) {
  if (/^\d+$/.test(date)) {
    date = parseInt(date, 10);
  }

  return date;
}

export function timeFormat(date): string {
  date = _dealStrTimestamp(date);

  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
