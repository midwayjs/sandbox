import { TracingSelector, AppSelector, ListResult,
  AppComplexSelector } from '../../interface/services/common';
import { inject, provide } from 'midway-web';
import * as assert from 'assert';
import { KeyTrace } from '../../interface/models/keyTrace';
import {TraceSummary, Trace, TraceSummaryTrend} from '../../interface/models/trace';
import * as moment from 'moment';
import { timeFormat, toMoment } from '../../app/util/date';
import { SpansSummaryTrendResult, SpanTargetList, SummaryTrend,
  TraceNode, TraceNodeSummary } from '../../interface/models/traceNode';
import {TraceManager} from '../manager/traceManager';
import {TraceNodeManager} from '../manager/traceNodeManager';
import {KeyTraceManager} from '../manager/keyTraceManager';

@provide('traceService')
export class TraceService {

  @inject()
  protected traceManager: TraceManager;

  @inject()
  protected traceNodeManager: TraceNodeManager;

  @inject()
  protected keyTraceManager: KeyTraceManager;

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
    const _options = this.optionsCheck(options, ['scope', 'scopeName'], 30);

    const data = await this.traceManager.traceSummaryList(_options);
    return {
      total: data.length,
      data,
    };
  }

  async traceDetail(options: AppComplexSelector & TracingSelector): Promise<Trace> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'startTime', 'endTime', 'uuid'], 30);

    return this.traceManager.traceDetail(_options);
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
    const _options = this.optionsCheck(options, ['scope', 'scopeName'], 30);
    return this.traceManager.traceTotalitySummary(_options);
  }

  async spanTotalitySummary(options: AppComplexSelector): Promise<TraceNodeSummary> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName'], 30);

    return this.traceNodeManager.spanTotalitySummary(_options);
  }

  async traceSummaryTrend(options: AppComplexSelector): Promise<ListResult<TraceSummaryTrend>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName'], 30, 60);

    return this.traceManager.traceSummaryTrend(_options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async listTraceByName(options: AppComplexSelector & TracingSelector): Promise<ListResult<Trace>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName'], 30);

    return this.traceManager.listTraceByName(_options).then((data) => {
      return {
        total: data.count,
        data: data.rows,
      };
    });
  }

  async traceSummary(options: AppComplexSelector & TracingSelector): Promise<TraceSummary> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'traceName'], 30);

    return this.traceManager.traceSummary(_options);
  }

  async traceNodeSummaryList(options: AppComplexSelector & TracingSelector): Promise<ListResult<TraceNodeSummary>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName'], 30);

    return this.traceNodeManager.traceNodeSummaryList(_options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async traceNodeSummary(options: AppComplexSelector & TracingSelector): Promise<TraceNodeSummary> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName'], 30);

    return this.traceNodeManager.traceNodeSummary(_options);
  }

  async traceNodeSummaryTrend(options: AppComplexSelector & TracingSelector): Promise<ListResult<SummaryTrend>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName'], 30, 60);

    return this.traceNodeManager.traceNodeSummaryTrend(_options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async spanTargetList(options: AppComplexSelector & TracingSelector): Promise<ListResult<SpanTargetList>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName'], 30);

    return this.traceNodeManager.spanTargetList(_options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async spanTargetSummaryTrend(options: AppComplexSelector & TracingSelector): Promise<ListResult<SummaryTrend>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName', 'spanTarget'], 30, 60);

    return this.traceNodeManager.spanTargetSummaryTrend(_options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  async listNodesByTarget(options: AppComplexSelector & TracingSelector): Promise<ListResult<TraceNode>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'spanName', 'spanTarget'], 30);

    return this.traceNodeManager.listNodesByTarget(_options).then((data) => {
      return {
        total: data.count,
        data: data.rows,
      };
    });
  }

  async spansSummaryTrend(options: AppComplexSelector & TracingSelector): Promise<SpansSummaryTrendResult> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName'], 30, 60);

    return this.traceNodeManager.spansSummaryTrend(_options);
  }

  async traceFlowHistogram(options: AppComplexSelector): Promise<ListResult<any>> {
    const _options = this.optionsCheck(options, ['scope', 'scopeName', 'env'], 30);

    return this.traceManager.traceFlowHistogram(_options).then((data) => {
      return {
        total: data.length,
        data,
      };
    });
  }

  private optionsCheck(options, required: string[], defaultDuration?: number, defaultInterval?: number): any {
    required.forEach((r) => {
      assert(options[r], `${r} is needed.`);
    });

    if (defaultDuration) {
      let endTime = options.endTime || moment();
      let startTime = options.startTime || moment(endTime).subtract(defaultDuration, 'minutes');

      startTime = toMoment(startTime);
      endTime = toMoment(endTime);

      if (endTime.diff(startTime, 'hours') >= 24) {
        endTime = startTime.clone().subtract(24, 'hours');
      }

      options.startTime = timeFormat(startTime);
      options.endTime = timeFormat(endTime);
    }

    if (defaultInterval) {
      options.interval = 60;
    }

    return options;
  }
}
