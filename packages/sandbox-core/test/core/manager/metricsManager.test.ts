import * as assert from 'assert';
import {MetricsManager} from '../../../src/core/manager/metricsManager';
import { getInstance } from '../../helper';
import { expect } from 'chai';
import mm = require('mm');

describe('test/core/manager/metricsManager.test.ts', () => {

  it('should static pickLatestDp() be ok', () => {
    let latest = MetricsManager.pickLatestDp({
      123: '123',
      456: '456',
      1000: 'latest',
    });
    assert('latest' === latest);

    latest = MetricsManager.pickLatestDp({});
    assert(null === latest);
  });

  it('should getMetricsNames() be ok', async () => {
    const metricsManager: MetricsManager = await getInstance('metricsManager');
    const res = await metricsManager.getMetricsNames({
      scope: 'test',
      scopeName: 'test',
    });
    assert(res.length === 3);
    assert(res[0] === 'cpu');
    assert(res[1] === 'mem');
    assert(res[2] === 'qps');
  });

  it('should frontEndAnalyse() with analyseHigherLower=true be ok', async () => {

    const metricsManager: MetricsManager = await getInstance('metricsManager');
    const res = metricsManager.frontEndAnalyse(
      {analyseHigherLower: true},
      [{ metric: 'testName', aggregator: 'avg' }],
      [
        {
          metric: 'testName',
          aggregator: 'avg',
          hostname: 'host-a',
          trend: [
            { time: 1, value: 1 },
            { time: 2, value: 1 },
          ],
        },
        {
          metric: 'testName',
          aggregator: 'avg',
          hostname: 'host-b',
          trend: [
            { time: 1, value: 2 },
            { time: 2, value: 2 },
          ],
        },
        {
          metric: 'testName',
          aggregator: 'avg',
          hostname: 'host-b',
          trend: [
            { time: 1, value: 3 },
            { time: 2, value: 3 },
          ],
        },
        {
          metric: 'testName',
          aggregator: 'avg',
          hostname: 'host-c',
          trend: [
            { time: 1, value: 4 },
            { time: 2, value: 4 },
          ],
        },
      ],
    );

    expect(res).to.deep.equal(
      [
        {
          metric: 'testName',
          aggregator: 'avg',
          frontEndAggregator: 'avg',
          trend: [
            {
              time: 1,
              value: 2.5,
            },
            {
              time: 2,
              value: 2.5,
            },
          ],
        },
        {
          metric: 'testName',
          aggregator: 'avg',
          hostname: 'host-c',
          trend: [
            {
              time: 1,
              value: 4,
            },
            {
              time: 2,
              value: 4,
            },
          ],
          frontEndAggregator: 'highest',
        },
        {
          metric: 'testName',
          aggregator: 'avg',
          hostname: 'host-a',
          trend: [
            {
              time: 1,
              value: 1,
            },
            {
              time: 2,
              value: 1,
            },
          ],
          frontEndAggregator: 'lowest',
        },
      ],
    );
  });

  it('should frontEndAnalyse() with analyseHigherLower=false be ok', async () => {
    const input = [
      {
        metric: 'testName',
        aggregator: 'avg',
        hostname: 'host-a',
        trend: [
          { time: 1, value: 1 },
          { time: 2, value: 1 },
        ],
      },
      {
        metric: 'testName',
        aggregator: 'avg',
        hostname: 'host-b',
        trend: [
          { time: 1, value: 2 },
          { time: 2, value: 2 },
        ],
      },
      {
        metric: 'testName',
        aggregator: 'avg',
        hostname: 'host-b',
        trend: [
          { time: 1, value: 3 },
          { time: 2, value: 3 },
        ],
      },
      {
        metric: 'testName',
        aggregator: 'avg',
        hostname: 'host-c',
        trend: [
          { time: 1, value: 4 },
          { time: 2, value: 4 },
        ],
      },
    ];
    const metricsManager: MetricsManager = await getInstance('metricsManager');
    const res = metricsManager.frontEndAnalyse(
      {analyseHigherLower: false},
      [{ metric: 'testName', aggregator: 'avg' }],
      input,
    );
    expect(res).to.be.equal(input);
  });

  it('should getLatestMetricByAppSelectorAndGroupByEachHost() be ok', async () => {
    const metricsManager: MetricsManager = await getInstance('metricsManager');
    mm(metricsManager, 'tsdb', {
      query(queryOpts) {
        return [
          {
            tags: {
              hostname: 'host-a',
              ip: '192.168.2.1',
            },
            dps: {
              1: 11,
              2: 12,
              3: 13,
            },
          },
          {
            tags: {
              hostname: 'host-b',
              ip: '192.168.2.2',
            },
            dps: {
              1: 21,
              2: 22,
              3: 23,
            },
          },
          {
            tags: {
              hostname: 'host-c',
              ip: '192.168.2.3',
            },
            dps: {
              1: 31,
              2: 32,
              3: 33,
            },
          },
        ];
      },
    });
    const res = await metricsManager.getLatestMetricByAppSelectorAndGroupByEachHost(
      {
        metric: 'testName',
      },
      {
        scope: 'test',
        scopeName: 'test',
      },
    );
    expect(res).to.deep.equal(
      [
        {
          hostname: 'host-a',
          ip: '192.168.2.1',
          value: 13,
        },
        {
          hostname: 'host-b',
          ip: '192.168.2.2',
          value: 23,
        },
        {
          hostname: 'host-c',
          ip: '192.168.2.3',
          value: 33,
        },
      ],
    );
    mm.restore();
  });

});
