import EventEmitter = require('events');
import Url = require('url');
import QueryString = require('querystring');
import WebSocket = require('ws');
import {Server as WebSocketServer} from 'ws';
import urllib = require('urllib');
import {Server as HTTPServer} from 'http';
import { provide, inject, autowire } from 'midway-mirror';
import {Cipher} from './cipher';

@provide()
@autowire(false)
export class DebugServer extends EventEmitter {

  @inject()
  cipher: Cipher;

  private httpServer: HTTPServer;
  private wsServer: WebSocketServer;
  private logger = console;

  public setServer(server) {
    this.httpServer = server;
  }

  public start() {

    this.wsServer = new WebSocketServer({
      server: this.httpServer,
    });

    this.wsServer.on('connection', this.handleWebSocketConnection.bind(this));
    this.wsServer.on('error', (err) => {
      this.logger.error(err);
      this.emit('error', err);
    });

  }

  public handleWebSocketConnection(socket, request) {

    try {

      const upgradeReq = socket.upgradeReq;
      const url = upgradeReq.url;
      if (!url.startsWith('/remoteDebug')) {
        socket.terminate();
        return;
      }
      socket.pause();
      const query = QueryString.parse(Url.parse(url).query);
      const tokenRaw: string = query.token as any;
      const info = JSON.parse(this.cipher.decrypt(tokenRaw));
      info.host = info.ip;

      this.logger.log('ws', url);

      const config = {
        debugPort: 5858,
        host: '127.0.0.1', ...info};

      this.createChromiumSession(config, socket).catch((err) => {
        socket.terminate();
        this.logger.error(err);
      });

    } catch (err) {
      socket.terminate();
      this.logger.error(err);
    }
  }

  public close() {
    if (this.wsServer) {
      this.wsServer.close();
      this.emit('close');
    }
  }

  private async createChromiumSession(config, wsConnection) {

    const listUrl = `http://${config.ip}:${config.debugPort}/json/list`;
    const listRes = await urllib.request(listUrl, { timeout: 5000, dataType: 'json' });
    if (!listRes.data || !listRes.data.length) {
      throw new Error('Cannot found any instance at ' + listUrl);
    }
    const uuid = listRes.data[0].id;
    const wsUrl = `ws://${config.ip}:${config.debugPort}/${uuid}`;

    const targetWs = new WebSocket(wsUrl);
    targetWs.on('open', () => {
      wsConnection.resume();
    });

    wsConnection.on('message', (data) => {
      try {
        targetWs.send(data);
      } catch (err) {
        this.logger.error(err);
      }
    });

    targetWs.on('message', (data) => {
      try {
        wsConnection.send(data);
      } catch (err) {
        this.logger.error(err);
      }
    });

    const close = () => {
      try {
        wsConnection.close();
      } catch (err) {
        // ignore
      }
      try {
        targetWs.close();
      } catch (err) {
        // ignore
      }
    };
    targetWs.on('error', close);
    targetWs.on('close', close);
    wsConnection.on('close', close);
    wsConnection.on('error', close);

  }

}
