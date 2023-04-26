import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { CustomRequest } from '../types';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config';

export const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  // else if (error.name === 'ValidationError') {
  //   return response.status(400).json({ error: error.message });
  // }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Unauthorized User' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }
  return next(error);
};

export const jwtAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(`${token}`, `${SECRET_KEY}`);
    (req as CustomRequest).token = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

// export const tokenExtractor = (
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ) => {
//   const auth = request.get('authorization');
//   if (auth && auth.startsWith('Bearer ')) {
//     request.token = auth.replace('Bearer ', '');
//   }
//   next();
// };
