import { router } from '@/router';

export const listRoutes = (r: typeof router) =>
  r.stack.map((route) => route.methods.map((m) => `${m} ${route.path}`)).flat();
