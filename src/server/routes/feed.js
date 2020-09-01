const { createReadStream } = require('fs');
const Path = require('path');

const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx) => {
  ctx.type = "html";
  ctx.body = createReadStream(Path.resolve(__dirname, '../public/html/index.html'));
});

module.exports = router;
