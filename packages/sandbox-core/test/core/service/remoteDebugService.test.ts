import * as assert from 'assert';
import { getInstance } from '../../helper';

describe('remoteDebugServiceTest', () => {

  it('getDebuggableHost', async () => {
    const remoteDebugService = await getInstance('remoteDebugService');
    const res = await remoteDebugService.getDebuggableHost({
      scope: 'test',
      scopeName: 'sandbox-test',
      uid: '1001',
      ip: '127.0.0.1',
    });
    assert(res.length === 2);
    assert(res.every((d) => d.debugPort && d.webSocketDebuggerUrl && d.token));
  });

});
