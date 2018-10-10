import {systemLayout} from './metricsLayouts/systemLayout';
import {nodeLayout} from './metricsLayouts/nodeLayout';
import {focusLayout} from './metricsLayouts/focusLayout';

export const coreMetrics = {
  cpuUsage: {
    aggregator: 'avg',
    metric: 'system.tsar.cpu',
    affix: '%',
  },
  load1: {
    aggregator: 'avg',
    metric: 'system.load.1min',
  },
  memUsage: {
    aggregator: 'avg',
    metric: 'system.tsar.mem',
    affix: '%',
  },
  diskUsage: {
    aggregator: 'avg',
    metric: 'system.tsar.df',
    affix: '%',
  },
  qps: {
    aggregator: 'sum',
    metric: 'system.tsar.nginx_qps',
  },
  rt: {
    aggregator: 'avg',
    metric: 'system.tsar.nginx_rt',
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
