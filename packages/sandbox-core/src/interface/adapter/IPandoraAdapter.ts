import {AppSelector, HostSelector} from '../services/common';

export interface IPandoraAdapter {
  invokeRestful(host: HostSelector, url: string, options?: any);
  getProcessesInfo(scopeName: string, ip: string, options?: any): Promise<any[]>;
  getDebuggableProcesses(scopeInfo: HostSelector & AppSelector, options?: any);
  getInspectorState(scopeInfo: HostSelector & AppSelector, options?: any): Promise<{ v: number, opened: boolean }>;
  closeDebugPortByHost(scopeInfo: HostSelector & AppSelector, options?: any): Promise<{ v: number, opened: boolean }>;
}
