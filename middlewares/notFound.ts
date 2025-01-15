import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const NotFoundMiddleware: RequestHandler<any, { message: string }> = async (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'this resource does not exist' });
};

export default NotFoundMiddleware;
