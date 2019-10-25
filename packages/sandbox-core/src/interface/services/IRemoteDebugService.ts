import { HostSelector, AppSelector, UserSelector, DebuggableHost } from './common';

export interface IRemoteDebugService {
  getDebuggableHost(options: HostSelector & AppSelector & UserSelector): Promise<DebuggableHost>;
  getInspectorState(options: HostSelector & AppSelector);
  closeDebugPortByHost(options: HostSelector & AppSelector);
}
