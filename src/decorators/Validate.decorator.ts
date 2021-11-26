import {
  Context,
  ControllerAction as NonValidatedControllerAction,
} from '@/types';
import Joi from 'joi';

/**
 * - Exmple usage of the decorator:
 *
 * GET http://localhost:3000/movies/19?offset=1800&limit=52
 *
 * ```ts
 * @Route('GET', '/movies/:id')
 * @Validate({
 *   id: Validate.path().number().required().label('Movie ID'),
 *   offset: Validate.query().number().min(0),
 *   limit: Validate.query().number().min(5).max(100).default(10).label('Limit'),
 *   //  def: Validate.query().number().integer().min(1900).max(2013).required(),
 *   //  ghi: Validate.body().string().email(),
 *   //  jkl: Validate.body().array().items(Validate.schema.number()).required(),
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
type ParsedUrlQuery = NodeJS.Dict<string | string[]>;
type ValidatedParamsContext<
  QueryParamsT = ParsedUrlQuery,
  BodyParamsT = unknown,
  PathParamsT = {}
> = {
  validatedParams: {
    query: QueryParamsT;
    body: BodyParamsT;
    path: PathParamsT;
  };
};

type ValueLocation = 'query' | 'body' | 'path';

type ValidationConfig = Record<string, ValidatorRuleBuilderWithJoiSchema>;
type ValidatorRuleBuilderWithJoiRoot = Joi.Root & ValidatorRuleBuilder;
type ValidatorRuleBuilderWithJoiSchema = Joi.Schema &
  Partial<ValidatorRuleBuilder>;
//#endregion

class ValidatorRuleBuilder {
  private schema: Joi.Root;

  constructor(public location: ValueLocation) {
    this.schema = Joi;

    // This is to Proxy any method calls into Joi
    // The typings (for autocompletion) are handled too, separately
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
    path: ctx.params,
    body: ctx.request.body,
  } as const;

  const resultEntries = Object.entries(config).map(([k, v]) => {
    // Proxy already works. This is just for typings
    if (!v.location || !v.getSchema) throw '';

    const value =
      valuesToValidate[v.location] && valuesToValidate[v.location][k];
    // console.log({ value });
    try {
      const validationResult = v.getSchema().validate(value);
      return [k, validationResult] as const;
    } catch (e) {
      console.error('[ERROR] unexpected error in runValidation', { e, v });
      throw e;
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

  const values = Object.fromEntries<typeof valuesToValidate>(
    resultEntries.map(([k, v]) => [k, v.value])
  );
  ctx.validatedParams = values;
};

export const Validate = (config: ValidationConfig) => {
  type AnyControllerAction = Validate.ControllerAction<any, any, any> &
    Record<string, any>; // for checking if the controllerAction is already __routed__ (i.e: @Validate above @Route)

  const getControllerActionWithValidation = (
    origControllerAction: AnyControllerAction,
    controllerActionPath: string
  ): AnyControllerAction => {
    if (origControllerAction.__routed__) {
      throw Error(
        `[ERROR] @Route decorator must be the top-most one (${controllerActionPath})`
      );
    }
    const newControllerAction: AnyControllerAction = (ctx, next) => {
      try {
        runValidation(config, ctx);
        return origControllerAction(ctx, next);
      } catch (errors) {
        ctx.status = 400;
        ctx.body = { message: 'Validation Error', errors };
      }
    };

    newControllerAction.__validated__ = true;
    return newControllerAction;
  };

  return (
    target: any,
    propertyName: string,
    descriptor?: TypedPropertyDescriptor<AnyControllerAction>
  ) => {
    const controllerActionPath = `${target.name}.${propertyName}`;

    // for methods/regular-functions. I.e: class SampleController { static index(ctx) { … } }
    if (descriptor && descriptor.value) {
      const origControllerAction = descriptor.value;
      descriptor.value = getControllerActionWithValidation(
        origControllerAction,
        controllerActionPath
      );
      return;
    }

    // for properties/arrow-functions. I.e: class SampleController { static index = (ctx) => { … } }
    if (typeof target[propertyName] === 'function') {
      const origControllerAction = target[propertyName];
      target[propertyName] = getControllerActionWithValidation(
        origControllerAction,
        controllerActionPath
      );
      return;
    }

    throw '[ERROR] Cannot find the controller action method';
  };
};

Validate.from = (location: ValueLocation) =>
  new ValidatorRuleBuilder(location) as ValidatorRuleBuilderWithJoiRoot;
Validate.query = () => Validate.from('query');
Validate.body = () => Validate.from('body');
Validate.path = () => Validate.from('path');
Validate.schema = Joi;

export namespace Validate {
  // for usage is controllers
  export type ControllerAction<
    QueryParamsT = ParsedUrlQuery,
    BodyParamsT = unknown,
    PathParamsT = {}
  > = NonValidatedControllerAction<
    any, // TODO do not change type of state
    ValidatedParamsContext<QueryParamsT, BodyParamsT, PathParamsT>,
    unknown
  >;

  // for usage is controllers
  export type Context<
    QueryParamsT = ParsedUrlQuery,
    BodyParamsT = {},
    PathParamsT = unknown
  > = Parameters<ControllerAction<QueryParamsT, BodyParamsT, PathParamsT>>[0];
}
