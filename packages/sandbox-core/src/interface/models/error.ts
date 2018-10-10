import { ScopeInfo } from './common';

export interface ApplicationError extends ScopeInfo {
  timestamp: string;
  env: string;
  hostname: string;
  ip: string;
  pid: string;
  uuid: string;
  errorType: string;
  errorStack: string;
  errorMessage: string;
  logPath: string;
  traceId: string;
  unixTimestamp: string;
  version: number;
}
