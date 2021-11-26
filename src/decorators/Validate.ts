import { Context, ControllerAction } from '@/types';

type ValidationConfig = {} | undefined;

const runValidation = (config: ValidationConfig, ctx: Context) => {
  const valuesToValidate = {
    query: ctx.request.query,
    params: ctx.params,
    body: ctx.request.body,
  };

  console.log(
    `[TODO] validating request; Config: ${JSON.stringify(
      config
    )}, Values: ${JSON.stringify(valuesToValidate)}`
  );
  // console.log({ validationConfig: config, valuesToValidate });

  // throw new Error('Example validation Error');
};

export const Validate = (config?: ValidationConfig) => {
  return (
    target: any,
    propertyName: string,
    descriptor?: TypedPropertyDescriptor<ControllerAction>
  ) => {
    const getControllerActionWithValidation = (
      origControllerAction: ControllerAction
    ): ControllerAction => {
      return (ctx: Context) => {
        try {
          runValidation(config, ctx);
          origControllerAction(ctx);
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
