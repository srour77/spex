import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectSchema } from 'joi';

const validateSchema = (schema: ObjectSchema) => {
  const validateReqBody: RequestHandler<any, { message: string }> = async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) { res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: error.details[0].message }); return };
    next();
  };

  return validateReqBody;
};

export default validateSchema;
