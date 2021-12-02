import { MoviesController } from '@/controllers/MoviesController';
import { Route } from '@/utils/decorators';
import Router from '@koa/router';

// Previously / without decorators
// router.get('/movies', MoviesController.index);

/**
 * This is only to consume imported controllers for TSC to load all their JS modules/files.
 * So that TSC actually executes the decorators and controllers are registered.
 */
[MoviesController].forEach((c) => c.name);

export const router = new Router();
// console.log({ routes });

// Registering all routes from decorator (decorators are already evaluated)
Route.decoratedRoutes.forEach((decoratedRoute) => {
  router.register(
    decoratedRoute.path,
    [decoratedRoute.method],
    decoratedRoute.controllerAction
  );
});
