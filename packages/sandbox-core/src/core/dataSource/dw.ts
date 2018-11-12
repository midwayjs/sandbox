import { provide, async, config, logger, scope, ScopeEnum } from 'midway-mirror';
import { BaseDataSource } from './base';

@scope(ScopeEnum.Singleton)
@async()
@provide('dw')
export class DWDataSource extends BaseDataSource {

  @config('dw')
  config;

  @logger('dwLogger')
  logger;

  name: string = 'dw';
}
