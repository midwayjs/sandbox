import { logger, provide, inject, init } from 'midway-web';
import { FindOptions, QueryTypes, Op } from 'sequelize';
import { SpanTargetList, TraceNode, TraceNodeQuery, TraceNodeSummary, TraceNodeSummaryQuery, SummaryTrend,
  TraceNodeSummaryTrendQuery, SpanTargetSummaryTrendQuery, SpanTargetQuery, SpanSummaryTrendQuery,
  SpansSummaryTrendResult } from '../../interface/models/traceNode';
import { FindAndCountAllResult, ModelQueryOptions } from '../../interface/models/common';
import { isEmpty, groupBy, each, round } from 'lodash';
import { sqlPartTimestampConvertToTs } from '../util/util';

@provide('traceNodeManager')
export class TraceNodeManager {

  @inject()
  protected dw;

  @logger()
  protected logger;

  @inject()
  protected traceNodeModel;

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

  public async list(condition: FindOptions<TraceNode>): Promise<FindAndCountAllResult<TraceNode>> {
    return this.traceNodeModel.findAndCount(condition);
  }

  public async traceNodeSummaryList(query: TraceNodeQuery): Promise<TraceNodeSummary[]> {
    this.escape(query, ['scope', 'scopeName', 'traceName', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      startTime,
      endTime,
      traceName,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName || 'all'}] [${startTime} - ${endTime}] summary list.`);

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
        T1.span_name as spanName,
        rt,
        total,
        success / total as successRate
      from
        (
          select
            span_name,
            count(1) as total,
            avg(span_duration) as rt
          from
            sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and span_name!='http'
            and span_name!='hsf-server' ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
          group by span_name
        ) T1
        left join
        (
          select
            span_name,
            count(1) as success
          from
            sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and span_error=0
            and span_name!='http'
            and span_name!='hsf-server' ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
          group by span_name
        ) T2
        on T1.span_name=T2.span_name
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    ).then((rows) => {
      return rows.map((row) => {
        return [round(row.rt, 2), row.total, round(row.successRate * 100, 2), row.spanName];
      });
    });
  }

  public async traceNodeSummary(query: TraceNodeSummaryQuery): Promise<TraceNodeSummary> {
    this.escape(query, ['scope', 'scopeName', 'traceName', 'spanName', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      traceName,
      startTime,
      endTime,
      spanName,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName}] [${spanName}] [${startTime} - ${endTime}] summary.`);

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
	      T1.rt as rt,
	      T1.total as total,
	      T2.success / T1.total as successRate
      from
	      (
	        select
	          avg(span_duration) as rt,
	          count(1) as total
          from
            sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and trace_name=${traceName}
            and span_name=${spanName} ${envFilter} ${hostFilter} ${ipFilter}
	      ) T1,
	      (
	        select
	          count(1) as success
          from
            sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and trace_name=${traceName}
            and span_name=${spanName}
            and span_error=0 ${envFilter} ${hostFilter} ${ipFilter}
        ) T2
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

  public async traceNodeSummaryTrend(query: TraceNodeSummaryTrendQuery): Promise<SummaryTrend[]> {
    this.escape(query, ['scope', 'scopeName', 'traceName', 'spanName', 'interval', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      startTime,
      endTime,
      traceName,
      spanName,
      interval,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName}] [${spanName}] [${startTime} - ${endTime}] [${interval}] summary trend.`);

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
        from_unixtime(T1.m_timestamp) as timestamp,
        rt,
        total,
        success / total as successRate
      from
        (
          select
            floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
            avg(span_duration) as rt,
            count(1) as total
          from sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and trace_name=${traceName}
            and span_name=${spanName} ${envFilter} ${hostFilter} ${ipFilter}
          group by
            m_timestamp
        ) T1
        left join
        (
          select
            floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
            count(1) as success
          from sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and trace_name=${traceName}
            and span_name=${spanName}
            and span_error=0 ${envFilter} ${hostFilter} ${ipFilter}
          group by
            m_timestamp
        ) T2
        on T1.m_timestamp = T2.m_timestamp
      where
        T1.m_timestamp = floor(T1.m_timestamp / ${interval}) * ${interval}
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

  public async spanTargetList(query: TraceNodeSummaryQuery): Promise<SpanTargetList[]> {
    this.escape(query, ['scope', 'scopeName', 'traceName', 'spanName', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      traceName,
      startTime,
      endTime,
      spanName,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName || 'all'}] [${spanName}] [${startTime} - ${endTime}] targets list.`);

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
        span_target as spanTarget,
        count(1) as total
      from
        sandbox_galaxy_sls_trace_nodes
      where
        timestamp between ${startTime} and ${endTime}
        and scope=${scope}
        and scope_name=${scopeName}
        and span_name=${spanName} ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
      group by spanTarget
      order by total desc
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    ).then((rows) => {
      return rows.map((row) => {
        return [row.spanTarget, row.total];
      });
    });
  }

  public async spanTargetSummaryTrend(query: SpanTargetSummaryTrendQuery): Promise<SummaryTrend[]> {
    this.escape(query, ['scope', 'scopeName', 'traceName', 'spanName', 'interval', 'spanTarget', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      traceName,
      startTime,
      endTime,
      spanName,
      spanTarget,
      interval,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName || 'all'}] [${spanName}] [${spanTarget}] [${startTime} - ${endTime}] [${interval}] summary trend.`);

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
      traceFilter = `and trace_name = ${traceName}`;
    }

    return this.instance.query(
      `
      select
        from_unixtime(T1.m_timestamp) as timestamp,
        rt,
        total,
        success / total as successRate
      from
        (
          select
            floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
            avg(span_duration) as rt,
            count(1) as total
          from sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and span_name=${spanName}
            and span_target=${spanTarget} ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
          group by
            m_timestamp
        ) T1
        left join
        (
          select
            floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
            count(1) as success
          from sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and span_name=${spanName}
            and span_target=${spanTarget}
            and span_error=0 ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
          group by
            m_timestamp
        ) T2
        on T1.m_timestamp = T2.m_timestamp
      where
        T1.m_timestamp=floor(T1.m_timestamp / ${interval}) * ${interval}
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

  public async listNodesByTarget(query: SpanTargetQuery, options?: ModelQueryOptions): Promise<FindAndCountAllResult<TraceNode>> {
    const {
      scope,
      scopeName,
      traceName,
      startTime,
      endTime,
      spanName,
      spanTarget,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName || 'all'}] [${spanName}] [${spanTarget}] [${startTime} - ${endTime}] list nodes.`);

    const condition: FindOptions<TraceNode> = {
      where: {
        scope,
        scopeName,
        timestamp: {
          [Op.between]: [startTime, endTime],
        },
        spanName,
        spanTarget,
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
        condition.order = options.order.split('|').map((or) => {
          return or.split(',');
        });
      }
    }

    return this.list(condition);
  }

  public async spanTotalitySummary(query: TraceNodeQuery): Promise<TraceNodeSummary> {
    this.escape(query, ['scope', 'scopeName', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      startTime,
      endTime,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${startTime} - ${endTime}] span totality summary.`);

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
        T1.span_name as spanName,
        rt,
        total,
        success / total as successRate
      from
        (
          select
            span_name,
            count(1) as total,
            avg(span_duration) as rt
          from
            sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName} ${envFilter} ${hostFilter} ${ipFilter}
          group by span_name
        ) T1
        left join
        (
          select
            span_name,
            count(1) as success
          from
            sandbox_galaxy_sls_trace_nodes
          where
            timestamp between ${startTime} and ${endTime}
            and scope=${scope}
            and scope_name=${scopeName}
            and span_error=0 ${envFilter} ${hostFilter} ${ipFilter}
          group by span_name
        ) T2
        on T1.span_name=T2.span_name
      where T1.span_name!='http' and T1.span_name!='hsf-server'
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      },
    ).then((row) => {
      row = row[0];

      if (!isEmpty(row)) {
        return [round(row.rt, 2), row.total, round(row.successRate * 100, 2), row.spanName];
      } else {
        return [];
      }
    });
  }

  public async spansSummaryTrend(query: SpanSummaryTrendQuery): Promise<SpansSummaryTrendResult> {
    const originQuery = {...query};
    this.escape(query, ['scope', 'scopeName', 'traceName', 'interval', 'startTime', 'endTime', 'env', 'hostname', 'ip']);

    const {
      scope,
      scopeName,
      startTime,
      endTime,
      traceName,
      interval,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName}] [${startTime} - ${endTime}] [${interval}] spans summary trend.`);

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

    if (query.traceName) {
      traceFilter = `and trace_name=${query.traceName}`;
    }

    return Promise.all([
      this._querySpanNames(originQuery),
      this.instance.query(
        `
        select
          from_unixtime(T1.m_timestamp) as timestamp,
          T1.spanName,
          rt,
          total,
          success / total as successRate
        from
          (
            select
              floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
              span_name as spanName,
              avg(span_duration) as rt,
              count(1) as total
            from sandbox_galaxy_sls_trace_nodes
            where
              timestamp between ${startTime} and ${endTime}
              and scope=${scope}
              and scope_name=${scopeName}
              and span_name!='http'
              and span_name!='hsf-server' ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
            group by
              m_timestamp,
              span_name
          ) T1
          left join
          (
            select
              floor(${sqlPartTimestampConvertToTs} / 60) * 60 as m_timestamp,
              span_name as spanName,
              count(1) as success
            from sandbox_galaxy_sls_trace_nodes
            where
              timestamp between ${startTime} and ${endTime}
              and scope=${scope}
              and scope_name=${scopeName}
              and span_error=0
              and span_name!='http'
              and span_name!='hsf-server' ${traceFilter} ${envFilter} ${hostFilter} ${ipFilter}
            group by
              m_timestamp,
              span_name
          ) T2
          on T1.m_timestamp = T2.m_timestamp and T1.spanName = T2.spanName
        where
          T1.m_timestamp=floor(T1.m_timestamp / ${interval}) * ${interval}
        order by timestamp desc
        `,
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
        ),
    ]).then((data) => {
      const types = data[0];
      const rows = groupBy(data[1], 'timestamp');

      const rtResult = [];
      const successRateResult = [];
      const totalResult = [];

      each(rows, (items, timestamp) => {
        const rt = { timestamp };
        const successRate = { timestamp };
        const total = { timestamp };

        items.forEach((item) => {
          const spanName = item.spanName;
          rt[spanName] = round(item.rt, 2);
          successRate[spanName] = round(item.successRate * 100, 2);
          total[spanName] = item.total;
        });

        rtResult.push(rt);
        successRateResult.push(successRate);
        totalResult.push(total);
      });

      return {
        types: types.filter((type) => {
          return type !== 'http' && type !== 'hsf-server';
        }),
        rt: rtResult,
        successRate: successRateResult,
        total: totalResult,
      };
    });
  }

  public async _querySpanNames(query: SpanSummaryTrendQuery): Promise<string[]> {
    const {
      scope,
      scopeName,
      startTime,
      endTime,
      traceName,
      interval,
    } = query;

    this.logger.info(`[${scopeName}@${scope}] [${traceName}] [${startTime} - ${endTime}] [${interval}] spans name.`);

    const condition = {
      attributes: ['spanName'],
      group: ['span_name'],
      raw: true,
      where: {
        scope,
        scopeName,
        timestamp: {
          [Op.between]: [startTime, endTime],
        },
      },
    };

    if (query.env) {
      (condition.where as any).env = query.env;
    }

    if (query.hostname) {
      (condition as any).hostname = query.hostname;
    } else if (query.ip) {
      (condition as any).ip = query.ip;
    }

    if (query.traceName) {
      (condition as any).traceName = query.traceName;
    }

    return this.list(condition).then((data) => {
      return data.rows.map((row) => {
        return row.spanName;
      });
    });
  }

}
