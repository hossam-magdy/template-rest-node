import {
  Context,
  ControllerAction as NonValidatedControllerAction,
} from '@/types';
import Joi from 'joi';
import { extractControllerAction } from './extractControllerAction';

/**
 * - Exmple usage of the decorator:
 *
 * GET http://localhost:3000/movies/19?offset=1800&limit=52
 *
 * ```ts
 * @Route('GET', '/movies/:id')
 * @Validate({                      // <-----------------------
 *   id: Validate.path().number().required().label('Movie ID'),
 *   offset: Validate.query().number().min(0),
 *   limit: Validate.query().number().min(5).max(100).default(10).label('Limit'),
 *   //  def: Validate.body().number().integer().min(1900).max(2013).required(),
 *   //  ghi: Validate.cookies().string().email(),
 *   //  jkl: Validate.from(['body', 'query']).array().items(Validate.schema.number()).required(),
 * })
 * static index(
 *   ctx: ValidatedContext<{ offset: number; limit: number }, {}, { id: number }>
 * ) {
 *   console.log({ validatedParams: ctx.validatedParams });
 *   ctx.body = { foo: 'bar' };
 * }
 * ```
 *
 * Reference for all the rules: https://joi.dev/api/?v=17.4.2
 */

//#region types
type ValidatedParamsContext<ParamsT> = { validatedParams: ParamsT };

type AnyControllerAction = NonValidatedControllerAction<any, any, any> &
  Record<string, any>; // for checking if the controllerAction is already __routed__ (i.e: @Validate above @Route)

type ParameterSource = 'query' | 'body' | 'path' | 'cookies';

type ValidationSchemaBuilderWithJoiRoot = Joi.Root & ValidationSchemaBuilder;
type ValidationSchemaBuilderWithJoiSchema = Joi.Schema &
  Partial<ValidationSchemaBuilder>;

type ValidationConfig = Record<string, ValidationSchemaBuilderWithJoiSchema>;
//#endregion

class ValidationSchemaBuilder {
  private schema = Joi;

  constructor(public sources: ParameterSource[]) {
    // This is to Proxy any method invocations into "Joi"
    // The typings (i.e: autocompletion) are handled too, separately
    const proxy = new Proxy(this, {
      get(target, name) {
        const valFromSchema = (target.schema as any)[name as any];
        if (typeof valFromSchema === 'function') {
          return (...args: any[]) => {
            // console.log('[] Calling: ', name);
            target.schema = valFromSchema.call(target.schema, ...args);
            return proxy;
          };
        }

        const valFromClass = (target as any)[name as any];
        return valFromClass;
      },
    });
    return proxy;
  }

  getSchema(): Joi.Schema {
    return this.schema as unknown as Joi.Schema;
  }
}

const runValidation = (config: ValidationConfig, ctx: Context) => {
  const valuesToValidate = {
    query: ctx.request.query,
    body: ctx.request.body,
    path: ctx.params,
  } as const;
  const extractValue = (paramKey: string, source: ParameterSource) => {
    return source === 'cookies'
      ? ctx.cookies.get(paramKey)
      : valuesToValidate[source] && valuesToValidate[source][paramKey];
  };

  const resultEntries = Object.entries(config).map(([paramKey, builder]) => {
    // Proxy already works. This is just for typings
    if (!builder.sources || !builder.getSchema) throw '';

    const value = builder.sources
      .map((source) => extractValue(paramKey, source))
      // Return the first found value, from the list of the prioritized sources/fromField (body, query, …)
      .find((v) => !!v);

    // console.log({ value });
    try {
      const validationResult = builder.getSchema().validate(value);
      return [paramKey, validationResult] as const;
    } catch (error) {
      console.error('[ERROR] unexpected error in runValidation', {
        error,
        builder,
      });
      throw error;
    }
  });

  const hasErrors = resultEntries.some(([, v]) => !!v.error);
  if (hasErrors) {
    const errors = Object.fromEntries(
      resultEntries.map(([k, v]) => [k, v.error?.message])
    );
    throw errors;
  }

  const hasWarnings = resultEntries.some(([, v]) => !!v.warning);
  if (hasWarnings) {
    const warnings = Object.fromEntries(
      resultEntries.map(([k, v]) => [k, v.warning?.message])
    );
    throw warnings;
  }

  const validatedParams = Object.fromEntries(
    resultEntries.map(([k, v]) => [k, v.value])
  );
  return validatedParams;
};

const wrapControllerActionWithValidation = <T extends AnyControllerAction>(
  validationConfig: ValidationConfig,
  origControllerAction: T,
  controllerActionPath: string
): T => {
  if (origControllerAction.__routed__) {
    throw Error(
      `[ERROR] @Validator decorator must be below the @Route; Preferably @Route to be the top-most; (${controllerActionPath})`
    );
  }
  const newControllerAction: AnyControllerAction = (ctx, next) => {
    try {
      const validatedParams = runValidation(validationConfig, ctx);
      // console.log({ validatedParams }); // can be used to detect infinite recursiveness, within a deffered controller action
      ctx.validatedParams = validatedParams;
      return origControllerAction(ctx, next);
    } catch (errors) {
      ctx.status = 400;
      ctx.body = { message: 'Validation Error', errors };
    }
  };

  Object.assign(newControllerAction, {
    ...origControllerAction, // extracts all meta data from orig function; Not to lose ".__deferred__" for example
    __validated__: true,
  });
  return newControllerAction as T;
};

export const Validate = <T extends ValidationConfig>(validationConfig: T) => {
  type Action = Validate.ControllerAction<Record<keyof T, any>>;
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<Action>
  ) => {
    const controllerActionPath = `${target.name}.${propertyName}`;

    const { controllerAction, setControllerAction } = extractControllerAction(
      target,
      propertyName,
      descriptor
    );

    setControllerAction(
      wrapControllerActionWithValidation(
        validationConfig,
        controllerAction,
        controllerActionPath
      )
    );
  };
};

Validate.from = (prioritizedSources: ParameterSource[]) =>
  new ValidationSchemaBuilder(
    prioritizedSources
  ) as ValidationSchemaBuilderWithJoiRoot;
Validate.query = () => Validate.from(['query']);
Validate.body = () => Validate.from(['body']);
Validate.path = () => Validate.from(['path']);
Validate.cookies = () => Validate.from(['cookies']);
Validate.schema = Joi;

export namespace Validate {
  // for usage in controllers
  export type ControllerAction<ParamsT = unknown> =
    NonValidatedControllerAction<any, ValidatedParamsContext<ParamsT>, unknown>;

  // for usage in controllers
  export type Context<ParamsT = unknown> = Parameters<
    ControllerAction<ParamsT>
  >[0];
}
