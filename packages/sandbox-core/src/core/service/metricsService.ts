import { provide, inject } from 'midway-mirror';
import { ComplexSelector, MetricsNamesSelector, IndicatorResult, TimeWindowOptions,
  AppSelector } from '../../interface/services/common';
import {TSDB} from '../dataSource/tsdb';
import * as _ from 'lodash';
import {MetricsManager} from '../manager/metricsManager';
import {ApplicationService} from './applicationService';
import {IMetricsService} from '../../interface/services/IMetricsService';

const BUILT_IN_PREFIXS = ['system.', 'node.', 'error.', 'middleware.'];
const BUILD_IN_REG = new RegExp(`^(${BUILT_IN_PREFIXS.join('|')})`);

@provide('metricsService')
export class MetricsService implements IMetricsService {

  @inject('tsdb')
  protected tsdb: TSDB;

  @inject('metricsManager')
  protected metricsManager: MetricsManager;

  @inject('applicationService')
  protected applicationService: ApplicationService;

  async getMetricsNames(options: ComplexSelector & AppSelector & TimeWindowOptions): Promise<string[]> {
    return this.metricsManager.getMetricsNames(options);
  }

  async getCustomMetricsNames(options: ComplexSelector & AppSelector & TimeWindowOptions): Promise<string[]> {
    const allMetricsName = await this.metricsManager.getMetricsNames(options);
    return allMetricsName.filter((name) => !BUILD_IN_REG.test(name));
  }

  async queryMetricsLatest(options: ComplexSelector & MetricsNamesSelector & AppSelector): Promise<IndicatorResult[]> {

    const {
      scope, scopeName, env,
      metricsNames,
    } = options;

    const queries = [];
    for (const metricsNameJSON of metricsNames) {
      queries.push({
        ...metricsNameJSON,
        downsample: '1m-last',
        tags: {
          scope, scope_name: scopeName, env,
        },
      });
    }

    const resp = await this.tsdb.query({
      start: '6m-ago',
      end: '1m-ago',
      queries,
    });

    const latestMap: Map<string, number> = new Map();
    for (const metricRes of resp) {
      const dps = metricRes.dps;
      const latest = MetricsManager.pickLatestDp(dps);
      const key = metricRes.query.metric + '/' + metricRes.query.aggregator;
      latestMap.set(key, latest);
    }

    const ret: IndicatorResult[] = [];
    for (const metricsNameJSON of metricsNames) {
      const key = metricsNameJSON.metric + '/' + metricsNameJSON.aggregator;
      ret.push({
        latest: latestMap.get(key),
      });
    }

    return ret;

  }

  async queryMetricsTrend(options: ComplexSelector & MetricsNamesSelector & TimeWindowOptions & AppSelector): Promise<IndicatorResult[]> {

    const {
      scope,
      scopeName, env, ip, hostname,
      startTime, endTime,
      metricsNames,
    } = options;

    const queries = [];
    for (const metricsNameJSON of metricsNames) {
      const extTags = {};
      if (metricsNameJSON.groupBy) {
        for (const key of metricsNameJSON.groupBy) {
          extTags[key] = '*';
        }
      }
      queries.push({
        metric: metricsNameJSON.metric,
        aggregator: metricsNameJSON.aggregator,
        downsample: metricsNameJSON.downsample,
        tags: {
          scope, scope_name: scopeName, env, ip, hostname,
          ...extTags,
        },
      });
    }

    this.convertTagsToFilters(queries);

    const batchQuery = await this.tsdb.query({
      start: startTime,
      end: endTime,
      queries,
    });

    if (batchQuery.error) {
      throw new Error(batchQuery.error.message);
    }

    const ret: IndicatorResult[] = [];
    for (const metricRes of batchQuery) {
      const query = metricRes.query;
      const dps = metricRes.dps;
      let times = [];
      for (const key of Object.keys(dps)) {
        times.push(parseInt(key, 10));
      }
      times = times.sort((a, b) => a - b);
      const trend = [];
      for (const time of times) {
        trend.push({time, value: dps[time]});
      }
      ret.push({
        trend,
        aggregator: query.aggregator,
        metric: query.metric,
        hostname: metricRes.tags && metricRes.tags.hostname,
        ip: metricRes.tags && metricRes.tags.ip,
        pid: metricRes.tags && metricRes.tags.pid,
      });
    }

    const ret2n: IndicatorResult[] = this.metricsManager.frontEndAnalyse({
      analyseHigherLower: options.analyseHigherLower,
    }, metricsNames, ret);

    return ret2n;

  }

  convertTagsToFilters(queries) {
    // 将 tags 转为 filter 查询语法，以便支持多值不带 group by 的查询
    queries.forEach((query) => {
      const tagEntries = _.entries(query.tags);
      query.filters = tagEntries.map((entry) => {
        if (!entry[1]) {
          return null;
        }
        return {
          type: (entry[1] as string).includes('*') ? 'wildcard' : 'literal_or',
          tagk: entry[0],
          filter: entry[1],
          groupBy: false,   // filter 中不采用 group by，如有需要可以使用多个 query
        };
      }).filter((t) => t);
      query.tags = undefined;
    });
    return queries;
  }

  async queryHostsMap(options: ComplexSelector & MetricsNamesSelector & AppSelector) {
    const {scope, scopeName, env, metricsNames} = options;
    const hostList = await this.applicationService.queryGroups({ scope, scopeName });
    const hostListAtTargetEnv = hostList[env];
    const dataMap = {};
    for (const metricsName of metricsNames) {
      const hosts = await this.metricsManager.getLatestMetricByAppSelectorAndGroupByEachHost(metricsName,
        {scope, scopeName, env});
      for (const host of hosts) {
        const {ip, hostname, value} = host;
        if (!dataMap.hasOwnProperty(host.ip)) {
          dataMap[ip] = { ip, hostname };
        }
        dataMap[ip][metricsName.metric] = value;
      }
    }

    for (const subGroup of hostListAtTargetEnv) {
      for (const host of subGroup.hosts) {
        if (dataMap.hasOwnProperty(host.ip)) {
          Object.assign(host, dataMap[host.ip]);
        }
      }
    }

    return hostListAtTargetEnv;

  }

}
