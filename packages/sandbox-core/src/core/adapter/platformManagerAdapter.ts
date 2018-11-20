import { provide, inject, IApplicationContext, providerWrapper, scope, ScopeEnum } from 'midway-mirror';
import {IPlatformManagerAdapter} from '../../interface/adapter/IPlatformManagerAdapter';
import {IPlatformAdapter} from '../../interface/adapter/IPlatformAdapter';

@scope(ScopeEnum.Singleton)
@provide('platformManagerAdapter')
export class PlatformManagerAdapter implements IPlatformManagerAdapter {

  @inject()
  protected platformAdapterDispatcher;

  async get(name: string): Promise<IPlatformAdapter> {
    return this.platformAdapterDispatcher(name);
  }

}

export function platformAdapterDispatcher(context: IApplicationContext) {
  return async (adapterName: string) => {
    try {
      return await context.getAsync(adapterName + 'PlatformAdapter');
    } catch (err) {
      return context.getAsync('defaultPlatformAdapter');
    }
  };
}

providerWrapper([
  {
    id: 'platformAdapterDispatcher',
    provider: platformAdapterDispatcher,
  },
]);
