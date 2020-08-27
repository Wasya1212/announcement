const Http = require('http');
const Koa = require('koa');
const Cors = require('@koa/cors');
const BodyParser = require('koa-body');

const Mongoose = require('./middleware/mongoose');
const ErrorHandler = require('./middleware/error-handler');
const Logger = require('./middleware/logger');

const { FeedRouter, AnnouncementRouter } = require('./routes');

const PORT = process.env.PORT || 5000;

const app = new Koa();

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(Cors());
app.use(ErrorHandler({ errorLogger: Logger, logMethodName: 'error' }));
app.use(BodyParser({
  formLimit: '10mb',
  formidable: {
    uploadDir: __dirname + '/uploads', // будь-який дєбіл може надіслати тонну файликів і сервак ляже, навіть якщо він не авторизований. ВИПРАВИТИ!
    keepExtensions: true
  },
  multipart: true,
  urlencoded: true
}));

app.use(FeedRouter.routes());
app.use(FeedRouter.allowedMethods());
app.use(AnnouncementRouter.routes());
app.use(AnnouncementRouter.allowedMethods());

const server = Http.createServer(app.callback());

Mongoose.connect();

process.on('exit', (code) => {
   Mongoose.closeConnection();
   console.log(`About to exit with code: ${code}`);
});

process.on('SIGINT', function() {
   console.log("Caught interrupt signal");
   process.exit();
});

function listeningReporter () {
  const { address, port } = this.address();
  const protocol = this.addContext ? 'https' : 'http';
  console.log(`Listening on ${protocol}://${address}:${port}...`);
};

server.listen(PORT, () => {
  console.log(`Server work on port: ${PORT}`);
});
