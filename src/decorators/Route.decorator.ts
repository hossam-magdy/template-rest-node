import { ControllerAction } from '@/types';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

type AnyControllerAction = ControllerAction<any, any, any> &
  Record<string, any>;

type DecoratedRoute = {
  method: Method;
  path: string;
  className: string;
  propertyName: string;
  controllerAction: AnyControllerAction;
};

const routes: DecoratedRoute[] = [];

export const Route = (method: Method, path: string) => {
  return <T extends AnyControllerAction>(
    target: any,
    propertyName: string,
    descriptor?: TypedPropertyDescriptor<T>
  ) => {
    // console.log({ target, propertyName, descriptor });
    const controllerAction =
      // for methods/regular-functions. I.e: class SampleController { static index(ctx) { … } }
      (descriptor && descriptor.value) ||
      // for properties/arrow-functions. I.e: class SampleController { static index = (ctx) => { … } }
      (target[propertyName] as T);
    if (!controllerAction || typeof controllerAction !== 'function') {
      throw new Error(`Unknown controllerAction for route "${method} ${path}"`);
    }

    const className = target.name;
    if (!className) {
      throw new Error(
        `Unknown className for route "${method} ${path}". (Hint: ensure the controller action is static!)`
      );
    }

    Route.decoratedRoutes.push({
      method,
      path,
      className,
      propertyName,
      controllerAction,
    });

    Object.assign(controllerAction, { __routed__: true });
  };
};
Route.decoratedRoutes = routes;
