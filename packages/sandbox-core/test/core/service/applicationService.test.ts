import { getInstance } from '../../helper';
import * as assert from 'assert';
import { Op } from 'sequelize';
import { xor, isEqual, flatten } from 'lodash';
import applicationMockData from '../../fixtures/mockData/applicationMockData';
import defaultPlatformHostsMockData from '../../fixtures/mockData/defaultPlatformHostsMockData';

describe('applicationServiceTest', () => {
  before(async () => {
    const applicationModel = await getInstance('applicationModel');
    await Promise.all([
      applicationModel.bulkCreate(applicationMockData),
    ]);
  });

  it('listByUser', async () => {
    const appService = await getInstance('applicationService');
    const res = await appService.listByUser('1001', {scope: 'test', scopeName: 'sandbox-test'});
    assert(res.total >= 0 && res.data instanceof Array);
    assert(res.data.every((app) => app.scope === 'test'));
    assert(res.data.every((app) => app.scopeName === 'sandbox-test'));
    assert(xor(res.data.map((app) => app.flag), applicationMockData.map((app) => app.flag)).length === 0);
  });

  it('queryHosts', async () => {
    const appService = await getInstance('applicationService');
    const res = await appService.queryHosts({ env: 'dev', scope: 'test'});
    assert(res);
    const hostsData = flatten(defaultPlatformHostsMockData.dev.map((pf) => pf.hosts));
    assert(res.every((host) => hostsData.some((h) => h.ip === host.ip)));
  });

  it('groupUpsert', async () => {
    const appService = await getInstance('applicationService');
    const res = await appService.groupUpsert({
      groupName: 'test_group',
      hostList: [{ip: '10.0.0.1', hostname: 'devServer'}],
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(typeof res === 'boolean');
  });

  it('queryGroups', async () => {
    const appService = await getInstance('applicationService');
    const res = await appService.queryGroups({ scope: 'test', scopeName: 'sandbox-test' });
    assert(res);
    assert(isEqual(res.dev, defaultPlatformHostsMockData.dev));
  });

  it('groupUpsert with empty host list', async () => {
    const appService = await getInstance('applicationService');
    const res = await appService.groupUpsert({
      groupName: 'test_group_no_host',
      hostList: null,
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(typeof res === 'boolean');
  });

  it('groupExist', async () => {
    const appService = await getInstance('applicationService');
    const res = await appService.groupExist({
      groupName: 'test_group',
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res === 1);
  });

  it('groupDelete', async () => {
    const appService = await getInstance('applicationService');
    const res = await appService.groupDelete({
      groupName: 'test_group',
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res === false);
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
