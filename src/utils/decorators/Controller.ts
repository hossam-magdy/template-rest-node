import { Service } from '@/di';

/**
 * Registers Controller class in DI container,
 * with identifier = className (as string).
 *
 * `@Controller()` decorator
 *   is equivalent to
 * `@Service({ id: 'ClassName' })` decorator
 *
 * Because @Route decorator need the controllers
 * to be registered with their name as identifier
 * (to be able to use DI Container for instantiating)
 */
export const Controller = (
  options?: Parameters<typeof Service>[0]
): Function => {
  return (targetConstructor: any) => {
    options = { ...(options || {}), id: targetConstructor.name };
    // console.log({ options, targetConstructor });
    return Service(options)(targetConstructor);
  };
};
