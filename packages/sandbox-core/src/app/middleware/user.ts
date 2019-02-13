import * as assert from 'assert';

export default function admin(options, app) {
  return async (ctx, next) => {
    /*
      TODO: implement of user middleware here
    */

    assert(ctx.uid, 'must implement user middleware and set ctx.uid');
    await next();
  };
}
