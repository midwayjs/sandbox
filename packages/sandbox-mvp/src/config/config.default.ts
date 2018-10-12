import path = require('path');
import { readFileSync } from 'fs';
import { coreMetrics, metricsLayouts, metricsLayoutsOrder } from './metrics';
import { defaultEnv, envSchemas, envSchemasOrderly } from './environment';

module.exports = appInfo => {

  const config: any = {};

  // Part 1
  // 核心配置
  config.container = {
    loadDir: ['../node_modules/sandbox-core/dist/core', 'app', 'lib'],
  };

  config.pandora = {
    restfulPort: 9081
  };

  config.tsdb = {
    host: process.env.UNDER_DOCKER ? 'opentsdb' : '127.0.0.1',
    port: 4242
  };

  config.dw = {
    host: process.env.UNDER_DOCKER ? 'mariadb-columnstore' : '127.0.0.1',
    port: 3306,
    username: 'sandbox',
    password: 'sandbox',
    database: 'column_sandbox',
  };

  config.coreDB = {
    host: process.env.UNDER_DOCKER ? 'mariadb-columnstore' : '127.0.0.1',
    port: 3306,
    username: 'sandbox',
    password: 'sandbox',
    database: 'sandbox',
  };


  // Part 2
  // 客制化配置
  config.coreMetrics = coreMetrics;
  config.metricsLayouts = metricsLayouts;
  config.metricsLayoutsOrder = metricsLayoutsOrder;
  config.defaultEnv = defaultEnv;
  config.envSchemas = envSchemas;
  config.envSchemasOrderly = envSchemasOrderly;


  // Part 3
  // 插件相关的配置
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
      '.html': 'nunjucks',
    },
  };

  config.middleware = [
    'assets',
    'user',
  ];

  config.onerror = {
    json(err, ctx) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: err.message,
        data: null,
        code: 500
      };
    }
  };

  config.siteFile = {
    '/favicon.ico': readFileSync(path.join(__dirname, '../app/public/favicon.png'))
  };

  config.security = {
    csrf: { enable: false },
    csp: false
  };

  config.customLogger = {
    dwLogger: {
      file: path.join(appInfo.root, `logs/sandbox-datasource-dw.log`)
    },
    coreDBLogger: {
      file: path.join(appInfo.root, `logs/sandbox-datasource-coredb.log`)
    }
  };

  return config;

};
