export default [
  {
    timestamp: new Date('2018-09-20 00:34:07'),
    scope: 'test',
    scopeName: 'sandbox-test',
    env: 'dev',
    hostname: 'test-server',
    ip: '192.168.1.1',
    uuid: 'e5c2f409-877e-4810-8702-d4b417e8eef0',
    errorType: 'RangeError',
    errorStack: `at emitOne (events.js:116:13)
    at Client.emit (events.js:211:7)
    at emitTwo (events.js:126:13)
    at Request.emit (events.js:214:7)`, 
    unixTimestamp: 1537374847,  
    logPath: '/home/admin/logs/common-error.log',
    errorMessage: 'something wrong',  
    version: '1',  
    traceId: '483d9c50-c303-11e8-a355-529269fb1459',  
    pid: '72813',
  },
  {
    timestamp: new Date('2018-09-20 00:34:08'),
    scope: 'test',
    scopeName: 'sandbox-test',
    env: 'dev',
    hostname: 'test-server',
    ip: '192.168.1.1',
    uuid: '40951566-a813-4132-80fd-46c84a917cd5',
    errorType: 'RangeError',
    errorStack: `at emitOne (events.js:116:13)
    at Client.emit (events.js:211:7)
    at emitTwo (events.js:126:13)
    at Request.emit (events.js:214:7)`, 
    unixTimestamp: 1537374848,  
    logPath: '/home/admin/logs/common-error.log',
    errorMessage: 'something wrong',  
    version: '1',  
    traceId: '67e51f41-a0fc-4a48-9113-cf0372259515',  
    pid: '72803',
  },
  {
    timestamp: new Date('2018-09-20 00:34:09'),
    scope: 'test',
    scopeName: 'sandbox-test',
    env: 'dev',
    hostname: 'test-server',
    ip: '192.168.1.1',
    uuid: 'e69863bf-22eb-4f35-bbc9-2afb3ed294a3',
    errorType: 'ReferenceError',
    errorStack: `at emitOne (events.js:116:13)
    at Client.emit (events.js:211:7)
    at emitTwo (events.js:126:13)
    at Request.emit (events.js:214:7)`, 
    unixTimestamp: 1537374929,  
    logPath: '/home/admin/logs/app-fatal.log',
    errorMessage: 'something wrong',  
    version: '1',  
    traceId: '802ad679-7403-4f24-97b2-eaa81f3605f9',  
    pid: '72803',
  }
]