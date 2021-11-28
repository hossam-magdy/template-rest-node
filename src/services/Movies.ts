import { InjectRepository, Service } from '@/di';
import { MoviesRepository } from '@/repositories/Movies';

@Service()
export class MoviesService {
  constructor(@InjectRepository() private moviesRepo: MoviesRepository) {}

  getSampleMovie() {
    return this.moviesRepo.findOne();
  }

  getMovies() {
    return this.moviesRepo.find();
  }
}
