import { inject, get, post, controller, provide, priority } from 'midway-mirror';
import {IApplicationService} from '../../interface/services/IApplicationService';
import { wrapJson } from '../../core/util/util';

@priority(0)
@provide()
@controller('/v2/api/application/')
export class ApplicationCtrl {

  @inject()
  applicationService: IApplicationService;

  @get('/listByUser')
  async listByUser(ctx) {
    const query = ctx.query;
    const data = await this.applicationService.listByUser(ctx.uid, {
      offset: parseInt(query.offset, 10) || 0,
      limit: parseInt(query.limit, 10) || 20,
    });
    ctx.body = wrapJson(data);
  }

  @get('/queryGroups')
  async queryGroups(ctx) {
    const query = ctx.query;
    const data = await this.applicationService.queryGroups(query);
    ctx.body = wrapJson(data);
  }

  @get('/queryHosts')
  async queryHosts(ctx) {
    const query = ctx.query;
    const data = await this.applicationService.queryHosts(query);
    ctx.body = wrapJson(data);
  }

  @get('/groupExist')
  async groupExist(ctx) {
    const query = ctx.query;
    const data = await this.applicationService.groupExist(query);
    ctx.body = wrapJson(data);
  }

  @post('/groupUpsert')
  async groupUpsert(ctx) {
    const body = ctx.request.body;
    const data = await this.applicationService.groupUpsert(body);
    ctx.body = wrapJson(data);
  }

  @post('/groupDelete')
  async groupDelete(ctx) {
    const body = ctx.request.body;
    const data = await this.applicationService.groupDelete(body);
    ctx.body = wrapJson(data);
  }

}
