import { inject, provide, scope, ScopeEnum, config } from 'midway-mirror';
import {AppSelector, HostSelector} from '../../interface/services/common';
import {IPandoraAdapter} from '../../interface/adapter/IPandoraAdapter';
import {IRemoteExecuteAdapter} from '../../interface/adapter/IRemoteExecuteAdapter';

@scope(ScopeEnum.Singleton)
@provide('pandoraAdapter')
export class PandoraAdapter implements IPandoraAdapter {

  @inject('remoteExecuteAdapter')
  protected remoteExecuteAdapter: IRemoteExecuteAdapter;

  @config('pandora')
  protected config;

  async invokeRestful(host: HostSelector, url) {
    const pandoraRestfulPort = this.config.restfulPort;
    url = url.replace(/^\//, '');
    const cmd = `curl http://${host.ip}:${pandoraRestfulPort}/${url} 2>/dev/null`;
    const res = await this.remoteExecuteAdapter.exec(host, cmd);
    return JSON.parse(res);
  }

  async getDebuggableProcesses(options: HostSelector & AppSelector) {

    const { scopeName, ip } = options;
    const url = `/process?appName=${scopeName}`;
    const res = await this.invokeRestful(options, url);
    const debuggableProcesses = res.data;

    for (const process of debuggableProcesses) {
      const cmd = `curl http://127.0.0.1:${process.debugPort}/json/list 2>/dev/null`;
      const jobResRaw = await this.remoteExecuteAdapter.exec(options, cmd);
      let listRes;
      try {
        listRes = JSON.parse(jobResRaw);
      } catch (err) {
        throw new Error('Cannot get debugging info at ' + ip);
      }
      if (!listRes || !listRes.length) {
        throw new Error('Cannot get debugging info at ' + ip);
      }
      const uuid: string = listRes[0].id;
      const wsUrl: string = `ws://${ip}:${process.debugPort}/${uuid}`;
      process.webSocketDebuggerUrl = wsUrl;
    }

    return debuggableProcesses;

  }

}
