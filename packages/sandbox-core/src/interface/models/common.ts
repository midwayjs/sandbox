import { FindOptionsAttributesArray } from 'sequelize';

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

export type QueryAttributes = FindOptionsAttributesArray | { include?: FindOptionsAttributesArray, exclude?: string[] };

export interface ModelQueryOptions {
  attributes?: QueryAttributes;
  offset?: number;
  limit?: number;
  order?: string;
}
