import * as Koa from 'koa';
import { ParameterizedContext } from 'koa';

export { ParameterizedContext as Context };

export type ControllerAction<
  StateT = Koa.DefaultState,
  ContextT = Koa.DefaultContext,
  ResponseBodyT = unknown
> =
  // | Koa.Middleware<StateT, ContextT, ResponseBodyT> |
  (
    ctx: Koa.ParameterizedContext<StateT, ContextT, ResponseBodyT>,
    next?: Koa.Next
  ) => any; // void | Promise<void>; // setting to any is needed for middlewares
