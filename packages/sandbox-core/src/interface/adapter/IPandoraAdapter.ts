import {AppSelector, HostSelector} from '../services/common';

export interface IPandoraAdapter {
  // TODO: 补全类型信息
  getDebuggableProcesses(options: HostSelector & AppSelector): Promise<any[]>;
  invokeRestful(host: HostSelector, url): Promise<string>;
}
