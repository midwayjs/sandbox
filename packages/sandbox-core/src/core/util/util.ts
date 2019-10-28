import * as assert from 'assert';

export function optionsCheck(options, required: string[]): void {
  required.forEach((r) => {
    assert(options[r], `${r} is needed.`);
  });
}

export function wrapJson(data, error?: Error & { code?: number }) {
  return {
    success: !error,
    message: error ? error.message : 'success',
    code: error ? error.code : 0,
    data,
  };
}

export const sqlPartTimestampConvertToTs = 'unix_timestamp(timestamp)';
