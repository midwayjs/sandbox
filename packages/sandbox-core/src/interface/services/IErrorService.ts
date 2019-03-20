import { ErrorRecord, PaginationOptions, PaginationResult, TimeWindowOptions } from './common';

interface LogNames {}
interface Hosts {}
interface Reports {}
interface ErrTypes {}

export interface QueryErrorTypes {
  lognames: LogNames;
  hosts: Hosts;
  reports: Reports;
  errTypes: ErrTypes;
}

export interface QueryErrorOptions extends PaginationOptions, TimeWindowOptions {
  hostname?: string;
  ip?: string;
  errType?: string[];
  keyword?: string;
  in?: string; // 搜索范围
  scope: string;
  scopeName: string;
  env: string;
  logPath?: string;
  pandora?: boolean;
  pageSize?: number;
  page?: number;
  level?: string;
}

export interface ErrorSelector {
  type?: string;
  searchWord?: string;
}

export interface IErrorService {
  /**
   * @description 获取错误信息
   * @param options QueryErrorOptions
   */
  queryErrors(options: QueryErrorOptions): Promise<PaginationResult<ErrorRecord>>;

  /**
   * @description 获取错误类型分布
   * @param options - QueryErrorOptions
   */
  queryErrorTypes(options: QueryErrorOptions): Promise<QueryErrorTypes>;
}
