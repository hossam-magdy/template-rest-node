import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import json from 'koa-json';
import logger from 'koa-logger';
import serve from 'koa-static';

export const composedMiddlewares = compose([
  json(),
  logger(),
  bodyParser(),
  serve(__dirname + '/../public'),
]);
