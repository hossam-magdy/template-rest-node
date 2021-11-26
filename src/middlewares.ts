import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import json from 'koa-json';
import logger from 'koa-logger';
import serve from 'koa-static';
import { PUBLIC_DIR, PUBLIC_FILES_EXT } from './config';

export const composedMiddlewares = compose([
  json(),
  logger(),
  bodyParser(),
  serve(PUBLIC_DIR, { extensions: PUBLIC_FILES_EXT }),
]);
