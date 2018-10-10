import { provide } from 'midway';
import { IPrivilegeAdapter } from 'sandbox-core';

@provide('privilegeAdapter')
export class PrivilegeAdapter implements IPrivilegeAdapter {
  async isAppOps(scope: string, scopeName: string, uid: string): Promise<boolean> {
    return true;
  }
}
