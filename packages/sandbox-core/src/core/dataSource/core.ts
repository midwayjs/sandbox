import { provide, async, config, logger, scope, ScopeEnum } from 'midway-mirror';
import { BaseDataSource } from './base';

@scope(ScopeEnum.Singleton)
@async()
@provide('coreDB')
export class CoreDBDataSource extends BaseDataSource {

  @config('coreDB')
  config;

  @logger('coreDBLogger')
  logger;

  name: string = 'coreDB';
}
