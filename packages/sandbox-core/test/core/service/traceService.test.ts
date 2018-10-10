import * as assert from 'assert';
import { Op } from 'sequelize';
import { getInstance } from '../../helper';
import traceMockData from '../../fixtures/mockData/traceMockData';
import keyTraceMockData from '../../fixtures/mockData/keyTraceMockData';

describe('traceServiceTest', async () => {

  before(async () => {
    const keyTraceModel = await getInstance('keyTraceModel');
    await keyTraceModel.bulkCreate(keyTraceMockData);
    const traceModel = await getInstance('traceModel');
    await traceModel.bulkCreate(traceMockData);
  });

  it('listFocusTraces', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.listFocusTraces({
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res);
  });

  it('listTraces', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.listTraces({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res);
  });

  after(async () => {
    const keyTraceModel = await getInstance('keyTraceModel');
    await keyTraceModel.destroy({
      where: {
        traceName: {
          [Op.in]: keyTraceMockData.map(kt => kt.traceName),
        }
      }
    });
    const traceModel = await getInstance('traceModel');
    await traceModel.destroy({
      where: {
        uuid: {
          [Op.in]: traceMockData.map(tr => tr.uuid),
        }
      }
    });
  });

});