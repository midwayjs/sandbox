import { ScopeInfo } from './common';

export interface KeyTrace extends ScopeInfo {
  id: string;
  traceName: string;
  focus: number;
  deleted: number;
  createdAt: string;
  updatedAt: string;
  hash: string;
}
