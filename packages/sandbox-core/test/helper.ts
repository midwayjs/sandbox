import { MidwayContainer } from 'midway-web';
import config from './fixtures/config';
import { join } from 'path';

let container = null;

async function initialize(): Promise<void> {
  container = new MidwayContainer();

  container.registerDataHandler('config', (key) => {
    return config[key];
  });

  container.registerDataHandler('logger', (key) => {
    return console;
  });

  container.load({
    loadDir: [join(process.cwd(), 'src'), join(process.cwd(), 'test/fixtures/injections')],
  });

  await container.ready();
}

export async function getInstance(key: string): Promise<any> {
  if (!container) {
    await initialize();
  }

  return container.getAsync(key);
}
