import {AppSelector, TimeWindowOptions} from '../services/common';

export interface ISadMetricsAdapter {
  getMetricsNames(options: AppSelector & TimeWindowOptions): Promise<string[]>;
}
