import { provide, inject } from 'midway-web';
import { Op, FindOptions, UpdateOptions, WhereAttributeHash } from 'sequelize';
import { SandboxApplication } from '../../interface/models/application';
import { FindAndCountAllResult, ScopeInfo } from '../../interface/models/common';

@provide('applicationManager')
export class ApplicationManager {

  @inject()
  protected applicationModel;

  public async list(condition: FindOptions): Promise<FindAndCountAllResult<SandboxApplication>> {
    return this.applicationModel.findAndCount(condition);
  }

  public async listByUser(uid: string, options?: FindOptions) {
    const condition: FindOptions = {
      where: {
        [Op.or]: [
          {
            owner: uid,
          },
        ],
        deleted: 0,
      },
      raw: true,
    };
    if (options.attributes) {
      condition.attributes = options.attributes;
    }
    if (options.offset !== undefined && options.limit !== undefined) {
      condition.offset = options.offset;
      condition.limit = options.limit;
    }
    return this.list(condition);
  }

  public async findByScope(scopeInfo: ScopeInfo & WhereAttributeHash): Promise<SandboxApplication | null> {
    const condition: FindOptions = {
      where: scopeInfo,
      raw: true,
    };
    return this.applicationModel.findOne(condition);
  }

  public async create(application: Partial<SandboxApplication>): Promise<SandboxApplication> {
    return this.applicationModel.create(application, {
      raw: true,
    });
  }

  public async update(application: Partial<SandboxApplication>, options?: UpdateOptions)
  : Promise<[number, SandboxApplication]> {
    return this.applicationModel.update(application, options);
  }

  public async delete(application: Partial<SandboxApplication>): Promise<[number, SandboxApplication]> {
    return this.update({
      deleted: 1,
    }, {
      where: application,
    });
  }

}
