import {
  ComplexSelector,
  OrderOptions,
  PaginationOptions,
  PaginationResult,
  TimeWindowOptions,
  TraceData,
  TracingSelector,
} from './common';

export interface ITracingService {

  /**
   * 分页获取日志列表
   * 实现要求
   *   1. 可以使用 ComplexSelector 筛选
   *   2. 可以使用 TracingSelector 筛选
   *   3. 可以根据 TimeWindowOptions 获取指定时间窗口的数据
   *   4. 可以根据 OrderOptions 参数排序
   *   5. 可以根据 PaginationOptions 分页
   */
  list?(
    options: ComplexSelector & TracingSelector & TimeWindowOptions & OrderOptions & PaginationOptions,
  ): Promise<PaginationResult<TraceData>>;

  /**
   * 根据 traceId 获得指定的 Trace
   * 第二个参数是可选的 rpcId
   */
  get?(uuid: string, rpcId?: string): Promise<TraceData>;

}
