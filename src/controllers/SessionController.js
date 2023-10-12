import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { connection } from '../database/knex/index.js';
import { AppError } from '../utils/AppError.js';
import authConfig from '../configs/auth.js';

export class SessionController {
  /** @type {import('express').RequestHandler} */
  async create(req, res) {
    const { email, password } = req.body;

    const user = await connection('users').where({ email }).first();
    if (!user) {
      throw new AppError('E-mail e/ou senha incorreta', 401);
    }

    const pwdMatch = await bcrypt.compare(password, user.password);
    if (!pwdMatch) {
      throw new AppError('E-mail e/ou senha incorreta', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = jwt.sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return res.status(201).json({ user, token });
  }
}
