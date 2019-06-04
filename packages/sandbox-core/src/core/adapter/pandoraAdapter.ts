import { inject, provide, scope, ScopeEnum, config } from 'midway-web';
import {AppSelector, HostSelector} from '../../interface/services/common';
import {IPandoraAdapter} from '../../interface/adapter/IPandoraAdapter';
import {IRemoteExecuteAdapter} from '../../interface/adapter/IRemoteExecuteAdapter';
import {parse as urlparse} from 'url';

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
    const cmd = `curl http://127.0.0.1:${pandoraRestfulPort}/${url} 2>/dev/null`;
    const res = await this.remoteExecuteAdapter.exec(host, cmd);
    return JSON.parse(res);
  }

  async getDebuggableProcesses(options: HostSelector & AppSelector) {

    const { scopeName, ip } = options;
    const url = `/process?appName=${scopeName}`;
    let debuggableProcesses = (await this.invokeRestful(options, url)).data;

    if (debuggableProcesses[0].v >= 2) {
      await Promise.all(debuggableProcesses.map((process) => {
        return this.invokeRestful(options, `/remote-debug/open-port?pid=${process.pid}`);
      }));
      debuggableProcesses = (await this.invokeRestful(options, url)).data;
      for (const process of debuggableProcesses) {
        process.debugPort = process.inspectorUrl ? urlparse(process.inspectorUrl).port : null;
      }
    }

    const finalRet: any = [];
    for (const process of debuggableProcesses) {
      if (!process.debugPort) {
         continue;
       }
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
      finalRet.push(process);
    }

    return finalRet;

  }

  async getInspectorState(options: HostSelector & AppSelector): Promise<{ v: number, opened: boolean }> {
    const url = `/process?appName=${options.scopeName}`;
    const debuggableProcesses = (await this.invokeRestful(options, url)).data;
    if (debuggableProcesses[0].v >= 2) {
      const opened = debuggableProcesses.some((proc) => proc.inspectorUrl);
      return { v: debuggableProcesses[0].v, opened };
    } else {
      return { v: 1, opened: true };
    }
  }

  async closeDebugPortByHost(options: HostSelector & AppSelector): Promise<{ v: number, opened: boolean }> {
    const url = `/process?appName=${options.scopeName}`;
    const debuggableProcesses = (await this.invokeRestful(options, url)).data;

    if (debuggableProcesses[0].v >= 2) {
      await Promise.all(debuggableProcesses.map((process) => {
        return this.invokeRestful(options, `/remote-debug/close-port?pid=${process.pid}`);
      }));
    }

    return this.getInspectorState(options);
  }

}
