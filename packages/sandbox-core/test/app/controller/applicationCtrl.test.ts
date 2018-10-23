import * as assert from 'assert';
import { Op } from 'sequelize';
import { getInstance } from '../../helper';
import applicationMockData from '../../fixtures/mockData/applicationMockData';

describe('applicationCtrltest', async () => {

  before(async () => {
    const applicationModel = await getInstance('applicationModel');
    await Promise.all([
      applicationModel.bulkCreate(applicationMockData),
    ]);
  });

  it('listByUser', async () => {
    const applicationCtrl = await getInstance('applicationCtrl');
    const ctx = {
      uid: '1001',
      query: {
        offset: 0
      }
    };
    await applicationCtrl.listByUser(ctx);
    assert((ctx as any).body.success === true);
  });

  it('groupUpsert', async () => {
    const applicationCtrl = await getInstance('applicationCtrl');
    const ctx = {
      request: {
        body: {
          groupName: 'test_group',
          hostList: [{ip: '10.0.0.1', hostname: 'devServer'}],
          scope: 'test',
          scopeName: 'sandbox-test',
        }
      }
    };
    await applicationCtrl.groupUpsert(ctx);
    assert((ctx as any).body);
  });

  it('groupExist', async () => {
    const applicationCtrl = await getInstance('applicationCtrl');
    const ctx = {
      query: {
        groupName: 'test_group',
        scope: 'test',
        scopeName: 'sandbox-test',
      }
    };
    await applicationCtrl.groupExist(ctx);
    assert((ctx as any).body);
  });

  it('groupDelete', async () => {
    const applicationCtrl = await getInstance('applicationCtrl');
    const ctx = {
      request: {
        body: {
          groupName: 'test_group',
          scope: 'test',
          scopeName: 'sandbox-test',
        }
      }
    };
    await applicationCtrl.groupDelete(ctx);
    assert((ctx as any).body);
  });

  after(async () => {
    const applicationModel = await getInstance('applicationModel');
    await applicationModel.destroy({
      where: {
        alinodeToken: {
          [Op.in]: applicationMockData.map((app) => app.alinodeToken),
        },
      },
    });
    const groupModel = await getInstance('groupModel');
    await groupModel.destroy({
      where: {
        groupName: 'test_group',
        scope: 'test',
        scopeName: 'sandbox-test',
      },
    });
  });
});