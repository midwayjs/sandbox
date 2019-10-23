export interface Options {
  host: string;
  port: string;
}

export interface SuggestOptions {
  type: 'metrics' | 'tagk' | 'tagv';
  q?: string;
  max?: number;
}

export interface FilterJSON {
  type: string;
  tagk: string;
  filter: string;
  groupBy: boolean;
}

export interface QueryJSON {
  metric: string;
  aggregator?: string;
  rate?: string;
  downsample?: string;
  tags?: {
    [key: string]: string;
  };
  filters?: FilterJSON[];
}

export interface QueryLastOptions {
  resolveNames?: boolean;
  backScan?: number;
  queries: QueryJSON[];
}

export interface QueryOptions {
  start: string | number;
  end?: string | number;
  queries: QueryJSON[];
  baseOpts?: {
    skipDps?: boolean;
    showQuery?: boolean;
    msResolution?: boolean;
  };
}

export interface QueryResultItem {
  query: {
    aggregator: string;
    downsample: string;
    metric: string;
  };
  metric: string;
  tags: {
    [key: string]: string;
  };
  aggregateTags: string[];
  dps: {
    [time: string]: number | string,
  };
}

export interface QueryError {
  error: {
    message: string;
  };
}
