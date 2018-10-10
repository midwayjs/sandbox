import { provide, inject, config } from 'midway';
import { IPlatformGroup, IPlatformIdentification, IPlatformAdapter, IPlatformHostResult, TSDB } from 'sandbox-core';

@provide('defaultPlatformAdapter')
export class DefaultPlatformAdapter implements IPlatformAdapter {

  name = 'default';

  @inject('tsdb')
  tsdb: TSDB;

  @config('coreMetrics')
  coreMetrics;

  async getHosts(app: IPlatformIdentification): Promise<IPlatformHostResult<IPlatformGroup>> {

    const { scopeName, scope } = app;

    const metricsNameQps = this.coreMetrics.cpuUsage.metric;
    const res = await this.tsdb.query({
      start: '1h-ago',
      queries: [
        {
          metric: metricsNameQps,
          aggregator: 'avg',
          downsample: '1h-avg',
          tags: {
            scope_name: scopeName, scope,
            env: '*', hostname: '*', ip: '*',
          }
        }
      ]
    });

    const result: IPlatformHostResult<IPlatformGroup> = {};

    for (const item of res) {
      const tags = item.tags;
      const { env, ip, hostname } = tags;
      if(!result.hasOwnProperty(env)) {
        result[env] = [{
          name: env,
          hosts: []
        }];
      }
      const targetEnv = result[env][0];
      targetEnv.hosts.push({
        ip, hostname
      });
    }

    return result;

  }

}
