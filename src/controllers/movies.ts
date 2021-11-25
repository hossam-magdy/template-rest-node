import { ControllerAction } from '@/types';

export class MoviesController {
  // GET /movies?genre=Science+Fiction&offset=0&limit=10
  static index: ControllerAction = (ctx) => {
    console.log({ ctxQuery: ctx.query });
    ctx.body = { foo: 'bar' };
  };
}
