import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

// Hello world
router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Hello world!' };

  await next();
});

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Koa started');
});
