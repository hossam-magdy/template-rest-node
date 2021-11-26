import { Route, Validate } from '@/decorators';
import { Context } from '@/types';

export class MoviesController {
  // GET /movies?genre=Science+Fiction&offset=0&limit=10
  @Route('GET', '/movies')
  @Validate({
    genre: Validate.query().string().min(3).max(25).required().label('Genre'),
    offset: Validate.query().number().min(0).label('Offset'),
    limit: Validate.query().number().min(5).max(100).default(10).label('Limit'),
  })
  static index(
    ctx: Validate.Context<{ genre: string; offset: number; limit: number }>
  ) {
    console.log({ validatedParams: ctx.validatedParams });
    ctx.body = { foo: 'bar' };
  }

  @Route('GET', '/movies/:id')
  static async get(ctx: Context) {
    ctx.body = { foo2: 'bar2' };
  }
}
