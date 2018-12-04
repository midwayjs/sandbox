import * as assert from 'assert';
import { Op } from 'sequelize';
import { getInstance } from '../../helper';
import errorMockData from '../../fixtures/mockData/errorMockData';
import * as mm from 'mm';

describe('errorCtrlTest', async () => {

  before(async () => {
    const errorModel = await getInstance('errorModel');
    await errorModel.bulkCreate(errorMockData);
  });

  it('queryErrors', async () => {
    const errorCtrl = await getInstance('errorCtrl');
    const ctx = {
      request: {
        query: {
          scopeName: 'sandbox-test',
        },
      },
    };
    await errorCtrl.queryErrors(ctx);
    assert((ctx as any).body.success === false);
    assert((ctx as any).body.error.name === 'GetSLSLogError');
  });

  it('queryErrorTypes', async () => {
    const errorCtrl = await getInstance('errorCtrl');
    const ctx = {
      request: {
        query: {
          scopeName: 'sandbox-test',
        },
      },
    };
    await errorCtrl.queryErrorTypes(ctx);
    assert((ctx as any).body.success === true);
  });

  it('queryErrorTypes startTime endTime dataType parse ok', async () => {
    const errorCtrl = await getInstance('errorCtrl');
    mm(errorCtrl, 'errorServ', {
      queryErrorTypes: async (options) => options,
    });
    const ctx = {
      request: {
        query: {
          scopeName: 'sandbox-test',
          startTime: '1543816635000',
          endTime: '1543831635000',
        },
      },
    };
    await errorCtrl.queryErrorTypes(ctx);
    assert((ctx as any).body.data.startTime === 1543816635000);
    assert((ctx as any).body.data.endTime === 1543831635000);
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
