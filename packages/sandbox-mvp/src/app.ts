import { dirname } from 'path';
import staticCache = require('koa-static-cache');
import { Application } from 'midway';

export = (app: Application) => {
  app.on('server', (server) => {
    app.applicationContext.getAsync('debugServer').then((debugServer) => {
      debugServer.setServer(server);
      debugServer.start();
    });
  });
  app.use(staticCache({
    dir: dirname(require.resolve('chrome-devtools-frontend/front_end/inspector.html')),
    prefix: '/chrome-devtools'
  }));
};
