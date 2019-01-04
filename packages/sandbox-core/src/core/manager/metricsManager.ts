import { provide, inject } from 'midway-mirror';
import * as _ from 'lodash';
import {AppSelector, IndicatorResult, MetricNameJSON, TimeWindowOptions} from '../../interface/services/common';
import {TSDB} from '../dataSource/tsdb';
import {ISadMetricsAdapter} from '../../interface/adapter/ISadMetricsAdapter';

@provide('metricsManager')
export class MetricsManager {

  @inject('tsdb')
  protected tsdb: TSDB;

  @inject('sadMetricsAdapter')
  protected sadMetricsAdapter: ISadMetricsAdapter;

  static pickLatestDp (dps) {
    if (_.isEmpty(dps)) {
      return null;
    }
    let times = [];
    for (const key of Object.keys(dps)) {
      times.push(parseInt(key, 10));
    }
    times = times.sort((a, b) => b - a);
    const latest = dps[times[0]];
    return latest;
  }

  getMetricsNames(options: AppSelector & TimeWindowOptions): Promise<string[]> {
    return this.sadMetricsAdapter.getMetricsNames(options);
  }

  frontEndAnalyse (opts: {
    analyseHigherLower: boolean;
  }, metricsNames: MetricNameJSON[], resp: IndicatorResult[]): IndicatorResult[] {

    if (!opts.analyseHigherLower) {
      return resp;
    }

    const ret = [];

    for (const name of metricsNames) {

      const relateds = [];

      let max;
      let min;
      const avg = {
        metric: name.metric,
        aggregator: name.aggregator,
        frontEndAggregator: 'avg',
        trend: [],
      };
      const tmpMap: Map<IndicatorResult, number> = new Map();
      for (const metricRes of resp) {
        if (metricRes.metric === name.metric && metricRes.aggregator === name.aggregator) {
          let sum = 0;
          for (const p of metricRes.trend) {
            sum += p.value;
          }
          const avgValue = sum / metricRes.trend.length;
          tmpMap.set(metricRes, avgValue);
          relateds.push(metricRes);
          if (!max || tmpMap.get(max) < avgValue) {
            max = metricRes;
          }
          if (!min || tmpMap.get(min) > avgValue) {
            min = metricRes;
          }
        }
      }
      if (relateds.length === 1) {
        ret.push(relateds[0]);
        continue;
      }

      max.frontEndAggregator = 'highest';
      min.frontEndAggregator = 'lowest';

      const avgMap: Map<number, {cnt: number; sum: number}> = new Map();
      for (const metricRes of relateds) {
        for (const p of metricRes.trend) {
          if (!avgMap.has(p.time)) {
            avgMap.set(p.time, {sum: 0, cnt: 0});
          }
          const hole = avgMap.get(p.time);
          hole.sum += p.value;
          hole.cnt++;
        }
      }

      for (const time of avgMap.keys()) {
        const hole = avgMap.get(time);
        avg.trend.push({
          time,
          value: hole.sum / hole.cnt,
        });
      }

      ret.push(avg);
      ret.push(max);
      ret.push(min);

    }

    return ret;

  }

  async getLatestMetricByAppSelectorAndGroupByEachHost(metricsName: MetricNameJSON, appSelector: AppSelector) {
    const queries = [{
      ...metricsName,
      downsample: '1m-last',
      tags: {
        scope: appSelector.scope,
        scope_name: appSelector.scopeName,
        env: appSelector.env,
        ip: '*',
      },
    }];
    const resp = await this.tsdb.query({
      start: '6m-ago',
      queries,
    });
    const ret = [];
    for (const item of resp) {
      const {tags, dps} = item;
      const latest = MetricsManager.pickLatestDp(dps);
      const hostData = {
        ...tags,
        value: latest,
      };
      ret.push(hostData);
    }
    return ret;
  }

}
