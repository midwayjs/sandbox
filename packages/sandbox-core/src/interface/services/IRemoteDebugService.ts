import { HostSelector, AppSelector, UserSelector, DebuggableHost } from './common';
import { IPandoraAdapter } from '../adapter/IPandoraAdapter';

export interface IRemoteDebugService {

  pandoraAdapter: IPandoraAdapter;
  getDebuggableHost(options: HostSelector & AppSelector & UserSelector): Promise<DebuggableHost>;
  getInspectorState(options: HostSelector & AppSelector);
  closeDebugPortByHost(options: HostSelector & AppSelector);
}
