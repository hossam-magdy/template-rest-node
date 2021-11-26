import { Context } from 'koa';

export { Context };
export type ControllerAction = (ctx: Context) => void | Promise<void>;
