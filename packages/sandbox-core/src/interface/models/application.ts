import { ScopeInfo } from './common';

export interface SandboxApplication extends ScopeInfo {
  id: string;
  description: string;
  bu: string;
  owner: string;
  appops: string | object;
  alinodeId: string;
  alinodeToken: string;
  flag: number;
  deleted: number;
  state?: number;
  createdAt: string;
  updatedAt: string;
}
