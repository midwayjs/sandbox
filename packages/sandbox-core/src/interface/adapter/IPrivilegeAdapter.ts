export interface IPrivilegeAdapter {
  isAppOps(scope: string, scopeName: string, uid: string): Promise<boolean>;
}
