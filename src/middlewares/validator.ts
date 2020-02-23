import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

type ReqParams = 'body' | 'query'
type ValidationProperties = Readonly<Partial<Record<ReqParams, Joi.ObjectSchema>>>
type ValidationResult = {
  errors: Partial<Record<ReqParams, Joi.ValidationError>>
  validated: Partial<Record<ReqParams, unknown>>
}

const validateAll = (req: express.Request) => (
  result: ValidationResult,
  [target, schema]: [ReqParams, Joi.ObjectSchema]
): ValidationResult => {
  /* eslint-disable security/detect-object-injection */
  const { error, value: data } = schema.validate(req[target], {
    stripUnknown: { arrays: false, objects: true },
  })

  if (error) {
    result.errors[target] = error
  } else {
    result.validated[target] = data
  }
  return result
  /* eslint-enable security/detect-object-injection */
}

export interface ValidatedRequest<T extends ValidationProperties> extends express.Request {
  query: T['query'] extends Joi.ObjectSchema<infer C> ? C : undefined
  body: T['body'] extends Joi.ObjectSchema<infer C> ? C : undefined
}

export const validate = (schemas: ValidationProperties) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const schemasToValidate = Object.entries(schemas) as [ReqParams, Joi.ObjectSchema][]
  const result = schemasToValidate.reduce<ValidationResult>(validateAll(req), {
    errors: {},
    validated: {},
  })

  if (Object.keys(result.errors).length > 0) {
    res.status(400).send()
    return
  }

  req.query = result.validated.query
  req.body = result.validated.body
  next()
}
