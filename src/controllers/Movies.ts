import { Controller, Route, Validate } from '@/decorators';
import { MoviesService } from '@/services/Movies';

@Controller()
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  // GET /movies?genre=Science+Fiction&offset=0&limit=10
  @Route('GET', '/movies')
  @Validate({
    genre: Validate.query().string().min(3).max(25).required().label('Genre'),
    offset: Validate.query().number().min(0).label('Offset'),
    limit: Validate.query().number().min(5).max(100).default(10).label('Limit'),
  })
  async index(
    ctx: Validate.Context<{ genre: string; offset: number; limit: number }>
  ) {
    ctx.body = {
      from: 'instance method',
      validatedParams: ctx.validatedParams,
      movie: await this.moviesService.getSampleMovie(),
      movies: await this.moviesService.getMovies(),
    };
  }

  @Route('GET', '/movies/:id')
  @Validate({ id: Validate.path().number().min(1).required() })
  static async get(ctx: Validate.Context<{ id: number }>) {
    ctx.body = {
      from: 'static method',
      validatedParams: ctx.validatedParams,
    };
  }
}
