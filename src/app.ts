import Koa from 'koa';
import { composedMiddlewares } from './middlewares';
import { router } from './router';

const app = new Koa();

app.use(composedMiddlewares);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Koa started');
});

//#region
const listRoutes = (r: typeof router) =>
  r.stack.map((route) => route.methods.map((m) => `${m} ${route.path}`)).flat();
console.log('Routes registered:', listRoutes(router));
//#endregion
