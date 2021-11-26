import * as Controllers from '@/controllers';
import { Route } from '@/decorators';
import Router from 'koa-router';

// Old way, without decorators
// router.get('/movies', MoviesController.index);

/**
 * This variable is only for TSC to load all the JS modules or files '@/controllers'.
 * So TSC actually executes the decorators and controllers are registered
 */
const controllersClassNames = Object.values(Controllers).map((c) => c.name);

export const router = new Router();
// console.log({ routes });

// Registering all routes from decorator
Route.decoratedRoutes.map((decoratedRoute) => {
  if (!controllersClassNames.includes(decoratedRoute.className)) {
    throw new Error(
      `Trying to register route "${decoratedRoute.path}" with className "${decoratedRoute.className}", but the class doesn't exist`
    );
  }
  router.register(
    decoratedRoute.path,
    [decoratedRoute.method],
    decoratedRoute.controllerAction
  );
});
