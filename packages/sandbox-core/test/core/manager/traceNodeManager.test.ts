import { getInstance } from '../../helper';
import * as assert from 'assert';
import { Op } from 'sequelize';
import traceMockData from '../../fixtures/mockData/traceMockData';
import keyTraceMockData from '../../fixtures/mockData/keyTraceMockData';

describe('traceNodeManager', () => {
  before(async () => {
    const keyTraceModel = await getInstance('keyTraceModel');
    await keyTraceModel.bulkCreate(keyTraceMockData);
    const traceModel = await getInstance('traceModel');
    await traceModel.bulkCreate(traceMockData.traces);
    const traceNodeModel = await getInstance('traceNodeModel');
    await traceNodeModel.bulkCreate(traceMockData.traceNodes);
  });

  it('listNodesByTarget', async () => {
    const traceManager = await getInstance('traceNodeManager');
    let res = await traceManager.listNodesByTarget({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
      spanName: 'configs',
      spanTarget: '/',
    }, {
      attributes: ['scope', 'scopeName'],
      order: 'timestamp,desc|spanCode,asc',
      limit: 10,
      offset: 10,
    });
    assert(res.count === 1 && res.rows.length === 0);

    res = await traceManager.listNodesByTarget({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
      spanName: 'configs',
      spanTarget: '/',
    }, {});
    assert(res.count === 1 && res.rows.length === 1);
  });

  after(async () => {
    const keyTraceModel = await getInstance('keyTraceModel');
    await keyTraceModel.destroy({
      where: {
        traceName: {
          [Op.in]: keyTraceMockData.map((kt) => kt.traceName),
        },
      },
    });
    const traceModel = await getInstance('traceModel');
    await traceModel.destroy({
      where: {
        uuid: {
          [Op.in]: traceMockData.traces.map((tr) => tr.uuid),
        },
      },
    });
    const traceNodeModel = await getInstance('traceNodeModel');
    await traceNodeModel.destroy({
      where: {
        uuid: {
          [Op.in]: traceMockData.traceNodes.map((tr) => tr.uuid),
        },
      },
    });
  });

});
