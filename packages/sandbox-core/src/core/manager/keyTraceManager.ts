import { logger, provide, inject } from 'midway-mirror';
import { FindAndCountAllResult, ModelQueryOptions } from '../../interface/models/common';
import { FindOptions } from 'sequelize';
import { KeyTrace } from '../../interface/models/keyTrace';
import * as md5 from 'md5';

@provide('keyTraceManager')
export class KeyTraceManager {

  @logger()
  logger;

  @inject()
  dw;

  @inject()
  protected keyTraceModel;

  public async list(condition: FindOptions<KeyTrace>): Promise<FindAndCountAllResult<KeyTrace>> {
    return this.keyTraceModel.findAndCount(condition);
  }

  public async listKeyTraces(query: Partial<KeyTrace>, options?: ModelQueryOptions): Promise<FindAndCountAllResult<KeyTrace>> {
    this.logger.info(`list key traces by application: [${query.scopeName}@${query.scope}].`);
    const condition: FindOptions<KeyTrace> = {
      attributes: {
        exclude: ['hash'],
      },
      where: {
        scope: query.scope,
        scopeName: query.scopeName,
        focus: 1,
        deleted: 0,
      },
      order: [['focus', 'DESC'], ['gmtModified', 'DESC']],
      raw: true,
    };
    if (options) {
      if (options.attributes) {
        // 类型定义'或'关系有问题
        (condition.attributes as any).include = options.attributes;
      }
      if (options.offset !== undefined && options.limit !== undefined) {
        condition.offset = options.offset;
        condition.limit = options.limit;
      }
    }
    return this.list(condition);
  }

  public async upsert(trace: Partial<KeyTrace>): Promise<[KeyTrace, boolean]> {
    const ukStr = md5(`${trace.scope}|${trace.scopeName}|${trace.traceName}`);
    this.logger.info(`[${trace.scopeName}@${trace.scope}] [${trace.traceName}] [${ukStr}] upsert key trace.`);
    trace.hash = ukStr;
    return this.keyTraceModel.upsert(trace);
  }
}
