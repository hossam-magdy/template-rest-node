import { Container } from '@/di';

export const extractControllerAction = <T>(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<T>
): {
  className: string;
  classMethodName: string;
  controllerAction: T | (T & { __deferred__: true });
  setControllerAction: (cb: T) => void;
} => {
  const isProperty = !descriptor; // `[static] get = () => {}`
  const isStatic = !!target.name; // `static get(){}` OR `static get = () => {}`
  const isInstance = !isStatic && !!target.constructor.name; // `get(){}` OR `get = () => {}`

  if (isProperty) {
    throw new Error(
      '[extractControllerAction] Unknown descriptor, controller actions must be class methods, NOT class properties'
    );
  }

  // console.log(
  //   { isProperty, isStatic, isInstance },
  //   { target, propertyName, descriptor }
  // );

  const className =
    target.name || // for @Route on a STATIC method
    target.constructor.name; // for @Route on an INSTANCE/non-static method
  const classMethodName = propertyName;
  const method = target[classMethodName];

  if (
    !className ||
    !classMethodName ||
    !method ||
    typeof method !== 'function'
  ) {
    throw new Error(
      `[extractControllerAction] Unknown controllerAction method: ${className}.${classMethodName}`
    );
  }

  /*
   * Deferred evaluation of controllerAction, if it's a CLASS-INSTANCE METHOD
   * Why?! Because Controllers are NOT YET registered in the DI Container.
   * Why?! Because Method decorators (i.e: @Route) are being evaluated before Class Decorators (i.e: @Service)
   * Reference: https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-evaluation
   */
  const deferredMethod = Object.assign(
    function deferredMethod(...args: any[]) {
      // Resolve "this" (the instance) from DI container
      const instance = Container.get<any>(className);
      // console.log('[deferredMethod] original method: ', method, '; instance: ', instance);
      return method.call(instance, ...args);
    },
    { __deferred__: true }
  ) as unknown as T & { __deferred__: true };

  const controllerAction =
    isInstance &&
    /*
     * `__deferred__` is an "extra" guard against infinite recursiveness,
     * which already should not happen, if `method`
     * in`method.call(instance, ...args)` is the proper value
     */
    !method.__deferred__
      ? deferredMethod
      : method;

  const setControllerAction = (cb: T) => {
    target[propertyName] = cb;
  };

  return { className, classMethodName, controllerAction, setControllerAction };
};
