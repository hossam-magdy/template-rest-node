import { Route, Validate, ValidatedContext } from '@/decorators';
import { Context } from '@/types';

export class MoviesController {
  // GET /movies?genre=Science+Fiction&offset=0&limit=10
  @Route('GET', '/movies')
  @Validate([
    // {
    //   param_key: 'abc',
    //   required: true,
    //   type: 'string',
    //   validator_functions: [
    //     (param) => {
    //       return param.length === 10;
    //     },
    //   ],
    // },
    // {
    //   def: Validate.body().number().integer().min(1900).max(2013).required(),
    //   abc: Validate.query().string().alphanum().min(3).max(30),
    //   ghi: Validate.body().string().email(),
    //   jkl: Validate.body().array().string().email().message('Invalid user email'),
    //   mno: Validate.urlParam().validator((i) => !isNaN(parseInt(i))),
    // },
  ])
  static index(ctx: Context) {
    ctx.body = { foo: 'bar' };
  }

  @Route('GET', '/movies/:id')
  @Validate([])
  static async get(ctx: ValidatedContext<{ abcdef: 'aa1' }, {}>) {
    console.log({ validatedParams: ctx.validatedParams });
    ctx.body = { foo2: 'bar2' };
  }
}
