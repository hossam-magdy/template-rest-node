import Koa from 'koa';
import { composedMiddlewares } from './middlewares';
import { router } from './router';

const app = new Koa();

app.use(composedMiddlewares);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Koa started');
});
