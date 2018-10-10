import * as assert from 'assert';

export function optionsCheck(options, required: string[]): void {
  required.forEach((r) => {
    assert(options[r], `${r} is needed.`);
  });
}

export function wrapJson (data) {
  return {
    success: true,
    message: 'success',
    code: 0,
    data,
  };
}

export const sqlPartTimestampConvertToTs = 'unix_timestamp(timestamp)';
