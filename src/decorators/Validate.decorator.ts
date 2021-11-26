import { Context, ControllerAction } from '@/types';

//#region types
type ParsedUrlQuery = NodeJS.Dict<string | string[]>;
type ValidatedParams<
  QueryParamsT = ParsedUrlQuery,
  BodyParamsT = unknown,
  PathParamsT = {}
> = {
  query: QueryParamsT;
  body: BodyParamsT;
  path: PathParamsT;
};

export type ValidatedControllerAction<
  QueryParamsT = ParsedUrlQuery,
  BodyParamsT = unknown,
  PathParamsT = {}
> = ControllerAction<
  any, // TODO do not change type of state
  { validatedParams: ValidatedParams<QueryParamsT, BodyParamsT, PathParamsT> },
  unknown
>;

export type ValidatedContext<
  QueryParamsT = ParsedUrlQuery,
  BodyParamsT = {},
  PathParamsT = unknown
> = Parameters<
  ValidatedControllerAction<QueryParamsT, BodyParamsT, PathParamsT>
>[0];

type ValidationConfig =
  | {
      // TODO
    }
  | undefined;
type ValueLocation = 'query' | 'params' | 'body';
//#endregion

class SingleValueValidator {
  constructor(ctx: Context, location: ValueLocation) {}
}

const runValidation = (config: ValidationConfig, ctx: Context) => {
  const valuesToValidate = {
    query: ctx.request.query,
    path: ctx.params,
    body: ctx.request.body,
  };

  // .query
  // .body
  // .urlPath

  // .number;
  // .object().keys({ … validators … })
  // .array;
  // .string;
  // .integer;
  // .min;
  // .max;
  // .alphanum;
  // .email;
  // .required;
  // .regex(/^[a-zA-Z0-9]{3,30}$/)

  // .validator(() => boolean);
  // .message('Invalid user email')

  console.log(
    `[TODO] validating request; Config: ${JSON.stringify(
      config
    )}, Values: ${JSON.stringify(valuesToValidate)}`
  );
  // console.log({ validationConfig: config, valuesToValidate });

  // throw new Error('Example validation Error');
};

export const Validate = (config?: ValidationConfig) => {
  type ControllerActionWithAnyParams = ValidatedControllerAction<any, any, any>;

  return (
    target: any,
    propertyName: string,
    descriptor?: TypedPropertyDescriptor<ControllerActionWithAnyParams>
  ) => {
    const getControllerActionWithValidation = (
      origControllerAction: ControllerActionWithAnyParams
    ): ControllerActionWithAnyParams => {
      return (ctx, next) => {
        try {
          runValidation(config, ctx);
          return origControllerAction(ctx, next);
        } catch (errors) {
          ctx.status = 400;
          ctx.body = { message: 'Validation Error', errors };
        }
      };
    };

    // for methods/regular-functions. I.e: class SampleController { static index(ctx) { … } }
    if (descriptor && descriptor.value) {
      const origControllerAction = descriptor.value;
      descriptor.value =
        getControllerActionWithValidation(origControllerAction);
    }
    // for properties/arrow-functions. I.e: class SampleController { static index = (ctx) => { … } }
    else if (typeof target[propertyName] === 'function') {
      const origControllerAction = target[propertyName];
      target[propertyName] =
        getControllerActionWithValidation(origControllerAction);
    }
  };
};
