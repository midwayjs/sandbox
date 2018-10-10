import { provide, logger, inject, async } from 'midway-mirror';
import * as assert from 'assert';
import { ModelQueryOptions, ScopeInfo } from '../../interface/models/common';
import { SandboxApplication } from '../../interface/models/application';
import {IPlatformGroup, IPlatformHost, IPlatformHostResult} from '../../interface/adapter/IPlatformAdapter';
import {AppSelector, ListResult} from '../../interface/services/common';
import { SandboxGroup } from '../../interface/models/group';
import { IApplicationService } from '../../interface/services/IApplicationService';
import { optionsCheck } from '../util/util';
import {ApplicationManager} from '../manager/applicationManager';
import {PlatformManagerAdapter} from '../adapter/platformManagerAdapter';
import {GroupManager} from '../manager/groupManager';

@async()
@provide('applicationService')
export class ApplicationService implements IApplicationService {

  @logger()
  private logger;

  @inject()
  private applicationManager: ApplicationManager;

  @inject()
  private groupManager: GroupManager;

  @inject()
  private platformManagerAdapter: PlatformManagerAdapter;

  async listByUser(uid: string, options?: ModelQueryOptions): Promise<ListResult<SandboxApplication>> {
    assert(uid, 'uid can\'t be null');
    options = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      attributes: ['id', 'scope', 'scopeName', 'flag'], ...options};

    this.logger.info(`list applications for user [${uid}]`);
    return this.applicationManager.listByUser(uid, options).then((data) => {
      return { total: data.count, data: data.rows };
    });
  }

  async queryGroups(application: ScopeInfo): Promise<IPlatformHostResult<IPlatformGroup>> {
    assert(application.scope, 'scope should exist');

    this.logger.info(`list platform groups for application [${application.scopeName}@${application.scope}]`);

    const scope = application.scope;
    const adapter = await this.platformManagerAdapter.get(scope);

    // platform hosts
    const result = await adapter.getHosts(application);

    this.logger.info(`list custom groups for application [${application.scopeName}@${application.scope}]`);

    try {
      // custom hosts
      const customGroups = await this.groupManager.listByApplication(application);
      const customGroups2nd: IPlatformGroup[] = customGroups.rows.map((customGroup) => {
        let hosts = JSON.parse(customGroup.hostList || '[]');
        hosts = hosts.map((host) => {
          return {
            ip: host,
          };
        });
        return {
          name: customGroup.groupName,
          hosts,
        };
      });
      result.custom = customGroups2nd;
    } catch (error) {
      error.name = 'QueryCustomGroupError';
      this.logger.error(error);
    }

    return result;
  }

  async queryHosts(options: AppSelector): Promise<IPlatformHost[]> {
    const { env, scope, scopeName, scopeId } = options;
    const ret = [];
    const groups = await this.queryGroups({ scope, scopeName, scopeId });
    const hostListAtTargetEnv = groups[env];
    for (const subGroup of hostListAtTargetEnv) {
      for (const host of subGroup.hosts) {
        ret.push(host);
      }
    }
    return ret;
  }

  async groupExist(group: Partial<SandboxGroup>): Promise<number> {
    optionsCheck(group, ['scope', 'scopeName', 'groupName']);
    return this.groupManager.has(group);
  }

  async groupUpsert(group: Partial<SandboxGroup>): Promise<[SandboxGroup, boolean]> {
    optionsCheck(group, ['scope', 'scopeName', 'groupName']);

    return this.groupManager.upsert({
      scope: group.scope,
      scopeName: group.scopeName,
      groupName: group.groupName,
      hostList: JSON.stringify(group.hostList || []),
      deleted: 0,
    });
  }

  async groupDelete(group: Partial<SandboxGroup>): Promise<[SandboxGroup, boolean]> {
    optionsCheck(group, ['scope', 'scopeName', 'groupName']);

    return this.groupManager.upsert({
      scope: group.scope,
      scopeName: group.scopeName,
      groupName: group.groupName,
      deleted: 1,
    });
  }
}
