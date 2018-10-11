import { provide } from 'midway-mirror';
import {IPlatformIdentification, IPlatformHostResult, IPlatformGroup} from '../../../src/interface/adapter/IPlatformAdapter';
import defaultPlatformHostsMockData from '../mockData/defaultPlatformHostsMockData';
import { cloneDeep } from 'lodash';

@provide('defaultPlatformAdapter')
export class DefaultPlatformAdapter {
  async getHosts(app: IPlatformIdentification): Promise<IPlatformHostResult<IPlatformGroup>> {
    return cloneDeep(defaultPlatformHostsMockData);
  }
}
