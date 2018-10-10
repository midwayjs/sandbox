import { ScopeInfo, TimeQuery } from './common';

export interface Trace extends ScopeInfo {
  timestamp: string;
  env: string;
  hostname: string;
  ip: string;
  pid: string;
  traceName: string;
  traceSpans: string;
  traceId: string;
  traceDuration: number;
  traceStatus: number;
  uuid: string;
  unixTimestamp: string;
  version: number;
}

export interface TraceQuery extends TimeQuery, ScopeInfo {
  env?: string;
  ip?: string;
  hostname?: string;
}

export interface TraceDetailQuery  extends TraceQuery {
  uuid?: string;
}

export type TraceSummary = [number, number, number, string, number]; // rt total successRate traceName length

export interface TraceSummaryQuery extends TraceQuery {
  traceName?: string;
}

export interface TraceSummaryTrendQuery extends TraceSummaryQuery {
  interval?: number;
}

export type TraceSummaryTrend = [string, number, number, number]; // timestamp rt total successRate
