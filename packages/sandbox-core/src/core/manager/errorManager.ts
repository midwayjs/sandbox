import { logger, provide, inject, async } from 'midway-web';
import * as _ from 'lodash';
import * as Interface from '../../interface/services/IErrorService';
import * as Sequelize from 'sequelize';

interface SearchCondition {
  [key: string]: any;
}

@async()
@provide('errorManager')
export class ErrorManager {

  @logger()
  protected logger;

  @inject()
  protected errorModel;

  public async findErrors(options: Interface.QueryErrorOptions) {
    const conditions: any[] = [
      {scope: options.scope},
      {scopeName: options.scopeName},
      {env: options.env},
      {timestamp: {
          [Sequelize.Op.gte]: options.startTime,
          [Sequelize.Op.lte]: options.endTime,
        }},
    ];

    if (options.ip) { conditions.push({ip: options.ip}); }

    const ors: any[] = [];
    if (options.errType && options.errType.length > 0 && _.isArray(options.errType)) {
      _.each(options.errType, (et) => ors.push({errorType: et}));
      conditions.push({[Sequelize.Op.or]: ors});
    }

    // 关键字搜索
    if (options.keyword) {
      if (options.in === 'traceId') {
        // 按 traceId 搜索
        conditions.push({
          traceId: {
            [Sequelize.Op.like]: `%${options.keyword}%`,
          },
        });
      } else if (options.in === 'errorType') {
        // 按 errorType 搜索
        conditions.push({
          errorType: {
            [Sequelize.Op.like]: `%${options.keyword}%`,
          },
        });
      } else if (options.in === 'machine') {
        // 按机器搜索
        const machineFilter = [
          {
            ip: {
              [Sequelize.Op.like]: `%${options.keyword}%`,
            },
          },
          {
            hostname: {
              [Sequelize.Op.like]: `%${options.keyword}%`,
            },
          },
        ];

        conditions.push({[Sequelize.Op.or]: machineFilter});
      } else {
        // 按 errorMessage、errorStack 搜索
        const messageFilter = [
          {
            errorMessage: {
              [Sequelize.Op.like]: `%${options.keyword}%`,
            },
          },
          {
            errorStack: {
              [Sequelize.Op.like]: `%${options.keyword}%`,
            },
          },
        ];

        conditions.push({[Sequelize.Op.or]: messageFilter});
      }
    }

    return this.errorModel.findAndCount({
      where: { [Sequelize.Op.and]: conditions },
      order: [[ 'timestamp', 'desc' ]],
      offset: (options.page - 1) * options.pageSize,
      limit: options.pageSize,
      raw: true,
    });
  }

  public async findErrorTypes(options: Interface.QueryErrorOptions) {

    const st: number = options.startTime;
    const et: number = options.endTime;

    const required: object[] = [
      {scope: options.scope},
      {scopeName: options.scopeName},
      {env: options.env},
      {timestamp: {
          [Sequelize.Op.gte]: st, [Sequelize.Op.lte]: et,
        }},
    ];
    const tasks: any[] = [
      this.findErrorPaths(required),
      this.findErrorTypeBy(required),
      this.findErrorTypeDist(required),
    ];
    return Promise.all(tasks).catch((err) => this.logger.error(err));
  }

  private findErrorPaths(required: object[]) {
    const conditions: SearchCondition = {
      attributes: [['log_path', 'path']],
      where: { [Sequelize.Op.and]: required },
      group: ['path'],
      raw: true,
    };
    return this.errorModel.findAll(conditions);
  }

  private findErrorTypeBy(required: object[]) {
    const conditions: SearchCondition = {
      attributes: [
        ['error_type', 'errType'],
        [Sequelize.fn('COUNT', Sequelize.literal('*')), 'cnt'],
      ],
      where: { [Sequelize.Op.and]: required },
      group: ['errType'],
      raw: true,
    };
    return this.errorModel.findAll(conditions);
  }

  private findErrorTypeDist(required: object[]) {
    const downSampling = Sequelize.literal('(unix_timestamp - unix_timestamp % 60)');
    const conditions: SearchCondition = {
      attributes: [
        ['error_type', 'errType'],
        [Sequelize.fn('COUNT', Sequelize.literal('*')), 'cnt'],
        [downSampling, 'timestamp'],
      ],
      where: { [Sequelize.Op.and]: required },
      group: [downSampling, 'errType'],
      order: [['timestamp', 'DESC']],
      raw: true,
    };
    return this.errorModel.findAll(conditions);
  }
}
