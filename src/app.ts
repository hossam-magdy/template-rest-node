import 'reflect-metadata'; // for decorators of "typeorm", "typedi", "typeorm-typedi-extensions"
import Koa from 'koa';
import { listRoutes } from '@/utils';
import { composedMiddlewares } from '@/middlewares';
import { router } from '@/router';
import { PORT } from './config';
import { dbConnection } from './database';

const app = new Koa();

app.use(composedMiddlewares);

app.use(router.routes()).use(router.allowedMethods());

dbConnection
  .then(() => {
    console.log(`Connected to db`);
    app.listen(PORT, () => {
      console.log(`Listening to ${PORT} ...`);
    });
  })
  .catch((error) => {
    console.error(`[ERROR] Unable to connect to db ...`, error);
  });

console.log('[DEBUG] Routes registered:', listRoutes(router));
