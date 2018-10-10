export const systemLayout = [
  {
    title: '系统指标',
    charts: [
      {
        title: 'Load 1',
        indicators: [
          {
            aggregator: 'avg',
            metric: 'system.load.1min',
            title: 'Load 1',
            type: 'number',
          },
        ],
      },
      {
        title: 'Load 5',
        indicators: [
          {
            aggregator: 'avg',
            metric: 'system.load.5min',
            title: 'Load 5',
            type: 'number',
          },
        ],
      },
      {
        title: 'Load 15',
        indicators: [
          {
            aggregator: 'avg',
            metric: 'system.load.15min',
            title: 'Load 15',
            type: 'number',
          },
        ],
      },
      {
        title: 'CPU 使用率',
        indicators: [
          {
            aggregator: 'avg',
            metric: 'system.tsar.cpu',
            title: 'CPU 使用率',
            type: 'percent',
            normalizedValue: false,
          },
        ],
      },
      {
        title: '内存使用率',
        indicators: [
          {
            aggregator: 'avg',
            metric: 'system.tsar.mem',
            title: '内存使用率',
            type: 'percent',
            normalizedValue: false,
          },
        ],
      },
      {
        title: '磁盘占用率',
        indicators: [
          {
            aggregator: 'avg',
            metric: 'system.tsar.df',
            title: '磁盘占用率',
            type: 'percent',
            normalizedValue: false,
          },
        ],
      },
      {
        title: '网络流入',
        indicators: [
          {
            type: 'number',
            aggregator: 'sum',
            metric: 'system.tsar.ifin',
            unit: 'Bytes/ms',
            title: 'eth0 流入',
          },
        ],
      },
      {
        title: '网络流出',
        indicators: [
          {
            type: 'number',
            aggregator: 'sum',
            metric: 'system.tsar.ifout',
            unit: 'Bytes/ms',
            title: 'eth0 流出',
          },
        ],
      },
      {
        title: '包流入',
        indicators: [
          {
            type: 'number',
            aggregator: 'sum',
            metric: 'system.tsar.pktin',
            unit: '',
            title: '入包',
          },
        ],
      },
      {
        title: '包流出',
        indicators: [
          {
            type: 'number',
            aggregator: 'sum',
            metric: 'system.tsar.pktout',
            unit: '',
            title: '出包',
          },
        ],
      },
      {
        title: 'TCP Retry',
        indicators: [
          {
            aggregator: 'avg',
            metric: 'system.tsar.tcp_retry',
            title: '重试率',
            type: 'percent',
            normalizedValue: false,
          },
        ],
      },
      {
        title: 'Nginx QPS',
        indicators: [
          {
            type: 'number',
            aggregator: 'sum',
            metric: 'system.tsar.nginx_qps',
            title: 'Nginx QPS',
            unit: '次/秒',
          },
        ],
      },
      {
        title: 'Nginx RT',
        indicators: [
          {
            type: 'number',
            aggregator: 'avg',
            metric: 'system.tsar.nginx_rt',
            title: 'Nginx RT',
            unit: 'ms',
          },
        ],
      },
    ],
  },
];

for (const chart of systemLayout[0].charts) {
  Object.assign(chart, {
    groupByOnCluster: ['hostname'],
    analyseHigherLower: true,
  });
}
