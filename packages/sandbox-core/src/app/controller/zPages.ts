import { controller, logger, get, provide } from 'midway-mirror';

const PAGE_TITLE: string = 'Midway-Sandbox';

@provide()
@controller('/')
export class ZPages {

  @logger()
  logger;

  @get('/*')
  async homeIndex(ctx) {
    let globalConfigStr: string = null;
    try {
      const config = ctx.app.config;
      const globalConfig = {
        coreMetrics: config.coreMetrics,
        metricsLayouts: config.metricsLayouts,
        metricsLayoutsOrder: config.metricsLayoutsOrder,
        defaultEnv: config.defaultEnv,
        envSchemas: config.envSchemas,
        envSchemasOrderly: config.envSchemasOrderly,
      };
      globalConfigStr = JSON.stringify(globalConfig);
    } catch (err) {
      this.logger.warn(err);
    }
    await ctx.render('index', {
      title: PAGE_TITLE,
      globalConfigStr,
    });
  }
}
