import { provide, inject, config } from 'midway';
import { ApplicationManager, TSDB } from 'sandbox-core';

@provide('applicationManager')
export class OwnApplicationManager extends ApplicationManager {

  @inject('tsdb')
  tsdb: TSDB;

  @config('coreMetrics')
  coreMetrics;

  async list() {
    const metricsNameQps = this.coreMetrics.cpuUsage.metric;
    const res = await this.tsdb.query({
      start: '1h-ago',
      queries: [
        {
          metric: metricsNameQps,
          aggregator: 'avg',
          downsample: '1h-avg',
          tags: {
            scope_name: '*', scope: '*',
          }
        }
      ]
    });
    const rows: any[] = [];
    for(const item of res) {
      const tags = item.tags;
      const { scope_name, scope } = tags;
      rows.push({
        scope: scope,
        scopeName: scope_name,
      });
    }
    return {
      rows: rows,
      count: rows.length
    }
  }

}