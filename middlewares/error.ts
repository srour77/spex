import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/customError';

const errorMiddleware: ErrorRequestHandler = async (err, req, res, next): Promise<void> => {
  console.log(err);
  let statusCode: number, message: string;
  if(err instanceof CustomError) {
    message = err.message;
    statusCode = err.statusCode;
  } else {
    message = 'something went wrong, pls try again'
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }

  res.status(statusCode).json({ message });
};

export default errorMiddleware;
