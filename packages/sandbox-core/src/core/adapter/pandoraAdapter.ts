import { inject, config } from 'midway-web';
import {AppSelector, HostSelector} from '../../interface/services/common';
import {IPandoraAdapter} from '../../interface/adapter/IPandoraAdapter';
import {IRemoteExecuteAdapter} from '../../interface/adapter/IRemoteExecuteAdapter';
import {parse as urlparse} from 'url';

export class PandoraAdapter implements IPandoraAdapter {

  @inject('remoteExecuteAdapter')
  protected remoteExecuteAdapter: IRemoteExecuteAdapter;

  @config('pandora')
  protected config;

  async invokeRestful(host: HostSelector, url: string, options?: any) {
    const pandoraRestfulPort = this.config.restfulPort;
    url = url.replace(/^\//, '');
    const cmd = `curl http://127.0.0.1:${pandoraRestfulPort}/${url} 2>/dev/null`;
    const res = await this.remoteExecuteAdapter.exec(host, cmd, options).catch((err) => {
      if (err.message === 'CALL_ERROR: exit 7') {
        err.message = '请求 Pandora 失败，请确保 pandora agent 已正常启动';
      }
      throw err;
    });
    return JSON.parse(res);
  }

  async getProcessesInfo(scopeName: string, ip: string, options?: any): Promise<any[]> {
    const result = await this.invokeRestful({ ip }, `/process`, options);
    const processes = result.data;
    if (!processes || !Array.isArray(processes) || processes.length < 1) {
      throw new Error('获取 Debug 进程列表失败: ' + JSON.stringify(result));
    }
    return processes;
  }

  async getDebuggableProcesses(scopeInfo: HostSelector & AppSelector, options?: any) {

    const { scopeName, ip } = scopeInfo;
    let debuggableProcesses = await this.getProcessesInfo(scopeName, ip, options);

    if (debuggableProcesses[0].v >= 2) {
      await Promise.all(debuggableProcesses.map((process) => {
        return this.invokeRestful(scopeInfo, `/remote-debug/open-port?pid=${process.pid}`, options);
      }));
      debuggableProcesses = await this.getProcessesInfo(scopeName, ip, options);
      for (const process of debuggableProcesses) {
        process.debugPort = process.inspectorUrl ? urlparse(process.inspectorUrl).port : null;
      }
    }

    const tasks = debuggableProcesses.map((process) => {
      if (!process.debugPort) {
        return null;
      }
      const cmd = `curl http://127.0.0.1:${process.debugPort}/json/list 2>/dev/null`;
      return this.remoteExecuteAdapter.exec(scopeInfo, cmd, options)
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

  async getInspectorState(scopeInfo: HostSelector & AppSelector, options?: any): Promise<{ v: number, opened: boolean }> {
    const url = `/process`;
    const debuggableProcesses = (await this.invokeRestful(scopeInfo, url, options)).data;
    if (debuggableProcesses[0].v >= 2) {
      const opened = debuggableProcesses.some((proc) => proc.inspectorUrl);
      return { v: debuggableProcesses[0].v, opened };
    } else {
      return { v: 1, opened: true };
    }
  }

  async closeDebugPortByHost(scopeInfo: HostSelector & AppSelector, options?: any): Promise<{ v: number, opened: boolean }> {
    const url = `/process`;
    const debuggableProcesses = (await this.invokeRestful(scopeInfo, url, options)).data;

    if (debuggableProcesses[0].v >= 2) {
      await Promise.all(debuggableProcesses.map((process) => {
        return this.invokeRestful(scopeInfo, `/remote-debug/close-port?pid=${process.pid}`, options);
      }));
    }

    return this.getInspectorState(scopeInfo, options);
  }

}
