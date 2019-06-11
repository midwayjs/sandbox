import { logger, provide, inject, init } from 'midway-web';
import { FindAndCountAllResult } from '../../interface/models/common';
import { FindOptions, QueryTypes, Op, OrderItem } from 'sequelize';
import {
  Trace,
  TraceQuery,
  TraceSummaryQuery,
  TraceSummary,
  TraceSummaryTrend,
  TraceSummaryTrendQuery,
  TraceDetailQuery,
} from '../../interface/models/trace';
import { isEmpty, round } from 'lodash';
import {sqlPartTimestampConvertToTs} from '../util/util';

@provide('traceManager')
export class TraceManager {

  @logger()
  protected logger;

  @inject()
  protected dw;

  @inject()
  protected traceModel;
  protected instance;

  @init()
  initialize() {
    this.instance = this.dw.instance;
  }

  escape(query: object, fields: string[]): void {
    fields.forEach((field) => {
      if (query[field] !== undefined) {
        query[field] = this.instance.escape(query[field]);
      }
    });
  }

  async list(condition: FindOptions): Promise<FindAndCountAllResult<Trace>> {
    return this.traceModel.findAndCount(condition);
  }

  async traceSummaryList(query: TraceQuery, options?: FindOptions): Promise<TraceSummary[]> {
    this.escape(query, ['scope', 'scopeName', 'startTime', 'endTime', 'env', 'hostname', 'ip']);
    if (options) {
      this.escape(options, ['order', 'limit', 'offset']);
    }

    const {
      scope,
      scopeName,
      startTime,
      endTime,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${startTime} - ${endTime}] trace summary list.`);

    let envFilter = '';
    let hostFilter = '';
    let ipFilter = '';

    if (query.env) {
      envFilter = `and env=${query.env}`;
    }

    if (query.hostname) {
      hostFilter = `and hostname=${query.hostname}`;
    } else if (query.ip) {
      ipFilter = `and ip=${query.ip}`;
    }

    let sql = `
      select
        T1.trace_name as traceName,
        rt,
        total,
        if(fail is null, total, total - fail) / total as successRate
      from
        (
          select
            trace_name,
            avg(trace_duration) as rt,
            count(1) as total
          from
            sandbox_galaxy_sls_traces
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName} ${envFilter} ${hostFilter} ${ipFilter}
          group by trace_name
        ) T1
        left join
        (
          select
            trace_name,
            count(1) as fail
          from
            sandbox_galaxy_sls_traces
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and (trace_status&4 = 4 or trace_status&8 = 8) ${envFilter} ${hostFilter} ${ipFilter}
          group by trace_name
        ) T2
        on T1.trace_name = T2.trace_name
      `;

    if (options && options.limit !== undefined && options.offset !== undefined && options.order !== undefined) {
      sql += `order by ${options.order} limit ${options.limit} offset ${options.offset}`;
    }

    return this.instance.query(
      sql,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    ).then((rows) => {
      return rows.map((row) => {
        return [round(row.rt, 2), row.total, round(row.successRate * 100, 2), row.traceName];
      });
    });
  }

  async traceSummary(query: TraceSummaryQuery): Promise<TraceSummary> {
    this.escape(query, ['scope', 'scopeName', 'traceName', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      traceName,
      startTime,
      endTime,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName || 'all'}] [${startTime} - ${endTime}] summary.`);

    let envFilter = '';
    let hostFilter = '';
    let ipFilter = '';
    let traceFilter = '';

    if (query.env) {
      envFilter = `and env=${query.env}`;
    }

    if (query.hostname) {
      hostFilter = `and hostname=${query.hostname}`;
    } else if (query.ip) {
      ipFilter = `and ip=${query.ip}`;
    }

    if (traceName) {
      traceFilter = `and trace_name=${traceName}`;
    }

    return this.instance.query(
      `
      select
        rt,
        total,
        (total - fail) / total as successRate
      from (
        select
          avg(trace_duration) as rt,
          count(1) as total,
          sum(IF(trace_status&4 = 4 or trace_status&8 = 8, 1, 0)) as fail
        from sandbox_galaxy_sls_traces
        where
          timestamp between ${startTime} and ${endTime}
          and scope=${scope}
          and scope_name=${scopeName} ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
      ) T1
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    ).then((row) => {
      row = row[0];

      if (!isEmpty(row)) {
        return [round(row.rt, 2), row.total, round(row.successRate * 100, 2)];
      } else {
        return [];
      }
    });
  }

  async traceSummaryTrend(query: TraceSummaryTrendQuery): Promise<TraceSummaryTrend[]> {
    this.escape(query, ['scope', 'scopeName', 'traceName', 'interval', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      traceName,
      startTime,
      endTime,
      interval,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName || 'all'}] [${startTime} - ${endTime}] [${interval}] trend.`);

    let envFilter = '';
    let hostFilter = '';
    let ipFilter = '';
    let traceFilter = '';

    if (query.env) {
      envFilter = `and env=${query.env}`;
    }

    if (query.hostname) {
      hostFilter = `and hostname=${query.hostname}`;
    } else if (query.ip) {
      ipFilter = `and ip=${query.ip}`;
    }

    if (traceName) {
      traceFilter = `and trace_name=${traceName}`;
    }

    return this.instance.query(
      `
      select
        from_unixtime(T1.m_timestamp) as timestamp,
        rt,
        total,
        if(fail is null, total, total - fail) / total as successRate
      from
        (
          select
            floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
            avg(trace_duration) as rt,
            count(1) as total
          from sandbox_galaxy_sls_traces
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName} ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
          group by
            m_timestamp
        ) T1
        left join
        (
          select
            floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
            count(1) as fail
          from sandbox_galaxy_sls_traces
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and (trace_status&4 = 4 or trace_status&8 = 8) ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
          group by
            m_timestamp
        ) T2
        on T1.m_timestamp = T2.m_timestamp
      where T1.m_timestamp = floor(T1.m_timestamp / ${interval}) * ${interval}
      order by timestamp desc
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    ).then((rows) => {
      return rows.map((row) => {
        return [row.timestamp, round(row.rt, 2), row.total, round(row.successRate * 100, 2)];
      });
    });
  }

  async listTraceByName(query: TraceSummaryQuery, options?: FindOptions): Promise<FindAndCountAllResult<Trace>> {
    const {
      scope,
      scopeName,
      traceName,
      startTime,
      endTime,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName || 'all'}] [${startTime} - ${endTime}] list traces.`);

    const condition: FindOptions = {
      where: {
        scope,
        scopeName,
        timestamp: {
          [Op.between]: [startTime, endTime],
        },
      },
      raw: true,
    };

    if (traceName) {
      (condition.where as any).traceName = traceName;
    }

    if (query.env) {
      (condition.where as any).env = query.env;
    }

    if (query.hostname) {
      (condition.where as any).hostname = query.hostname;
    } else if (query.ip) {
      (condition.where as any).ip = query.ip;
    }

    if (options) {
      if (options.attributes) {
        condition.attributes = options.attributes;
      }

      if (options.offset !== undefined && options.limit !== undefined) {
        condition.offset = options.offset;
        condition.limit = options.limit;
      }

      if (options.order) {
        // like: timestamp,desc|spanDuration,asc
        condition.order = (<string> options.order).split('|').map((or) => {
          return or.split(',') as OrderItem;
        });
      }
    }

    return this.list(condition);
  }

  async traceTotalitySummary(query: TraceQuery): Promise<TraceSummary> {
    this.escape(query, ['scope', 'scopeName', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      startTime,
      endTime,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${startTime} - ${endTime}] totality summary.`);

    let envFilter = '';
    let hostFilter = '';
    let ipFilter = '';

    if (query.env) {
      envFilter = `and env=${query.env}`;
    }

    if (query.hostname) {
      hostFilter = `and hostname=${query.hostname}`;
    } else if (query.ip) {
      ipFilter = `and ip=${query.ip}`;
    }

    return this.instance.query(
      `
      select
        rt,
        total,
        (total - fail) / total as successRate
      from (
        select
          avg(trace_duration) as rt,
          count(1) as total,
          sum(IF(trace_status&4 = 4 or trace_status&8 = 8, 1, 0)) as fail
        from sandbox_galaxy_sls_traces
        where
          timestamp between ${startTime} and ${endTime}
          and scope=${scope}
          and scope_name=${scopeName} ${envFilter} ${hostFilter} ${ipFilter}
      ) T1
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    ).then((row) => {
      row = row[0];
      if (!isEmpty(row)) {
        return [round(row.rt, 2), row.total, round(row.successRate * 100, 2)];
      } else {
        return [];
      }
    });
  }

  async traceFlowHistogram(query: TraceQuery): Promise<any[]> {
    this.escape(query, ['scope', 'scopeName', 'startTime', 'endTime', 'env']);

    const {
      scope,
      scopeName,
      startTime,
      endTime,
      env,
    } = query;

    return this.instance.query(
      `
      select
        from_unixtime(floor(${sqlPartTimestampConvertToTs}/60)*60) as timestamp,
        substring_index(hostname, '.', -1) as unit,
        count(*) as requests
      from
        sandbox_galaxy_sls_traces
      where
        timestamp between ${startTime} and ${endTime}
        and scope=${scope}
        and scope_name=${scopeName}
        and env=${env}
      group by
        ${sqlPartTimestampConvertToTs} / 60,
        unit;
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
  }

  async traceDetail(query: TraceDetailQuery): Promise<Trace> {

    const condition: FindOptions = {
      where: {
        timestamp: {
          [Op.between]: [query.startTime, query.endTime],
        },
        uuid: query.uuid,
        scope: query.scope,
        scopeName: query.scopeName,
      },
      raw: true,
    };

    if (query.env) {
      (condition.where as Partial<Trace>).env = query.env;
    }

    if (query.ip) {
      (condition.where as Partial<Trace>).ip = query.ip;
    }

    return this.traceModel.findOne(condition);
  }
}
