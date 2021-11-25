import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import json from 'koa-json';
import logger from 'koa-logger';

export const composedMiddlewares = compose([json(), logger(), bodyParser()]);
