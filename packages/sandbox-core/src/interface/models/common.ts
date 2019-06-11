export interface FindAndCountAllResult<T> {
  rows: T[];
  count: number;
}

export interface ScopeInfo {
  scope: string;
  scopeName: string;
  scopeId?: string;
}

export interface TimeQuery {
  startTime?: string;
  endTime?: string;
}

export interface ModelQueryOptions {
  attributes?: string[];
  offset?: number;
  limit?: number;
  order?: string;
}
