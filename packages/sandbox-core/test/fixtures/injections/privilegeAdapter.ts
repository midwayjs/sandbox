import { provide } from 'midway-web';

@provide('privilegeAdapter')
export class PrivilegeAdapter {
  async isAppOps(scope: string, scopeName: string, uid: string): Promise<boolean> {
    if (scopeName === 'noPermission') {
      return false;
    }
    return true;
  }
}
