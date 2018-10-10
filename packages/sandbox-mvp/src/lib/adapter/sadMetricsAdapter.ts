import { provide } from 'midway';
import {AppSelector, TimeWindowOptions} from 'sandbox-core';
import {ISadMetricsAdapter} from 'sandbox-core';

@provide('sadMetricsAdapter')
export class SadMetricsAdapter implements ISadMetricsAdapter {
  async getMetricsNames(options: AppSelector & TimeWindowOptions): Promise<string[]> {
    return [];
  }
}
