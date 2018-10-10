import {HostSelector} from '../services/common';

export interface IRemoteExecuteAdapter {
  exec(host: HostSelector, cmd): Promise<string>;
}
