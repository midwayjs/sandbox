import * as assert from 'assert';
import { Op } from 'sequelize';
import { xor } from 'lodash';
import { getInstance } from '../../helper';
import errorMockData from '../../fixtures/mockData/errorMockData';

describe('errorServiceTest', () => {
  before(async () => {
    const errorModel = await getInstance('errorModel');
    await errorModel.bulkCreate(errorMockData);
  });

  it('queryErrors', async () => {
    const errorService = await getInstance('errorService');
    const baseOptions = {
      startTime: new Date('2018-09-20 00:00:00'),
      endTime: new Date('2018-09-20 03:00:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      page: 1,
      pageSize: 10,
    };
    let res = await errorService.queryErrors(baseOptions);
    assert(res.count === 3 && res.rows.length === 3);
    assert(xor(res.rows.map((row) => row.uuid), errorMockData.map((data) => data.uuid)).length === 0);

    res = await errorService.queryErrors({
      ip: '192.168.1.1',
      errType: ['RangeError'],
      keyword: '483d9c50-c303-11e8-a355-529269fb1459',
      in: 'traceId', ...baseOptions});
    assert(res.count === 1 && res.rows.length === 1);
    assert(res.rows[0].traceId === '483d9c50-c303-11e8-a355-529269fb1459');

    res = await errorService.queryErrors({
      keyword: 'RangeError',
      in: 'errorType', ...baseOptions});
    assert(res.count === 2 && res.rows.length === 2);
    assert(res.rows.every((row) => row.errorType === 'RangeError'));

    res = await errorService.queryErrors({
      keyword: '192.168.1.2',
      in: 'machine', ...baseOptions});
    assert(res.count === 0 && res.rows.length === 0);

    res = await errorService.queryErrors({
      keyword: 'emitTwo', ...baseOptions});
    assert(res.count === 3 && res.rows.length === 3);
  });

  it('queryErrorTypes', async () => {
    const errorService = await getInstance('errorService');
    const res = await errorService.queryErrorTypes({
      startTime: new Date('2018-09-20 00:00:00'),
      endTime: new Date('2018-09-20 03:00:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      page: 1,
      pageSize: 10,
    });
    assert(res[0].length === 2);
    assert(res[1].length === 2);

    assert(res[1].some((data) => data.errType === 'RangeError' && data.cnt === 2));
    assert(res[1].some((data) => data.errType === 'ReferenceError' && data.cnt === 1));
    assert(res[2].length === 2);
    assert(res[2].some((data) => data.errType === 'ReferenceError' && data.cnt === 1));
    assert(res[2].some((data) => data.errType === 'RangeError' && data.cnt === 2));
  });

  after(async () => {
    const errorModel = await getInstance('errorModel');
    await errorModel.destroy({
      where: {
        uuid: {
          [Op.in]: errorMockData.map((e) => e.uuid),
        },
      },
    });
  });

});
