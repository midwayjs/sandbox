import {IPlatformAdapter} from './IPlatformAdapter';

export interface IPlatformManagerAdapter {
  get(name: string): Promise<IPlatformAdapter>;
}
