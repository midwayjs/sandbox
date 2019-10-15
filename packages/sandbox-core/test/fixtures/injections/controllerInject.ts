import { provide } from 'midway-web';
import { RemoteDebugCtrl } from '../../../src/app/controller/remoteDebugCtrl';
import { ErrorCtrl } from '../../../src/app/controller/errorCtrl';
import { ApplicationCtrl } from '../../../src/app/controller/applicationCtrl';

@provide('remoteDebugCtrl')
export class RemoteDebugCtrlTest extends RemoteDebugCtrl {}

@provide('errorCtrl')
export class ErrorCtrlTest extends ErrorCtrl {}

@provide('applicationCtrl')
export class ApplicationCtrlTest extends ApplicationCtrl {}
