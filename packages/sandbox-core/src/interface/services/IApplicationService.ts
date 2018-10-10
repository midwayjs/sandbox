import {ModelQueryOptions, ScopeInfo} from '../models/common';
import {AppSelector, ListResult} from './common';
import {SandboxApplication} from '../models/application';
import {IPlatformGroup, IPlatformHost, IPlatformHostResult} from '../adapter/IPlatformAdapter';
import {SandboxGroup} from '../models/group';

export interface IApplicationService {

  /**
   * @description 获取应用信息
   * @param {String} uid
   * @param {ModelQueryOptions} options
   * @returns {Promise<ListResult<SandboxApplication>>}
   */
  listByUser(uid: string, options?: ModelQueryOptions): Promise<ListResult<SandboxApplication>>;

  /**
   * @description 获取组信息
   * @param {ScopeInfo} application
   * @returns {Promise<IPlatformHostResult<IPlatformHost>>}
   */
  queryGroups(application: ScopeInfo): Promise<IPlatformHostResult<IPlatformGroup>>;

  queryHosts(options: AppSelector): Promise<IPlatformHost[]>;
  groupExist(group: Partial<SandboxGroup>): Promise<number>;
  groupUpsert(group: Partial<SandboxGroup>): Promise<[SandboxGroup, boolean]>;
  groupDelete(group: Partial<SandboxGroup>): Promise<[SandboxGroup, boolean]>;
}
