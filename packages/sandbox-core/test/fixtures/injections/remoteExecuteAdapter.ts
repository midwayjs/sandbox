import { provide } from 'midway-web';
import { HostSelector } from '../../../src/interface/services/common';

@provide('remoteExecuteAdapter')
export class RemoteExecuteAdapter {
  async exec(host: HostSelector, cmd): Promise<string> {
    if (cmd.match(/.*\/json\/list.*/)) {
      return JSON.stringify([{ id: 'd1ba2672-5121-4fd5-969e-78bbb1f64a47' }]);
    } else if (cmd.match(/.*\/process.*/)) {
      return JSON.stringify({
        data: [
          { debugPort: 3001 },
          { debugPort: 3002 },
        ],
      });
    }
    return '{}';
  }
}
