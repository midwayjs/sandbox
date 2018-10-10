export default function admin(options, app) {
  return async (ctx, next) => {
    const isAdmin = true;
    ctx.isAdmin = isAdmin;
    ctx.locals.isAdmin = isAdmin;
    const uid = '0';
    ctx.uid = uid;
    await next();
  };
}
