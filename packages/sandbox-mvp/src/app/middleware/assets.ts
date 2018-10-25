export default function assets(options, app) {
  return async (ctx, next) => {
    ctx.locals.publicPath = '//g.alicdn.com/midway/sandbox-newui/0.0.8/';
    ctx.locals.env = 'prod';
    await next();
  };
}
