import {systemLayout} from './metricsLayouts/systemLayout';
import {nodeLayout} from './metricsLayouts/nodeLayout';
import {focusLayout} from './metricsLayouts/focusLayout';

export const coreMetrics = {
  cpuUsage: {
    aggregator: 'avg',
    metric: 'system.cpu.usage',
    affix: '%',
    normalizedValue: true,
    unusual: {
      gte: 0.8
    }
  },
  load1: {
    aggregator: 'avg',
    metric: 'system.load.1min',
  },
  memUsage: {
    aggregator: 'avg',
    metric: 'system.mem.usage',
    affix: '%',
    normalizedValue: true,
    unusual: {
      gte: 0.7
    }
  },
  diskUsage: {
    aggregator: 'avg',
    metric: 'system.disk.partition.used_ratio',
    affix: '%',
    normalizedValue: true,
    unusual: {
      gte: 0.7
    }
  },
  qps: {
    aggregator: 'sum',
    metric: 'middleware.http.request.qps',
  },
  rt: {
    aggregator: 'avg',
    metric: 'middleware.http.request.rt',
    unusual: {
      gte: 2000
    }
  },
  errorCount: {
    aggregator: 'sum',
    metric: 'error.all.bucket_count',
  },
  successRate: {
    aggregator: 'avg',
    metric: 'middleware.http.request.success_rate',
    affix: '%',
    normalizedValue: true,
  },
};

export const metricsLayouts = {
  focus: focusLayout,
  node: nodeLayout,
  system: systemLayout
};

export const metricsLayoutsOrder = [
  'focus',
  'node',
  'system'
];
