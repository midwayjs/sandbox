import { provide } from 'midway-mirror';

@provide('privilegeAdapter')
export class PrivilegeAdapter {
  async isAppOps(scope: string, scopeName: string, uid: string): Promise<boolean> {
    return true
  }
}
