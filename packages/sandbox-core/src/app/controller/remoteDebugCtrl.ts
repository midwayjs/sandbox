import { get, inject } from 'midway-web';
import { IRemoteDebugService } from '../../interface/services/IRemoteDebugService';
import { IPrivilegeAdapter } from '../../interface/adapter/IPrivilegeAdapter';

export class RemoteDebugCtrl {

  @inject('remoteDebugService')
  remoteDebugService: IRemoteDebugService;

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
