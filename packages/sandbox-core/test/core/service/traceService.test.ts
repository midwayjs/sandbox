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
    await traceModel.bulkCreate(traceMockData.traces);
    const traceNodeModel = await getInstance('traceNodeModel');
    await traceNodeModel.bulkCreate(traceMockData.traceNodes);
  });

  it('listFocusTraces', async () => {
    const traceService = await getInstance('traceService');
    const res = await traceService.listFocusTraces({
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res.data.length === traceMockData.traces.length);
  });

  it('listTraces', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.listTraces({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      env: 'dev',
      hostname: 'develop.server',
      scopeName: 'sandbox-test',
    });
    assert(res.data.length === traceMockData.traces.length);

    res = await traceService.listTraces({
      scope: 'test',
      ip: '10.0.0.1',
      scopeName: 'sandbox-test',
    });
    assert(res.data.length >= 0);

    res = await traceService.listTraces({
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res.data.length >= 0);
  });

  it('traceDetail', async () => {
    const traceService = await getInstance('traceService');
    const testUUID = '3e351e0f-9abd-4023-8a2a-061dc3cacffc';
    let res = await traceService.traceDetail({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      env: 'dev',
      ip: '10.0.0.1',
      scopeName: 'sandbox-test',
      uuid: testUUID,
    });
    assert(res && res.uuid === testUUID);

    res = await traceService.traceDetail({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      uuid: testUUID,
    });
    assert(res && res.uuid === testUUID);
  });

  it('toggleTraceFocus', async () => {
    const traceService = await getInstance('traceService');
    const res = await traceService.toggleTraceFocus({
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
      focus: 1,
    });
    assert(typeof res === 'boolean');
  });

  it('toggleTraceFocus cancel', async () => {
    const traceService = await getInstance('traceService');
    const res = await traceService.toggleTraceFocus({
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
      focus: 0,
    });
    assert(typeof res === 'boolean');
  });

  it('traceTotalitySummary', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.traceTotalitySummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      env: 'dev',
      hostname: 'develop.server',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res);
    assert(res[0] === traceMockData.traces.reduce((total, trace) => total += trace.traceDuration, 0) / traceMockData.traces.length);
    assert(res[1] === traceMockData.traces.length);
    assert(res[2] === 100);

    res = await traceService.traceTotalitySummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      ip: '10.0.0.1',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res);
    assert(res[0] === traceMockData.traces.reduce((total, trace) => total += trace.traceDuration, 0) / traceMockData.traces.length);
    assert(res[1] === traceMockData.traces.length);
    assert(res[2] === 100);

    res = await traceService.traceTotalitySummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res);
    assert(res[0] === traceMockData.traces.reduce((total, trace) => total += trace.traceDuration, 0) / traceMockData.traces.length);
    assert(res[1] === traceMockData.traces.length);
    assert(res[2] === 100);
  });

  it('spanTotalitySummary', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.spanTotalitySummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
    });
    assert(res.slice(0, 3).every((val) => typeof val === 'number'));
    assert(typeof res[3] === 'string' && res[3].length > 0);

    res = await traceService.spanTotalitySummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      ip: '10.0.0.1',
    });
    assert(res.slice(0, 3).every((val) => typeof val === 'number'));
    assert(typeof res[3] === 'string' && res[3].length > 0);

    res = await traceService.spanTotalitySummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res.slice(0, 3).every((val) => typeof val === 'number'));
    assert(typeof res[3] === 'string' && res[3].length > 0);
  });

  it('traceSummaryTrend', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.traceSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      env: 'dev',
      hostname: 'develop.server',
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length === 1);
    assert(res.data.every((record) => {
      return record.slice(1, 4).every((val) => typeof val === 'number')
        && record[0] instanceof Date;
    }));

    res = await traceService.traceSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      ip: '10.0.0.1',
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res.data.length === 1);
    assert(res.data.every((record) => {
      return record.slice(1, 4).every((val) => typeof val === 'number')
        && record[0] instanceof Date;
    }));

    res = await traceService.traceSummaryTrend({
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res.data.length === 0);
  });

  it('listTraceByName', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.listTraceByName({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      env: 'dev',
      hostname: 'develop.server',
      scope: 'test',
      scopeName: 'sandbox-test',
    });
    assert(res.data.length === traceMockData.traces.length);

    res = await traceService.listTraceByName({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      ip: '10.0.0.1',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length === 1);

    res = await traceService.listTraceByName({
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length === 0);
  });

  it('traceSummary', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.traceSummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      env: 'dev',
      hostname: 'develop.server',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.every((val) => typeof val === 'number'));

    res = await traceService.traceSummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      ip: '10.0.0.1',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.every((val) => typeof val === 'number'));

    res = await traceService.traceSummary({
      scope: 'test',
      scopeName: 'sandbox-test-not-exist',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.every((val) => typeof val === 'number'));
  });

  it('traceNodeSummaryList', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.traceNodeSummaryList({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      env: 'dev',
      hostname: 'develop.server',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
      focus: 0,
    });
    assert(res.data.every((record) => {
      return record.slice(0, 3).every((val) => typeof val === 'number')
        && typeof record[3] === 'string';
    }));

    res = await traceService.traceNodeSummaryList({
      scope: 'test',
      ip: '10.0.0.1',
      scopeName: 'sandbox-test',
      focus: 0,
    });
    assert(res.data.every((record) => {
      return record.slice(0, 3).every((val) => typeof val === 'number')
        && typeof record[3] === 'string';
    }));

    res = await traceService.traceNodeSummaryList({
      scope: 'test',
      scopeName: 'sandbox-test',
      traceName: 'HTTP-GET:/products',
      focus: 0,
    });
    assert(res.data.every((record) => {
      return record.slice(0, 3).every((val) => typeof val === 'number')
        && typeof record[3] === 'string';
    }));
  });

  it('traceNodeSummary', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.traceNodeSummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.every((val) => typeof val === 'number'));

    res = await traceService.traceNodeSummary({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      ip: '10.0.0.1',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.every((val) => typeof val === 'number'));

    res = await traceService.traceNodeSummary({
      scope: 'test',
      scopeName: 'sandbox-test',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.length >= 0);
  });

  it('traceNodeSummaryTrend', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.traceNodeSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length === 1);
    assert(res.data.every((record) => {
      return record.slice(1, 4).every((val) => typeof val === 'number')
        && record[0] instanceof Date;
    }));

    res = await traceService.traceNodeSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      ip: '10.0.0.1',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length === 1);
    assert(res.data.every((record) => {
      return record.slice(1, 4).every((val) => typeof val === 'number')
        && record[0] instanceof Date;
    }));

    res = await traceService.traceNodeSummaryTrend({
      scope: 'test',
      scopeName: 'sandbox-test',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length === 0);
  });

  it('spanTargetList', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.spanTargetList({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length > 0);
    assert(res.data.every((val) => typeof val[0] === 'string' && typeof val[1] === 'number'));

    res = await traceService.spanTargetList({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      ip: '10.0.0.1',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
    });
    assert(res.data.length > 0);
    assert(res.data.every((val) => typeof val[0] === 'string' && typeof val[1] === 'number'));

    res = await traceService.spanTargetList({
      scope: 'test',
      scopeName: 'sandbox-test',
      spanName: 'configs',
    });
    assert(res.data.length === 0);
  });

  it('spanTargetSummaryTrend', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.spanTargetSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.data.length === 1);
    assert(res.data.every((record) => {
      return record.slice(1, 4).every((val) => typeof val === 'number')
        && record[0] instanceof Date;
    }));

    res = await traceService.spanTargetSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      ip: '10.0.0.1',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.data.length === 1);
    assert(res.data.every((record) => {
      return record.slice(1, 4).every((val) => typeof val === 'number')
        && record[0] instanceof Date;
    }));

    res = await traceService.spanTargetSummaryTrend({
      scope: 'test',
      scopeName: 'sandbox-test',
      spanName: 'configs',
      spanTarget: '/',
    });
    assert(res.data.length === 0);
  });

  it('listNodesByTarget', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.listNodesByTarget({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.data.length === 1);

    res = await traceService.listNodesByTarget({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      ip: '10.0.0.1',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.data.length === 1);

    res = await traceService.listNodesByTarget({
      scope: 'test',
      scopeName: 'sandbox-test',
      spanName: 'configs',
      spanTarget: '/',
    });
    assert(res.data.length === 0);
  });

  it('spansSummaryTrend', async () => {
    const traceService = await getInstance('traceService');
    let res = await traceService.spansSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.types[0] === 'configs');
    assert(Object.keys(res).filter((key) => key !== 'types').every((key) => res[key].every((val) => val.timestamp && val.configs)));

    res = await traceService.spansSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      ip: '10.0.0.1',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.types[0] === 'configs');
    assert(Object.keys(res).filter((key) => key !== 'types').every((key) => res[key].every((val) => val.timestamp && val.configs)));

    res = await traceService.spansSummaryTrend({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      scope: 'test',
      scopeName: 'sandbox-test',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.types[0] === 'configs');
    assert(Object.keys(res).filter((key) => key !== 'types').every((key) => res[key].every((val) => val.timestamp && val.configs)));
  });

  it('traceFlowHistogram', async () => {
    const traceService = await getInstance('traceService');
    const res = await traceService.traceFlowHistogram({
      startTime: new Date('2018-09-28 01:00:00'),
      endTime: new Date('2018-09-28 01:30:00'),
      env: 'dev',
      scope: 'test',
      scopeName: 'sandbox-test',
      spanName: 'configs',
      traceName: 'HTTP-GET:/products',
      spanTarget: '/',
    });
    assert(res.data.length === 2);
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
