import { inject, provide } from 'midway-web';
import { DebuggableHost, HostSelector, AppSelector, UserSelector } from '../../interface/services/common';
import { IPandoraAdapter } from '../../interface/adapter/IPandoraAdapter';
import { Cipher } from '../debugServer/cipher';
import { IRemoteDebugService } from '../../interface/services/IRemoteDebugService';

@provide('remoteDebugService')
export class RemoteDebugService implements IRemoteDebugService {

  @inject('pandoraAdapter')
  protected pandoraAdapter: IPandoraAdapter;

  async getDebuggableHost(options: HostSelector & AppSelector & UserSelector): Promise<DebuggableHost> {
    const {uid} = options;
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

  async getInspectorState(options: HostSelector & AppSelector) {
    return this.pandoraAdapter.getInspectorState(options);
  }

  async closeDebugPortByHost(options: HostSelector & AppSelector) {
    return this.pandoraAdapter.closeDebugPortByHost(options);
  }

}
