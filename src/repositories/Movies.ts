import { EntityRepository, Repository, Service } from '@/di';
import { Movie } from '@/models/Movie';

@Service()
@EntityRepository(Movie)
export class MoviesRepository extends Repository<Movie> {
  foo() {
    return 'bar';
  }
}
