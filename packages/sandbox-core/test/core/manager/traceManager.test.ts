import { getInstance } from '../../helper';
import * as assert from 'assert';
import { Op } from 'sequelize';
import traceMockData from '../../fixtures/mockData/traceMockData';
import keyTraceMockData from '../../fixtures/mockData/keyTraceMockData';

describe('test/core/manager/traceManager.test.ts', () => {
  before(async () => {
    const keyTraceModel = await getInstance('keyTraceModel');
    await keyTraceModel.bulkCreate(keyTraceMockData);
    const traceModel = await getInstance('traceModel');
    await traceModel.bulkCreate(traceMockData.traces);
    const traceNodeModel = await getInstance('traceNodeModel');
    await traceNodeModel.bulkCreate(traceMockData.traceNodes);
  });

  it('traceSummaryList', async () => {
    const traceManager = await getInstance('traceManager');
    const res = await traceManager.traceSummaryList({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
    }, {
      order: 'env',
      limit: 10,
      offset: 10,
    });
    assert(res.length === 0);
  });

  it('listTraceByName', async () => {
    const traceManager = await getInstance('traceManager');
    let res = await traceManager.listTraceByName({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    }, {
      attributes: ['scope', 'scopeName'],
      order: 'timestamp,desc|traceDuration,asc',
      limit: 10,
      offset: 10,
    });
    assert(res.count === 1 && res.rows.length === 0);

    res = await traceManager.listTraceByName({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
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
