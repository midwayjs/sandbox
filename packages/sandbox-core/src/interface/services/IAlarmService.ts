import {
  AlarmConfig, AlarmRecord, ClusterComplexSelector, PaginationOptions, PaginationResult,
} from './common';

export interface IAlarmService {

  /**
   * 获得一个已经发生了的报警
   */
  getReportedAlarm(uuid: string): Promise<AlarmRecord>;

  /**
   * 获得报警的历史
   */
  queryReportedAlarmHistory(options: ClusterComplexSelector & PaginationOptions & {
    uuid: string,
  }): Promise<PaginationResult<AlarmRecord>>;

  /**
   * 分页获取报警配置列表
   * 当前只支持集群级别
   */
  listAlarmConfig(
    options: ClusterComplexSelector & PaginationOptions,
  ): Promise<PaginationResult<AlarmConfig>>;

  /**
   * 根据 uuid 获得特定的报警配置
   */
  getAlarmConfig(uuid: string): Promise<AlarmConfig>;

  /**
   * 新增一个报警配置
   * 返回一个 uuid，是该规则的 uuid
   */
  addAlarmConfig(config: AlarmConfig): Promise<string>;

  /**
   * 更新一个报警配置
   */
  updateAlarmConfig(config: AlarmConfig): Promise<void>;

  /**
   * 删除一个报警配置
   */
  deleteAlarmConfig(uuid: string): Promise<void>;

  /**
   * 测试一个报警配置
   * 返回 uuid，是 Alarm 的 UUID
   */
  testAlarm(options: {
    uuid: string;
    indicators: {
      [name: string]: any,
    }
  }): Promise<string>;

  // TODO: 考虑是否要 UIC，否则没法 Follow
  followAlarmConfig(uuid: string): Promise<void>;

  // TODO: 考虑是否要 UIC，否则没法 Unfollow
  unfollowAlarmConfig(uuid: string): Promise<void>;

}
