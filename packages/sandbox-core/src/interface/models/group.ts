import { ScopeInfo } from './common';

export interface SandboxGroup extends ScopeInfo {
  id: string;
  groupName: string;
  hostList: string;
  deleted: number;
  createdAt: string;
  updatedAt: string;
  hash: string;
}
