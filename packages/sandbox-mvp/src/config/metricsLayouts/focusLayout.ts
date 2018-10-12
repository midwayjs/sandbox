export const focusLayout = [{
  title: '焦点视图',
  charts: [
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
    {
      title: '访问成功率',
      indicators: [
        {
          aggregator: 'avg',
          metric: 'middleware.http.request.success_rate',
          title: '访问成功率',

          type: 'percent',
          normalizedValue: true,
        },
      ],
    },
    {
      title: 'CPU Load',
      indicators: [
        {
          aggregator: 'avg',
          metric: 'system.load.1min',
          title: 'Load 1',
          type: 'number',
        },
        {
          aggregator: 'avg',
          metric: 'system.load.5min',
          title: 'Load 5',
          type: 'number',
        },
        {
          aggregator: 'avg',
          metric: 'system.load.15min',
          title: 'Load 15',
          type: 'number',
        },
      ],
    },
    {
      title: '日志错误',
      indicators: [
        {
          aggregator: 'sum',
          metric: 'error.all.bucket_count',
          title: '错误数量',
          type: 'number',
          unit: '条',
        },
      ],
    },
    {
      title: 'CPU 使用率',
      indicators: [
        {
          aggregator: 'avg',
          metric: 'system.cpu.usage',
          title: 'CPU 使用率',
          type: 'percent',
          normalizedValue: true,
        },
      ],
    },
    {
      title: '内存使用率',
      indicators: [
        {
          aggregator: 'avg',
          metric: 'system.mem.usage',
          title: '内存使用率',
          type: 'percent',
          normalizedValue: true,
        },
      ],
    },
    {
      title: '磁盘占用率',
      indicators: [
        {
          aggregator: 'avg',
          metric: 'system.disk.partition.used_ratio',
          title: '磁盘占用率',
          type: 'percent',
          normalizedValue: true,
        },
      ],
    },
    {
      title: '网络吞吐速率',
      indicators: [


        {
          type: 'number',
          aggregator: 'sum',
          metric: 'system.nettraffic.eth0.net.in.bytes',
          unit: 'Bytes/ms',

          title: 'eth0 流入',
        },
        {
          type: 'number',
          aggregator: 'sum',
          metric: 'system.nettraffic.eth0.net.out.bytes',
          unit: 'Bytes/ms',

          title: 'eth0 流出',
        },
      ],
    },
    {
      title: 'TCP Retry',
      indicators: [
        {
          aggregator: 'avg',
          metric: 'system.tcp.retry.rate',
          title: '重试率',

          type: 'percent',
          normalizedValue: false,
        },
      ],
    },
  ],
}];
