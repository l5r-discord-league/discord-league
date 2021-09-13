import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary, Query } from 'express-serve-static-core'
import { ObjectSchema } from 'joi'

interface ValidationProperties {
  readonly body?: ObjectSchema
  readonly query?: ObjectSchema
}

export type ValidatedRequest<
  ReqSchema extends ValidationProperties,
  Params extends ParamsDictionary = ParamsDictionary,
  QuerySchema = ReqSchema['query'] extends ObjectSchema<infer C> ? C : Query,
  BodySchema = ReqSchema['body'] extends ObjectSchema<infer C> ? C : undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = Request<Params, any, BodySchema, QuerySchema>

export const validate =
  (schemas: ValidationProperties) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (schemas.query) {
      const result = schemas.query.validate(req.query)
      if (result.error) {
        res.sendStatus(400)
        return
      }
      req.query = result.value
    }

    if (schemas.body) {
      const result = schemas.body.validate(req.body)
      if (result.error) {
        res.sendStatus(400)
        return
      }
      req.body = result.value
    }

    next()
  }
