import jwt from 'jsonwebtoken';

import authConfig from '../configs/auth.js';
import { AppError } from '../utils/AppError.js';

/** @type {import('express').RequestHandler } */
export function ensureAuthenticaded(request, response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('Missing authentication.', 401);
  }

  const [_, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = jwt.verify(token, authConfig.jwt.secret);
    request.user = {
      id: Number(user_id),
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid authentication.', 401);
  }
}
