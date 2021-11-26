import Koa from 'koa';
import { listRoutes } from '@/helpers';
import { composedMiddlewares } from '@/middlewares';
import { router } from '@/router';

const PORT = 3000;

const app = new Koa();

app.use(composedMiddlewares);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Listening to ${PORT} ...`);
});

console.log('[DEBUG] Routes registered:', listRoutes(router));
