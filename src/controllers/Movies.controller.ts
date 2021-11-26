import { Context } from '@/types';
import { Route, Validate } from '@/decorators';

export class MoviesController {
  // GET /movies?genre=Science+Fiction&offset=0&limit=10
  @Route('GET', '/movies')
  @Validate([])
  static index(ctx: Context) {
    ctx.body = { foo: 'bar' };
  }
}
