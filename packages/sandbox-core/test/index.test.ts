import { getInstance } from './helper';
import * as assert from 'assert';
import 'mocha';

describe('test', () => {
  it('test', async () => {
    const appService = await getInstance('applicationService');

    assert(appService.listByUser);
  });
});
