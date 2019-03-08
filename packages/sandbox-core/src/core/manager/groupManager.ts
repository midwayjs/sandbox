import { logger, provide, inject } from 'midway-web';
import { FindOptions } from 'sequelize';
import * as md5 from 'md5';
import { SandboxGroup } from '../../interface/models/group';
import { FindAndCountAllResult, ModelQueryOptions, ScopeInfo } from '../../interface/models/common';

@provide('groupManager')
export class GroupManager {

  @logger()
  protected logger;

  @inject()
  protected groupModel;

  public async list(condition: FindOptions<SandboxGroup>): Promise<FindAndCountAllResult<SandboxGroup>> {
    return this.groupModel.findAndCount(condition);
  }

  public async listByApplication(app: ScopeInfo, options?: ModelQueryOptions): Promise<FindAndCountAllResult<SandboxGroup>> {
    this.logger.info(`list groups by application [${app.scopeName}@${app.scope}].`);
    const condition: FindOptions<SandboxGroup> = {
      attributes: {
        exclude: ['hash'],
      },
      where: {
        scope: app.scope,
        scopeName: app.scopeName,
        deleted: 0,
      },
      raw: true,
    };
    if (options && options.offset !== undefined && options.limit !== undefined) {
      condition.offset = options.offset;
      condition.limit = options.limit;
    }
    return this.list(condition);
  }

  public async has(group: Partial<SandboxGroup>): Promise<number> {
    const condition: FindOptions<SandboxGroup> = {
      where: {
        scope: group.scope,
        scopeName: group.scopeName,
        groupName: group.groupName,
        deleted: 0,
      },
      raw: true,
    };
    return this.groupModel.count(condition);
  }

  public async upsert(group: Partial<SandboxGroup>): Promise<[SandboxGroup, boolean]> {
    const ukStr = md5(`${group.scope}|${group.scopeName}|${group.groupName}`);
    this.logger.info(`[${group.scopeName}@${group.scope}] [${group.groupName}] [${ukStr}] upsert custom group.`);
    group.hash = ukStr;
    return this.groupModel.upsert(group);
  }
}
