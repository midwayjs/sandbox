import * as assert from 'assert';
import { getInstance } from '../../helper';
import mm = require('mm');
import { expect } from 'chai';
import {MetricsService} from '../../../src/core/service/metricsService';

describe('metricsService.test.ts', () => {

  afterEach(() => {
    mm.restore();
  });

  it('should getMetricsNames() be ok', async () => {
    const metricsService: MetricsService = await getInstance('metricsService');
    const res = await metricsService.getMetricsNames({
      scope: 'test',
      scopeName: 'test',
    });
    assert(res.length === 3);
    assert(res[0] === 'cpu');
    assert(res[1] === 'mem');
    assert(res[2] === 'qps');
  });

  it('should getCustomMetricsNames() be ok', async () => {
    const metricsService: MetricsService = await getInstance('metricsService');
    mm((<any>metricsService).metricsManager, 'getMetricsNames', () => {
      return ['system.a', 'node.b', 'error.c', 'middleware.d', 'ok', 'yes', 'custom.xxx'];
    });
    const res = await metricsService.getCustomMetricsNames({
      scope: 'test',
      scopeName: 'test',
    });
    expect(res).to.deep.equal(['ok', 'yes', 'custom.xxx']);
  });

  it('should queryMetricsLatest() be ok', async () => {
    const metricsService: MetricsService = await getInstance('metricsService');
    mm(metricsService, 'tsdb', {
      query: async (query) => {
        assert(query.start === '6m-ago');
        assert(query.queries[0].metric === 'testName1');
        assert(query.queries[0].aggregator === 'avg');
        assert(query.queries[0].downsample === '1m-last');
        assert(query.queries[0].tags.scope === 'test');
        assert(query.queries[0].tags.scope_name === 'test');
        assert(query.queries[0].tags.env === 'test');
        assert(query.queries[1].metric === 'testName2');
        assert(query.queries[1].aggregator === 'avg');
        assert(query.queries[1].downsample === '1m-last');
        assert(query.queries[1].tags.scope === 'test');
        assert(query.queries[1].tags.scope_name === 'test');
        assert(query.queries[1].tags.env === 'test');
        assert(query.queries.length === 2);
        return [
          {
            metric: 'testName1',
            query: {
              metric: 'testName1',
              aggregator: 'avg',
            },
            dps: {
              1: 11,
              2: 12,
              3: 13,
            },
          },
          {
            metric: 'testName2',
            query: {
              metric: 'testName2',
              aggregator: 'avg',
            },
            dps: {
              1: 21,
              2: 22,
              3: 23,
            },
          },
        ];
      },
    });
    const res = await metricsService.queryMetricsLatest({
      scope: 'test', scopeName: 'test', env: 'test',
      metricsNames: [
        { metric: 'testName1', aggregator: 'avg' },
        { metric: 'testName2', aggregator: 'avg' },
      ],
    });
    expect(res).to.deep.equal(
      [ { latest: 13 }, { latest: 23 } ],
    );
  });

  it('should queryMetricsTrend() be ok', async () => {
    const metricsService: MetricsService = await getInstance('metricsService');
    mm(metricsService, 'tsdb', {
      query: async (query) => {
        assert(query.start === 123);
        assert(query.end === 456);
        assert(query.queries[0].metric === 'testName1');
        assert(query.queries[0].aggregator === 'avg');
        assert(query.queries[0].filters.some((f) => {
          return f.tagk = 'scope' && f.filter === 'test';
        }));
        assert(query.queries[0].filters.some((f) => {
          return f.tagk = 'scope_name' && f.filter === 'test';
        }));
        assert(query.queries[0].filters.some((f) => {
          return f.tagk = 'env' && f.filter === 'test';
        }));
        assert(query.queries[1].metric === 'testName2');
        assert(query.queries[1].aggregator === 'avg');
        assert(query.queries[1].filters.some((f) => {
          return f.tagk = 'scope' && f.filter === 'test';
        }));
        assert(query.queries[1].filters.some((f) => {
          return f.tagk = 'scope_name' && f.filter === 'test';
        }));
        assert(query.queries[1].filters.some((f) => {
          return f.tagk = 'env' && f.filter === 'test';
        }));
        assert(query.queries.length === 2);
        return [
          {
            metric: 'testName1',
            query: {
              metric: 'testName1',
              aggregator: 'avg',
            },
            tags: {
              hostname: 'host-a',
              ip: '192.168.1.1',
              pid: 1,
            },
            dps: {
              1: 11,
              2: 12,
              3: 13,
            },
          },
          {
            metric: 'testName2',
            query: {
              metric: 'testName2',
              aggregator: 'avg',
            },
            tags: {
              hostname: 'host-b',
              ip: '192.168.1.2',
              pid: 2,
            },
            dps: {
              1: 21,
              2: 22,
              3: 23,
            },
          },
        ];
      },
    });
    const res = await metricsService.queryMetricsTrend({
      scope: 'test',
      scopeName: 'test',
      env: 'test',
      startTime: 123,
      endTime: 456,
      metricsNames: [
        { metric: 'testName1', aggregator: 'avg' },
        { metric: 'testName2', aggregator: 'avg' },
      ],
    });
    expect(res).to.deep.equal([
      {
        trend: [
          {
            time: 1,
            value: 11,
          },
          {
            time: 2,
            value: 12,
          },
          {
            time: 3,
            value: 13,
          },
        ],
        aggregator: 'avg',
        metric: 'testName1',
        hostname: 'host-a',
        ip: '192.168.1.1',
        pid: 1,
      },
      {
        trend: [
          {
            time: 1,
            value: 21,
          },
          {
            time: 2,
            value: 22,
          },
          {
            time: 3,
            value: 23,
          },
        ],
        aggregator: 'avg',
        metric: 'testName2',
        hostname: 'host-b',
        ip: '192.168.1.2',
        pid: 2,
      },
    ]);
  });

  it('should queryHostsMap() be ok', async () => {

    const calledTimes = [];
    const metricsService: MetricsService = await getInstance('metricsService');

    mm(metricsService, 'metricsManager', {
      getLatestMetricByAppSelectorAndGroupByEachHost: async (metricsName, appSelector) => {
        calledTimes.push(metricsName);
        assert(appSelector.scope === 'test');
        assert(appSelector.scopeName === 'test');
        assert(appSelector.env === 'test');
        return [
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
            hostname: 'host-d',
            ip: '192.168.2.4',
            value: 43,
          },
        ];
      },
    });
    mm(metricsService, 'applicationService', {
      queryGroups(app) {
        assert(app.scope === 'test');
        assert(app.scopeName === 'test');
        return {
          test: [
            {
              name: 'group_1',
              hosts: [
                {
                  ip: '192.168.2.1',
                  hostname: 'host-a',
                },
                {
                  ip: '192.168.2.2',
                  hostname: 'host-b',
                },
                {
                  ip: '192.168.2.3',
                  hostname: 'host-c',
                },
              ],
            },
          ],
        };
      },
    });

    const res = await metricsService.queryHostsMap({
      scope: 'test',
      scopeName: 'test',
      env: 'test',
      metricsNames: [
        { metric: 'testName1', aggregator: 'avg' },
        { metric: 'testName2', aggregator: 'avg' },
      ],
    });

    expect(res).to.deep.equal([
        {
          name: 'group_1',
          hosts: [
            {
              ip: '192.168.2.1',
              hostname: 'host-a',
              testName1: 13,
              testName2: 13,
            },
            {
              ip: '192.168.2.2',
              hostname: 'host-b',
              testName1: 23,
              testName2: 23,
            },
            {
              ip: '192.168.2.3',
              hostname: 'host-c',
            },
          ],
        },
      ],
    );

    expect(calledTimes).to.deep.equal([
      { metric: 'testName1', aggregator: 'avg' },
      { metric: 'testName2', aggregator: 'avg' },
    ]);

  });

  it('should be ok for convertTagsToFilters()', async () => {
    const metricsService: MetricsService = await getInstance('metricsService');
    const tags = {
        scopeName: 'test-scope-name',
        ip: '192.168.1.1|192.168.2.2',
    };
    const groupby = ['hostname'];
    const filters = metricsService.convertTagsToFilters(tags, groupby);

    assert.deepEqual(filters, [
      { type: 'literal_or',
        tagk: 'scopeName',
        filter: 'test-scope-name',
        groupBy: false,
      },
      { type: 'literal_or',
        tagk: 'ip',
        filter: '192.168.1.1|192.168.2.2',
        groupBy: false,
      },
      { type: 'wildcard',
        tagk: 'hostname',
        filter: '*',
        groupBy: true }]);
  });

});
