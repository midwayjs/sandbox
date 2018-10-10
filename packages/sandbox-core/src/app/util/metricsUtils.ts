import {MetricNameJSON} from '../../interface/services/common';

export class MetricsUtils {
  public static parseQueryStyleMetricsNames(rawStr: string): MetricNameJSON[] {
    return JSON.parse(rawStr);
  }
}
