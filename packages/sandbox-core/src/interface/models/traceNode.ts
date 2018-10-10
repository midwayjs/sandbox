import { ScopeInfo, TimeQuery } from './common';

export interface TraceNode extends ScopeInfo {
  timestamp: string;
  env: string;
  hostname: string;
  ip: string;
  pid: string;
  traceName: string;
  traceId: string;
  uuid: string;
  spanName: string;
  spanTimestamp: string;
  spanDuration: number;
  spanError: number;
  spanType: number;
  spanMethod: string;
  spanTarget: string;
  spanCode: string;
  spanTags: string;
  spanId: string;
  spanRpcId: string;
}

export interface TraceNodeQuery extends TimeQuery, ScopeInfo {
  traceName?: string;
  hostname?: string;
  env?: string;
  ip?: string;
}

export type TraceNodeSummary = [number, number, number, string]; // rt total successRate spanName

export interface TraceNodeSummaryQuery extends TraceNodeQuery {
  spanName?: string;
}

export interface TraceNodeSummaryTrendQuery extends TraceNodeSummaryQuery {
  interval?: number;
}

export type SummaryTrend = [string, number, number, number]; // timestamp rt total successRate

export type SpanTargetList = [string, number]; // spanTarget total

export interface SpanTargetQuery extends TraceNodeSummaryQuery {
  spanTarget?: string;
}

export interface SpanTargetSummaryTrendQuery extends TraceNodeSummaryTrendQuery {
  spanTarget?: string;
}

export interface SpanSummaryTrendQuery extends TraceNodeQuery {
  interval?: number;
}

export type SpanSummaryTrend = [string, number, number, number, string]; // timestamp rt total successRate spanName

export interface SpansSummaryTrend {
  timestamp: string;
}

export interface SpansSummaryTrendResult {
  types: string[];
  rt: SpansSummaryTrend[];
  successRate: SpansSummaryTrend[];
  total: SpansSummaryTrend[];
}
