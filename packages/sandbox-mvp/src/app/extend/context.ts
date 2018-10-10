import { BaseContext } from 'koa';
export default {
  jsonRes(this: BaseContext, error, data) {
    const dataType: any = (typeof data) || null;
    if (error) {
      this.body = { success: false, msg: error.message, data: null, code: error.code, dataType };
      return true;
    }
    this.body = { success: true, msg: 'success', dataType, data, code: 0 };
    return false;
  }
};
