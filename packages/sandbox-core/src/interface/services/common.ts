/**********************
 * ********************
 * 基础类型
 * ********************
 */

/**
 * 跟踪选择器
 */
export interface TracingSelector {
  searchWord?: string;
  statusMask?: number;
  traceName?: string;
  spanName?: string;
  spanTarget?: string;
  uuid?: string;
  interval?: number;
}

/**
 * 远程调试主机的过滤定义
 */
export interface RemoteDebugFilter {
  // 只获取可被 debug 的机器，默认为 false
  onlyDebuggableHosts: boolean;
}

export interface MetricNameJSON {
  metric: string;
  aggregator?: string;
  downsample?: string;
  tags?: {
    [key: string]: string;
  };
  groupBy?: string[];
  analyseHigherLower?: boolean;
}

export interface MetricsNamesSelector {
  metricsNames: MetricNameJSON[];
  analyseHigherLower?: boolean;
}

export interface LogSelector {
  type?: LogRecordType;
  searchWord?: string;
}

/**
 * 只获取可被 mock 的机器，默认为 false
 */
export interface FaultMockFilter {
  onlyMockableHosts: boolean;
}

/**
 * 主机定义
 */
export interface Host {
  hostname: string;
  ip: string;
  startTime?: number;
  uptime?: number;
  tags?: {
    [key: string]: any;
  };
  indicators?: {
    [key: string]: any;
  };
}

/**
 * 错误记录定义
 */
export interface ErrorRecord {
  // 基础信息
  uuid: string;
  type: string;
  time: number;
  message: string;
  stack: any;
  // 来源信息
  traceId?: string;
  pid?: string;
  ip?: string;
  hostname?: string;
  clusterId?: string;
  clusterName?: string;
}

/**
 * 普通日志记录定义
 */

export type LogRecordType = 'stdout' | 'build' | 'start';

export interface LogRecord {
  // 基础信息
  uuid: string;
  type: LogRecordType;
  time: number;
  text: string;
  // 来源信息
  ip?: string;
  hostname?: string;
  clusterId?: string;
  clusterName?: string;
}

/**
 * 数据指标返回结果定义
 */
export interface IndicatorResult {

  metric?: string;
  aggregator?: string;

  hostname?: string;
  ip?: string;
  pid?: string;

  // 这两个貌似暂时没用到
  group?: string;
  type?: string;

  latest?: any; // 最新值
  trend?: Array<{ // 趋势值数组
    time: number;
    value: any;
  }>;

}

/**
 * Trace 定义
 */
export interface SpanData {
  name: string;
  references: Array<{
    refType: string;
    traceId: string;
    spanId: string;
  }>;
  context: object;
  timestamp: number;
  duration: number;
  logs: Array<{
    timestamp: string;
    fields: any;
  }>;
  tags: object;
}

export interface TraceData {
  uuid: string;
  rpcId?: string;
  name: string;
  duration: number;
  status: number;
  // spans 分页时可以省略
  spans?: SpanData[];
}

/**
 * 某条已经发生了的报警
 */
export interface AlarmRecord {
  // 基础信息
  uuid: string;
  time: number;
  message: string;
  rawIndicators: {
    [name: string]: any;
  };
  // 来源信息
  ip?: string;
  hostname?: string;
  clusterId?: string;
  clusterName?: string;
}

/**
 * 报警的配置
 */
export interface AlarmConfig {
  uuid: string;
  forType: 'cluster';
  // 可以向一个或多个集群设置
  forCluster: string | string[];
  config: {
    // 报警规则
    expression: string;
    // 报警模板
    template: string;
    // 间隔
    duration: number;
  };
  followRules?: {
    [key: string]: any,
  };
  cache?: {
    // 报警规则的预解析 AST
    expressionAST: any;
    // 依赖的上有指标
    dependentIndicators: string[];
  };
}

/**
 * 单一调试端口的定义
 */
export interface DebugPort {
  pid: number;
  execArgv: string;
  argv: string;
  ip: string;
  hostname: string;
  port: string;
}

/**
 * 关联了调试信息的 Host 定义
 */
export interface DebuggableHost extends Host {
  debuggable: boolean;
  ports: DebugPort[];
}

/**
 * 故障模拟相关
 */

export interface FaultMockConfig {
  // TODO: 具体规则和 Pandora 还是怎么样？
}

export interface FaultMockConfigRecord {
  uuid?: string;
  target: HostSelector;
  topic: string;
  config: FaultMockConfig;
}

export interface MockableHost extends Host {
  mockable: boolean;
  availableTopics?: string[];
}

/**********************
 * ********************
 * 分页相关
 * ********************
 */

/**
 * 查询时的分页参数
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  neverLimit?: boolean;
}

/**
 * 分页结果
 */
export interface PaginationResult <T> {
  page: number;
  total: number;
  data: T[];
}

/**********************
 * ********************
 * 查询参数相关
 * ********************
 */

/**
 * 时间窗口参数
 * endTime 不传为当前时间
 * startTime 不传请自由发挥（比如提前 5 分钟）
 */
export interface TimeWindowOptions {
  startTime?: number;
  endTime?: number;
  interval?: number;
}

/**
 * 排序参数
 */
export interface OrderOptions {
  order: string;
  orderBy: string;
}

/**
 * 指标排序的特别约束
 */
export interface OrderByBasicIndicators {
  orderBy: 'laod' | 'cpu'; 'qps'; 'success_rate'; 'rt';
}

/**********************
 * ********************
 * 查询选择器相关
 * ********************
 */

/**
 * 用于定位单台主机
 */
export interface HostSelector {
  ip?: string;
  hostname?: string;
}

/**
 * 用于定位多台主机
 */
export interface HostUnionSelector {
  ip?: string[];
  hostname?: string[];
}

/**
 * 用于定位某个集群
 */
export interface ClusterSelector {
  clusterName?: string;
  clusterId?: string;
}

/**
 * 用于定位多个集群
 * 首先覆盖内部场景，比如一个应用就是要要聚合多个集群的数据
 */
export interface ClusterUnionSelector {
  clusterName?: string[];
  clusterId?: string[];
}

export interface AppSelector {
  scope: string;
  scopeName: string;
  env?: string;
  scopeId?: string;
}

/**
 * 功能接口大多数接受 HostSelector & ClusterSelector & ClusterUnionSelector 三种 Selector 定位数据
 */
export type ComplexSelector = HostSelector & ClusterSelector & ClusterUnionSelector;

export type AppComplexSelector = AppSelector & TimeWindowOptions & HostSelector & ClusterSelector & PaginationOptions;

/**
 * 集群的复合选择器
 */
export type ClusterComplexSelector = ClusterSelector & ClusterUnionSelector;

/**********************
 * ********************
 * 查询结果相关
 * ********************
 */

/**
 * list 查询结果，不使用分页
 */
export interface ListResult <T> {
  total: number;
  data: T[];
}

/**********************
 * ********************
 * 权限相关
 * ********************
 */

export interface UserSelector {
  uid?: string;
}
