import * as http from 'http';
import * as assert from 'assert';
import { spawn } from 'child_process';
import * as WebSocket from 'ws';
import { once } from 'lodash';
import { DebugServer } from '../../../src/core/debugServer/debugServer';
import { Cipher } from '../../../src/core/debugServer/cipher';

describe('src/core/debugServer/debugServer.ts', () => {

  let debugableProcess;
  let debugServer;
  let token;
  const logger = console;

  before(async () => {
    debugableProcess = spawn('node', ['--inspect=5858']);
    debugableProcess.on('error', logger.error);

    const httpServer = http.createServer();
    httpServer.listen(3322);
    debugServer = new DebugServer(httpServer);
    debugServer.start();

    token = Cipher.encrypt(JSON.stringify({
      ip: '127.0.0.1',
    }));
  });

  it('should connect debug server', (done) => {
    const client = new WebSocket('ws://127.0.0.1:3322/remoteDebug?token=' + token);

    client.on('open', () => {
      client.send('{}');
    });
    const doneOnce = once(done);
    client.on('message', (data) => {
      assert(JSON.parse(data));
      client.terminate();
      client.on('close', () => {
        doneOnce();
      });

    });
  });

  it('should closed by debug server', (done) => {
    const client = new WebSocket('ws://127.0.0.1:3322/foobar?token=' + token);
    client.on('close', () => {
      done();
    });
    setTimeout(done.bind(null, new Error('socket not closed in 3s')), 3000);
  });

  it('should report a Error: Cannot found any instance', (done) => {
    const mockServer = http.createServer((req, res) => req.pipe(res));
    mockServer.listen(5859);
    const mockToken = Cipher.encrypt(JSON.stringify({
      ip: '127.0.0.1',
      debugPort: '5859',
    }));
    const client = new WebSocket('ws://127.0.0.1:3322/remoteDebug?token=' + mockToken);
    client.on('close', () => done());
  });

  it('should report a Error: Unexpected end of JSON input', (done) => {
    const client = new WebSocket('ws://127.0.0.1:3322/remoteDebug?token=' + token.slice(0, -10));
    client.on('close', () => done());
  });

  after(() => {
    debugableProcess.kill();
  });

});
