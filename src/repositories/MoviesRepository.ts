import { EntityRepository, Repository, Service } from '@/di';
import { Movie } from '@/models/Movie';

@Service() // for DI
@EntityRepository(Movie) // for registration as entity repository
export class MoviesRepository extends Repository<Movie> {
  foo() {
    return 'bar';
  }
}
