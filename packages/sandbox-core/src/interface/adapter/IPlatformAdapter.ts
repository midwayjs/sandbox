export interface IPlatformIdentification {
  scopeName: string;
  scope: string;
}
export interface IPlatformInfo {}
export interface IPlatformHost {
  ip: string;
  hostname?: string;
}

export interface IPlatformGroup {
  name: string;
  hosts: IPlatformHost[];
}

export interface IPlatformHostResult<T> {
  [env: string]: T[];
}

export interface ICodeInfo {
  length?: number;
  [index: number]: any;
}

export interface ISecInfo {
  buildPlatform: string;
  dataInfoType: string;
  deployType: string;
  downloadType: string;
  isBackstageSystem: boolean;
  isCapitalTransaction: boolean;
  isConsumer: boolean;
  isDataRelated: boolean;
  isDownloadable: boolean;
  isInCom: boolean;
  isInNet: boolean;
  isOutCom: boolean;
  isOutNet: boolean;
  isSaler: boolean;
  isSensitive: boolean;
  isUrlAvailable: boolean;
  isUseWebx3: boolean;
  isVipBenefits: boolean;
  isVipInfo: boolean;
  isVipMotivate: boolean;
  isVipRelated: boolean;
  otherBuildPlatform: string;
  otherFramework: string;
  otherPublishPlatform: string;
  publishPlatform: string;
  userGroup: string;
  framework: string;
}

export interface ICodeAndSecInfo {
  codeInfo: ICodeInfo;
  secInfo: ISecInfo;
}

export type IStringOrNumber = string | number;
export interface IPlatformAdapter {
  name: string;
  getCodeInfoAndSecInfo?(opts: {[key: string]: IStringOrNumber }): Promise<ICodeAndSecInfo>;
  getDetail?(app: IPlatformIdentification): Promise<IPlatformInfo>;
  getHosts(app: IPlatformIdentification): Promise<IPlatformHostResult<IPlatformGroup>>;
  getHostsByApplication?(scopeName: string): Promise<any[]>;
  getDailyIpList?(scopeName: string): Promise<any>;
}

export interface IAoneIdentification extends IPlatformIdentification {
  aoneId?: string;
}

export interface IAoneUserInfo {
  bucId: string;
  emailPrefix: string;
  firstName: string;
  empId: string;
  userName: string;
  emailAddr: string;
}

export interface IAoneDetail extends IPlatformInfo {
  id: string;
  k2id: string;
  productId: string;
  name: string;
  tags: string[];
  status: string;
  dba: IAoneUserInfo[];
  env: string;
  pe: IAoneUserInfo[];
  codeModuleUrl: string;
  deployType: string;
  description: string;
  devTL: IAoneUserInfo[];
  appIntgLd: IAoneUserInfo[];
  sec: IAoneUserInfo[];
  testTL: IAoneUserInfo[];
  appops: IAoneUserInfo[];
  grade: string;
  scm: IAoneUserInfo[];
  secTester: IAoneUserInfo[];
  testEnvOwner: IAoneUserInfo[];
  isUnitApp: string;
  isSensitive: string;
  isBackstageSystem: string;
  offUrl: string;
  createDate: string;
}

export interface IAoneHost extends IPlatformHost {
  ip: string;
  hostname?: string;
}
