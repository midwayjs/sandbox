import { get, controller, provide, inject, priority } from 'midway-mirror';
import { RemoteDebugService } from '../../core/service/remoteDebugService';
import { IPrivilegeAdapter } from '../../interface/adapter/IPrivilegeAdapter';

@priority(0)
@provide()
@controller('/v2/api/remotedebug/')
export class RemoteDebugCtrl {

  @inject('remoteDebugService')
  remoteDebugService: RemoteDebugService;

  @inject('privilegeAdapter')
  protected privilegeAdapter: IPrivilegeAdapter;

  @get('/getDebuggableHost')
  async getDebuggableHost(ctx) {

    const query = ctx.query;
    const { scope, scopeName, env, ip, hostname } = query;
    const uid: string = ctx.uid;
    const hasPermission = await this.privilegeAdapter.isAppOps(scope, scopeName, uid);
    if (!hasPermission) {
      throw new Error('You have no permission to reach this');
    }
    const data =  await this.remoteDebugService.getDebuggableHost({
      scope, scopeName, env, ip, hostname, uid,
    });
    ctx.body = {
      success: true,
      data,
    };

  }

}
