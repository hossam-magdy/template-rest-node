import { ControllerAction } from '@/types';
import { extractControllerAction } from './extractControllerAction';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

type AnyControllerAction = ControllerAction<any, any, any> &
  Record<string, any>;

type DecoratedRoute = {
  method: Method;
  path: string;
  className: string;
  classMethodName: string;
  controllerAction: AnyControllerAction;
};

const routes: DecoratedRoute[] = [];

export const Route = (method: Method, path: string) => {
  return <T extends AnyControllerAction>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const { className, classMethodName, controllerAction } =
      extractControllerAction(target, propertyName, descriptor);

    Route.decoratedRoutes.push({
      method,
      path,
      className,
      classMethodName,
      controllerAction,
    });

    Object.assign(controllerAction, { __routed__: true });
  };
};
Route.decoratedRoutes = routes;
