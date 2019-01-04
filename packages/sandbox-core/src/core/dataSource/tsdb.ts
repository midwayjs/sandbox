import {QueryError, QueryOptions, QueryResultItem, SuggestOptions} from './tsdb.core';
import urllib = require('urllib');
import querystring = require('querystring');
import { provide, config, logger, init, scope, ScopeEnum } from 'midway-mirror';

@scope(ScopeEnum.Singleton)
@provide('tsdb')
export class TSDB {

  @config('tsdb')
  public config;

  @logger()
  public logger;
  defaultQueryOpts = {
    ms: 'true',
  };
  defaultPOSTOpts = {
    msResolution: true,
    showQuery: true,
  };

  protected host: string;
  protected port: string;
  protected prefix: string;

  @init()
  init() {
    this.host = this.config.host;
    this.port = this.config.port;
    this.prefix = 'http://' + this.host + ':' + this.port;
  }

  async suggest(suggestOptions: SuggestOptions) {
    const resp = await this.request('/api/suggest', suggestOptions, {
      method: 'GET',
    });
    return resp.data;
  }

  async query(queryOptions: QueryOptions): Promise<QueryResultItem[] & QueryError> {
    const resp = await this.requestPost('/api/query', {
      data: {
        start: queryOptions.start,
        end: queryOptions.end,
        queries: queryOptions.queries,
      },
    });
    if (resp.status !== 200) {
      if (resp.data && resp.data.error) {
        const err = new Error(resp.data.error.message);
        Object.assign(err, resp.data.error);
        throw err;
      } else {
        throw new Error('TSDB unknown error with http code: ' + resp.status);
      }
    }
    return resp.data;
  }

  async queryExp(queryOptions: any): Promise<QueryResultItem[] & QueryError> {
    const resp = await this.requestPost('/api/query/exp', {data: queryOptions});
    return resp.data;
  }

  protected async requestPost(url, opts) {
    return this.request(url, null, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...opts,
      data: {
        ...this.defaultPOSTOpts,
        ...opts.data,
      },
    });
  }

  protected async request(url, query, opts) {
    const queryStr = querystring.stringify({...this.defaultQueryOpts, ...query});
    const finalUrl = `${this.prefix}${url}?${queryStr}`;
    this.logger.info('[TSDB]', finalUrl);
    const options = {
      dataType: 'json',
      timeout: 10000,
      ...opts,
      headers: {
        ...this.config.extHeaders || null,
        ...(opts.headers || null),
      },
    };
    return urllib.request(finalUrl, options);
  }

}
