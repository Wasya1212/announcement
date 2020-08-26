const Http = require('http');

const Koa = require('koa');

const PORT = process.env.PORT || 5000;

const app = new Koa();

const router = require('./routes');

app.use(router.routes());
app.use(router.allowedMethods());

const server = Http.createServer(app.callback());

server.listen(PORT, () => {
  console.log(`Server work on port: ${PORT}`);
});
