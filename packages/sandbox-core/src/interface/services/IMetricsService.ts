import {
  ComplexSelector,
  IndicatorResult,
  TimeWindowOptions,
  MetricsNamesSelector,
} from './common';

export interface IMetricsService {

  /**
   * 查询全部有哪些 Metrics 指标
   */
  getMetricsNames(options: ComplexSelector): Promise<string[]>;

  /**
   * 获得指标的当前值
   */
  queryMetricsLatest(options: ComplexSelector & MetricsNamesSelector): Promise< IndicatorResult[] >;

  /**
   * 获取单个或批量的 Metrics 的趋势图
   */
  queryMetricsTrend(options: ComplexSelector & MetricsNamesSelector & TimeWindowOptions): Promise< IndicatorResult[] >;

}
