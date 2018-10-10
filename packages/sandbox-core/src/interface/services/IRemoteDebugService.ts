import {
  ComplexSelector,
  DebuggableHost,
  DebugPort,
  HostSelector,
  PaginationOptions,
  PaginationResult,
  RemoteDebugFilter,
} from './common';

export interface IRemoteDebugService {

  /**
   * 分页获取可被远程调试的机器列表
   * 实现要求
   *   1. 使用 ComplexSelector 筛选
   *   2. 使用 RemoteDebugFilter 筛选
   *   3. 通过 PaginationOptions 分页
   */
  listDebuggableHosts?(
    options: ComplexSelector & RemoteDebugFilter & PaginationOptions,
  ): Promise<PaginationResult<DebuggableHost>>;

  /**
   * 获得特定的主机的调试信息
   */
  getDebuggableHost(
    options: HostSelector,
  ): Promise<DebuggableHost>;

  /**
   * 开始特定端口的调试
   */
  startDebug?(port: DebugPort): Promise<void>;

  /**
   * 结束特定端口的调试
   */
  endDebug?(port: DebugPort): Promise<void>;

  /**
   * 获取调试的 WS 地址
   */
  getProxyWsURL?(port: DebugPort): Promise<string>;

}
