import { TracingSelector, AppSelector, ListResult,
  AppComplexSelector } from '../../interface/services/common';
import { inject, provide } from 'midway-mirror';
import * as assert from 'assert';
import { KeyTrace } from '../../interface/models/keyTrace';
import {TraceSummary, Trace, TraceSummaryTrend} from '../../interface/models/trace';
import * as moment from 'moment';
import { timeFormat } from '../../app/util/date';
import { SpansSummaryTrendResult, SpanTargetList, SummaryTrend,
  TraceNode, TraceNodeSummary } from '../../interface/models/traceNode';
import {TraceManager} from '../manager/traceManager';
import {TraceNodeManager} from '../manager/traceNodeManager';
import {KeyTraceManager} from '../manager/keyTraceManager';

@provide('traceService')
export class TraceService {

  @inject()
  traceManager: TraceManager;

  @inject()
  traceNodeManager: TraceNodeManager;

  @inject()
  keyTraceManager: KeyTraceManager;

  async listFocusTraces(options: AppSelector): Promise<ListResult<KeyTrace>> {
    options = this.optionsCheck(options, ['scope', 'scopeName']);
    const data = await this.keyTraceManager.listKeyTraces({
      scope: options.scope,
      scopeName: options.scopeName,
    });
    return {
      total: data.count,
      data: data.rows,
    };
  }

  async listTraces(options: AppComplexSelector): Promise<ListResult<TraceSummary>> {
    options = this.optionsCheck(options, ['scope', 'scopeName'], 30);
    const data = await this.traceManager.traceSummaryList(options);
    return {
      total: data.length,
      data,
    };
  }

  async traceDetail(options: AppComplexSelector & TracingSelector): Promise<Trace> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'startTime', 'endTime', 'uuid'], 30);
    return this.traceManager.traceDetail(options);
  }

  async toggleTraceFocus(keyTrace: Partial<KeyTrace>): Promise<[KeyTrace, boolean]> {
    keyTrace = this.optionsCheck(keyTrace, ['scope', 'scopeName', 'traceName']);
    return this.keyTraceManager.upsert({
      scope: keyTrace.scope,
      scopeName: keyTrace.scopeName,
      traceName: keyTrace.traceName,
      focus: !keyTrace.focus ? 1 : 0,
    });
  }

  async traceTotalitySummary(options: AppComplexSelector): Promise<TraceSummary> {
    options = this.optionsCheck(options, ['scope', 'scopeName'], 30);
    return this.traceManager.traceTotalitySummary(options);
  }

  async spanTotalitySummary(options: AppComplexSelector): Promise<TraceNodeSummary> {
    options = this.optionsCheck(options, ['scope', 'scopeName'], 30);

    return this.traceNodeManager.spanTotalitySummary(options);
  }

  async traceSummaryTrend(options: AppComplexSelector): Promise<ListResult<TraceSummaryTrend>> {
    options = this.optionsCheck(options, ['scope', 'scopeName'], 30, 60);
    return this.traceManager.traceSummaryTrend(options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async listTraceByName(options: AppComplexSelector & TracingSelector): Promise<ListResult<Trace>> {
    options = this.optionsCheck(options, ['scope', 'scopeName'], 30);
    return this.traceManager.listTraceByName(options).then((data) => {
      return {
        total: data.count,
        data: data.rows,
      };
    });
  }

  async traceSummary(options: AppComplexSelector & TracingSelector): Promise<TraceSummary> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'traceName'], 30);
    return this.traceManager.traceSummary(options);
  }

  async traceNodeSummaryList(options: AppComplexSelector & TracingSelector): Promise<ListResult<TraceNodeSummary>> {
    options = this.optionsCheck(options, ['scope', 'scopeName'], 30);
    return this.traceNodeManager.traceNodeSummaryList(options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async traceNodeSummary(options: AppComplexSelector & TracingSelector): Promise<TraceNodeSummary> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName'], 30);
    return this.traceNodeManager.traceNodeSummary(options);
  }

  async traceNodeSummaryTrend(options: AppComplexSelector & TracingSelector): Promise<ListResult<SummaryTrend>> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName'], 30, 60);
    return this.traceNodeManager.traceNodeSummaryTrend(options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async spanTargetList(options: AppComplexSelector & TracingSelector): Promise<ListResult<SpanTargetList>> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName'], 30);
    return this.traceNodeManager.spanTargetList(options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async spanTargetSummaryTrend(options: AppComplexSelector & TracingSelector): Promise<ListResult<SummaryTrend>> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName', 'spanTarget'], 30, 60);
    return this.traceNodeManager.spanTargetSummaryTrend(options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async listNodesByTarget(options: AppComplexSelector & TracingSelector): Promise<ListResult<TraceNode>> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName', 'spanTarget'], 30);
    return this.traceNodeManager.listNodesByTarget(options).then((data) => {
      return {
        total: data.count,
        data: data.rows,
      };
    });
  }

  async spansSummaryTrend(options: AppComplexSelector & TracingSelector): Promise<SpansSummaryTrendResult> {
    options = this.optionsCheck(options, ['scope', 'scopeName'], 30, 60);

    return this.traceNodeManager.spansSummaryTrend(options);
  }

  async traceFlowHistogram(options: AppComplexSelector): Promise<ListResult<any>> {
    options = this.optionsCheck(options, ['scope', 'scopeName', 'env'], 30);
    return this.traceManager.traceFlowHistogram(options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  private optionsCheck(options, required: string[], defaultDuration?: number, defaultInterval?: number): AppComplexSelector & AppSelector {
    required.forEach((r) => {
      assert(options[r], `${r} is needed.`);
    });

    if (defaultDuration) {
      const endTime = options.endTime || moment();
      const startTime = options.startTime || moment(endTime).subtract(defaultDuration, 'minutes');

      options.startTime = timeFormat(startTime);
      options.endTime = timeFormat(endTime);
    }

    if (defaultInterval) {
      options.interval = 60;
    }

    return options;
  }
}
