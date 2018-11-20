import { get, controller, provide, inject, priority } from 'midway-mirror';
import { RemoteDebugService } from '../../core/service/remoteDebugService';

@priority(0)
@provide()
@controller('/v2/api/remotedebug/')
export class RemoteDebugCtrl {

  @inject('remoteDebugService')
  remoteDebugService: RemoteDebugService;

  @get('/getDebuggableHost')
  async getDebuggableHost(ctx) {

    const query = ctx.query;
    const { scope, scopeName, env, ip, hostname } = query;
    const uid: string = ctx.uid;
    const data =  await this.remoteDebugService.getDebuggableHost({
      scope, scopeName, env, ip, hostname, uid,
    });
    ctx.body = {
      success: true,
      data,
    };

  }

}
