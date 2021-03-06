export default {
  traces: [
    {
      timestamp: new Date('2018-09-28 01:13:34'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      ip: '10.0.0.1',
      uuid: '0f7ea820-3fb2-4496-b755-ca5bd76763bd',
      traceId: '0b859a6d15381252001705791e067a',
      version: 1,
      traceSpans: '[]',
      unixTimestamp: 1538068414,
      traceDuration: 3,
      pid: 4328,
      traceName: 'HTTP-GET:/',
      traceStatus: 1,
    },
    {
      timestamp: new Date('2018-09-28 01:13:35'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      ip: '10.0.0.1',
      uuid: '3e351e0f-9abd-4023-8a2a-061dc3cacffc',
      traceId: '0b859a6d153091a2001705791e067a',
      version: 1,
      traceSpans: '[]',
      unixTimestamp: 1538068415,
      traceDuration: 2,
      pid: 4928,
      traceName: 'HTTP-GET:/products',
      traceStatus: 1,
    },
  ],
  traceNodes: [
    {
      timestamp: new Date('2018-09-28 01:13:35'),
      scope: 'test',
      scopeName: 'sandbox-test',
      env: 'dev',
      hostname: 'develop.server',
      ip: '10.0.0.1',
      uuid: '3e351e0f-9abd-4023-8a2a-061dd3cacffc',
      traceId: '0b859a6d153091a2001705791e067a',
      version: 1,
      traceSpans: '[]',
      unixTimestamp: 1538068415,
      traceDuration: 2,
      traceName: 'HTTP-GET:/products',
      traceStatus: 1,
      spanName: 'configs',
      spanDuration: 142,
      spanType: 0,
      spanTags: '{}',
      spanId: 'eb26f0605ab77a93',
      spanRpcId: '0.1.1.0',
      spanCode: 200,
      spanError: 0,
      spanMethod: 'GET',
      spanTimestamp: '2018-09-28 01:13:35',
      pid: 2045,
      spanTarget: '/',
    },
  ],
};
