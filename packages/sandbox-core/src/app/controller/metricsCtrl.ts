import { inject, get } from 'midway-web';

import {MetricsUtils} from '../util/metricsUtils';
import {MetricNameJSON} from '../../interface/services/common';

export class MetricsCtrl {

  @inject('metricsService')
  private metricsService;

  @get('/getMetricsNames')
  async getMetricsNames(ctx) {

    const query = ctx.query;
    const {scope, scopeName, env} = query;
    const data = await this.metricsService.getMetricsNames({
      scope, scopeName, env,
    });
    ctx.body = {
      success: true,
      data,
    };

  }

  @get('/getCustomMetricsNames')
  async getCustomMetricsNames(ctx) {

    const query = ctx.query;
    const {scope, scopeName, env} = query;
    const data = await this.metricsService.getCustomMetricsNames({
      scope, scopeName, env,
    });
    ctx.body = {
      success: true,
      data,
    };

  }

  @get('/queryMetricsLatest')
  async queryMetricsLatest(ctx) {

    const query = ctx.query;
    const {scope, scopeName, env} = query;
    const metricsNames: MetricNameJSON[] = MetricsUtils.parseQueryStyleMetricsNames(query.metricsNames);

    const data = await this.metricsService.queryMetricsLatest({
      metricsNames, scope, scopeName, env,
    });

    ctx.body = {
      success: true,
      data,
    };

  }

  @get('/queryMetricsTrend')
  async queryMetricsTrend(ctx) {

    const query = ctx.query;
    const {scope, scopeName, env, hostname, ip, version, pid} = query;
    const startTime = parseInt(query.startTime, 10);
    const endTime = parseInt(query.endTime, 10);
    const metricsNames: MetricNameJSON[] = MetricsUtils.parseQueryStyleMetricsNames(query.metricsNames);
    const analyseHigherLower = query.analyseHigherLower === 'true' ? true : false;

    const data = await this.metricsService.queryMetricsTrend({
      startTime, endTime, metricsNames, scope, scopeName, env, hostname, ip, analyseHigherLower, version, pid,
    });

    ctx.body = {
      success: true,
      data,
    };

 }

  @get('/queryHostsMap')
  async queryHostsMap(ctx) {

    const query = ctx.query;
    const {scope, scopeName, env} = query;
    const metricsNames: MetricNameJSON[] = MetricsUtils.parseQueryStyleMetricsNames(query.metricsNames);
    const data = await this.metricsService.queryHostsMap({
      metricsNames, scope, scopeName, env,
    });
    ctx.body = {
      success: true,
      data,
    };

  }
}
