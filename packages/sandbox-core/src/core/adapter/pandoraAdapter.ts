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
    const res = await this.remoteExecuteAdapter.exec(host, cmd).catch((err) => {
      if (err.message === 'CALL_ERROR: exit 7') {
        err.message = '请求 Pandora 失败，请确保 pandora agent 已正常启动';
      }
      throw err;
    });
    return JSON.parse(res);
  }

  async getProcessesInfo(scopeName: string, ip: string): Promise<any[]> {
    const result = await this.invokeRestful({ ip }, `/process?appName=${scopeName}`);
    const processes = result.data;
    if (!processes || !Array.isArray(processes) || processes.length < 1) {
      throw new Error('获取 Debug 进程列表失败: ' + JSON.stringify(result));
    }
    return processes;
  }

  async getDebuggableProcesses(options: HostSelector & AppSelector) {

    const { scopeName, ip } = options;
    let debuggableProcesses = await this.getProcessesInfo(scopeName, ip);

    if (debuggableProcesses[0].v >= 2) {
      await Promise.all(debuggableProcesses.map((process) => {
        return this.invokeRestful(options, `/remote-debug/open-port?pid=${process.pid}`);
      }));
      debuggableProcesses = await this.getProcessesInfo(scopeName, ip);
      for (const process of debuggableProcesses) {
        process.debugPort = process.inspectorUrl ? urlparse(process.inspectorUrl).port : null;
      }
    }

    const tasks = debuggableProcesses.map((process) => {
      if (!process.debugPort) {
        return null;
      }
      const cmd = `curl http://127.0.0.1:${process.debugPort}/json/list 2>/dev/null`;
      return this.remoteExecuteAdapter.exec(options, cmd)
        .then((jobResRaw) => {
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
          return process;
        });
    }).filter((p) => p);

    return Promise.all(tasks) as any;
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
