import { inject, provide } from 'midway-mirror';
import { DebuggableHost, HostSelector, AppSelector, UserSelector } from '../../interface/services/common';
import {PandoraAdapter} from '../adapter/pandoraAdapter';
import {Cipher} from '../debugServer/cipher';
import {IRemoteDebugService} from '../../interface/services/IRemoteDebugService';
import {IPrivilegeAdapter} from '../../interface/adapter/IPrivilegeAdapter';

@provide('remoteDebugService')
export class RemoteDebugService implements IRemoteDebugService {

  @inject('pandoraAdapter')
  pandoraAdapter: PandoraAdapter;

  @inject('privilegeAdapter')
  privilegeAdapter: IPrivilegeAdapter;

  async getDebuggableHost(options: HostSelector & AppSelector & UserSelector): Promise<DebuggableHost> {
    const {scope, scopeName, uid} = options;
    const hasPermission = await this.privilegeAdapter.isAppOps(scope, scopeName, uid);
    if (!hasPermission) {
      throw new Error('You have no permission to reach this');
    }
    const debuggableProcesses = await this.pandoraAdapter.getDebuggableProcesses(options);
    for (const process of debuggableProcesses) {
      process.token = Cipher.encrypt(JSON.stringify({
        debugPort: process.debugPort,
        ip: options.ip,
        webSocketDebuggerUrl: process.webSocketDebuggerUrl,
        u: uid },
      ));
    }
    return debuggableProcesses;
  }

}
