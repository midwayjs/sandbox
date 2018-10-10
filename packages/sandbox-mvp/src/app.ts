import { dirname } from 'path';
import staticCache = require('koa-static-cache');
import { Application } from 'midway';
import { DebugServer } from 'sandbox-core';

export = (app: Application) => {
  app.on('server', (server) => {
    const debugServer = new DebugServer(server);
    debugServer.start();
  });
  app.use(staticCache({
    dir: dirname(require.resolve('chrome-devtools-frontend/front_end/inspector.html')),
    prefix: '/chrome-devtools'
  }));
};
