import { get, post, controller, provide, inject, priority } from 'midway-web';
import {wrapJson} from '../../core/util/util';

@priority(0)
@provide()
@controller('/v2/api/trace/')
export class TracingCtrl {

  @inject('traceService')
  traceService;

  @get('/listFocusTraces')
  async focusTraces(ctx) {
    const query = ctx.query;
    const result = await this.traceService.listFocusTraces(query);
    ctx.body = wrapJson(result);
  }

  @get('/listTraces')
  async traces(ctx) {
    const query = ctx.query;
    const result = await this.traceService.listTraces(query);
    ctx.body = wrapJson(result);
  }

  @post('/toggleFocus')
  async toggleFocus(ctx) {
    const body = ctx.request.body;
    const result = await this.traceService.toggleTraceFocus(body);
    ctx.body = wrapJson(result);
  }

  @get('/traceDetail')
  async traceDetail(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceDetail(query);
    ctx.body = wrapJson(result);
  }

  @get('/traceTotalitySummary')
  async traceTotality(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceTotalitySummary(query);
    ctx.body = wrapJson(result);
  }

  @get('/spanTotalitySummary')
  async spanTotality(ctx) {
    const query = ctx.query;
    const result = await this.traceService.spanTotalitySummary(query);
    ctx.body = wrapJson(result);
  }

  @get('/traceSummaryTrend')
  async traceSummaryTrend(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceSummaryTrend(query);
    ctx.body = wrapJson(result);
  }

  @get('/traceNodeSummaryTrend')
  async traceNodeSummaryTrend(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceNodeSummaryTrend(query);
    ctx.body = wrapJson(result);
  }

  @get('/spanTargetSummaryTrend')
  async spanTargetSummaryTrend(ctx) {
    const query = ctx.query;
    const result = await this.traceService.spanTargetSummaryTrend(query);
    ctx.body = wrapJson(result);
  }

  @get('/listTraceByName')
  async listTraceByName(ctx) {
    const query = ctx.query;
    const result = await this.traceService.listTraceByName(query);
    ctx.body = wrapJson(result);
  }

  @get('/traceNodeSummaryList')
  async traceNodeSummaryList(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceNodeSummaryList(query);
    ctx.body = wrapJson(result);
  }

  @get('/traceSummary')
  async traceSummary(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceSummary(query);
    ctx.body = wrapJson(result);
  }

  @get('/traceNodeSummary')
  async traceNodeSummary(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceNodeSummary(query);
    ctx.body = wrapJson(result);
  }

  @get('/spanTargetList')
  async spanTargetList(ctx) {
    const query = ctx.query;
    const result = await this.traceService.spanTargetList(query);
    ctx.body = wrapJson(result);
  }

  @get('/listNodesByTarget')
  async listNodesByTarget(ctx) {
    const query = ctx.query;
    const result = await this.traceService.listNodesByTarget(query);
    ctx.body = wrapJson(result);
  }

  @get('/spansSummaryTrend')
  async spansSummaryTrend(ctx) {
    const query = ctx.query;
    const result = await this.traceService.spansSummaryTrend(query);
    ctx.body = wrapJson(result);
  }

  @get('/traceFlowHistogram')
  async traceFlowHistogram(ctx) {
    const query = ctx.query;
    const result = await this.traceService.traceFlowHistogram(query);
    ctx.body = wrapJson(result);
  }

}
