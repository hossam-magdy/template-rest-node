import Router from 'koa-router';
import { MoviesController } from './controllers/movies';

export const router = new Router();

router.get('/movies', MoviesController.index);
