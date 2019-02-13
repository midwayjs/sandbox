import * as assert from 'assert';
import { getInstance } from '../../helper';

describe('remoteDebugCtrltest', async () => {

  it('getDebuggableHost without permission', async () => {
    const remoteDebugCtrl = await getInstance('remoteDebugCtrl');
    let throwError = false;
    try {
      await remoteDebugCtrl.getDebuggableHost({
        uid: '1001',
        query: {
          scope: 'test',
          scopeName: 'noPermission',
          uid: '1001',
          ip: '127.0.0.1',
        }
      });
    } catch (err) {
      if (err.message.match(/no permission/)) {
        throwError = true;
      } else {
        throw err;
      }
    }
    assert(throwError);
  });


});
