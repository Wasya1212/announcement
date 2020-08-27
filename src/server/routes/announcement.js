const Router = require('koa-router');

const router = new Router();

router.post('/announcement', async (ctx, next) => {
  console.log("announcement creation!!!");

  const filesKeys = Object.keys(ctx.request.files || {});
  let query = {};

  Object.keys(ctx.request.body).forEach(key => {
    try {
      query[key] = JSON.parse(ctx.request.body[key]);
    } catch (err) {
      query[key] = ctx.request.body[key];
    }
  });

  // console.log(ctx.request.body);
  console.log(ctx.request.files);

  ctx.body = "announcement created!!!";

  await next();
});

module.exports = router;
