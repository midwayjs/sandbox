import { provide } from 'midway-web';
import {AppSelector, TimeWindowOptions} from '../../../src/interface/services/common';
import {ISadMetricsAdapter} from '../../../src/interface/adapter/ISadMetricsAdapter';

@provide('sadMetricsAdapter')
export class SadMetricsAdapter implements ISadMetricsAdapter {
  async getMetricsNames(options: AppSelector & TimeWindowOptions): Promise<string[]> {
    return ['cpu', 'mem', 'qps'];
  }
}
